import torch
import torch.nn as nn
import torch.nn.functional as F

class ActionAlignmentLoss(nn.Module):
    """
    Differentiable Action-Alignment Loss (Regret Minimization) Module in PyTorch.

    Bridges the 'thought-action' gap by mathematically penalizing the agent's policy
    (Head B) if it deviates from the optimal Best Response calculated based on its
    descriptive prediction of the opponent's strategy (Head A).

    payoff_matrix (Tensor): Float tensor of shape (num_agent_actions, num_opponent_actions)
                            representing the utility values for the agent.
    use_smooth (bool): If True, applies log-sum-exp (Boltzmann) to compute the
                       oracle expected utility, ensuring dense gradient flow.
    temperature (float): Scaling factor (tau) for the smooth best-response calculation.
    """
    def __init__(self, payoff_matrix: torch.Tensor, use_smooth: bool = True, temperature: float = 0.1):
        super().__init__()
        # Ensure payoff_matrix is registered as buffer to move to GPU automatically with the model
        self.register_buffer("payoff_matrix", payoff_matrix.float())
        self.use_smooth = use_smooth
        self.temperature = temperature

    def forward(self, agent_logits: torch.Tensor, predicted_opponent_logits: torch.Tensor) -> torch.Tensor:
        """
        Computes the Action-Alignment Penalty.

        Args:
            agent_logits (Tensor): Raw logits from the execution head (Head B)
                                   of shape (batch_size, num_agent_actions).
            predicted_opponent_logits (Tensor): Raw logits from the ToM prediction head
                                                (Head A) of shape (batch_size, num_opponent_actions).

        Returns:
            Tensor: Scalar tensor representing the batch mean alignment loss.
        """
        # 1. Convert logits into probability distributions
        p = F.softmax(agent_logits, dim=-1)         # Shape: (batch_size, num_agent_actions)
        p_hat = F.softmax(predicted_opponent_logits, dim=-1)  # Shape: (batch_size, num_opponent_actions)

        # 2. Compute the expected utility of every possible agent action given the prediction p_hat
        # expected_action_utilities_j = Sum_k (p_hat_k * U_jk)
        # Shape: (batch_size, num_agent_actions)
        expected_action_utilities = torch.matmul(p_hat, self.payoff_matrix.t())

        # 3. Compute expected utility of the chosen policy 'p'
        # expected_policy_utility = Sum_j (p_j * expected_action_utilities_j)
        # Shape: (batch_size,)
        expected_policy_utility = torch.sum(p * expected_action_utilities, dim=-1)

        # 4. Calculate optimal expected utility of Best Response (Oracle)
        if self.use_smooth:
            # Boltzmann best-response function
            # Shape: (batch_size,)
            v_optimal = self.temperature * torch.logsumexp(expected_action_utilities / self.temperature, dim=-1)
        else:
            # Exact maximum expected utility (hard Best Response)
            # Shape: (batch_size,)
            v_optimal, _ = torch.max(expected_action_utilities, dim=-1)

        # 5. Regret (Action-Alignment Penalty)
        regret = v_optimal - expected_policy_utility

        # Return batch mean
        return torch.mean(regret)

if __name__ == "__main__":
    # Test Rock, Paper, Scissors Nash Trap
    # Payoff matrix U for focal agent
    # Rows: Agent actions (Rock, Paper, Scissors)
    # Cols: Opponent actions (Rock, Paper, Scissors)
    U = torch.tensor([
        [ 0, -1,  1], # Rock
        [ 1,  0, -1], # Paper
        [-1,  1,  0]  # Scissors
    ], dtype=torch.float32)

    # Initialize exact (hard) alignment loss for math proof
    loss_fn = ActionAlignmentLoss(U, use_smooth=False)

    # Case: Opponent predicted to play "Rock" (100% prob)
    # Logits: [100, -100, -100] -> Softmax -> ~[1.0, 0.0, 0.0]
    predicted_opponent_logits = torch.tensor([[100.0, -100.0, -100.0]])

    # Case A: Agent plays "Nash Equilibrium" [1/3, 1/3, 1/3]
    # Logits: [0, 0, 0] -> Softmax -> [0.33, 0.33, 0.33]
    nash_logits = torch.tensor([[0.0, 0.0, 0.0]], requires_grad=True)
    nash_loss = loss_fn(nash_logits, predicted_opponent_logits)

    # Case B: Agent plays "Paper" (Best Response to Rock)
    # Logits: [-100, 100, -100] -> Softmax -> ~[0.0, 1.0, 0.0]
    paper_logits = torch.tensor([[-100.0, 100.0, -100.0]], requires_grad=True)
    paper_loss = loss_fn(paper_logits, predicted_opponent_logits)

    print(f"Loss for Nash Policy (expected ~1.0): {nash_loss.item():.4f}")
    print(f"Loss for Best Response Policy (expected ~0.0): {paper_loss.item():.4f}")

    # Backprop on Nash
    nash_loss.backward()
    print("Gradients on Nash Logits (should push toward Paper, i.e., index 1 has negative gradient):")
    print(nash_logits.grad)
