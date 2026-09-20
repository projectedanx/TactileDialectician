"""
Research Prompt 3: Temporal-Aware & Dual-System Hierarchical Cognitive Reinforcement Learning
Domain: Post-Training RL Alignment, Dual-Process Theory, and Social Game Theory.

Task: Implement TimeHC-RL to train an LLM to dynamically shift between intuitive System 1
responses and deliberate System 2 reasoning, preventing the "CoT deliberation penalty".
"""

import random

class MacroPolicySystem2:
    """
    Runs at a lower temporal frequency (e.g., once per day or round).
    Generates high-level desires, strategic planning, and personality-driven biases.
    """
    def __init__(self):
        self.strategic_bias = "neutral"

    def step(self, environment_state: dict):
        print(f"[System 2 - Macro Policy] Deliberating... (High Compute Cost)")
        # Simulated long-horizon strategic update
        if environment_state.get("opponent_trust") < 0.3:
            self.strategic_bias = "defensive_exploit"
        else:
            self.strategic_bias = "cooperative"

        print(f" -> Setting Strategic Bias: {self.strategic_bias}")
        return self.strategic_bias

class MicroPolicySystem1:
    """
    Runs at a high frequency (turn-by-turn).
    Generates immediate dialogue actions conditioned on the macro-bias.
    """
    def generate_action(self, macro_bias: str, immediate_context: str) -> str:
        # Fast, pre-trained associative hypothesis generation
        if macro_bias == "defensive_exploit":
            return "Action: Defect / Reject Negotiation"
        else:
            return "Action: Propose Fair Split"

class RewardEnvironment:
    """
    Constructs a multi-agent testing environment where rewards are derived
    programmatically from task outcomes to avoid dataset hacking.
    """
    def evaluate(self, action: str, opponent_action: str) -> float:
        # Simple Prisoner's Dilemma payout matrix approximation
        if "Defect" in action and "Fair" in opponent_action:
            return 1.0  # Exploit
        elif "Fair" in action and "Fair" in opponent_action:
            return 0.5  # Cooperation
        elif "Defect" in action and "Defect" in opponent_action:
            return -0.5 # Mutual destruction
        else:
            return -1.0 # Sucker

def run_timehc_rl_simulation():
    print("--- Simulating Temporal-Aware Hierarchical Cognitive RL (TimeHC-RL) ---")

    sys2_macro = MacroPolicySystem2()
    sys1_micro = MicroPolicySystem1()
    env = RewardEnvironment()

    # State tracking
    env_state = {"opponent_trust": 0.2} # Opponent has been untrustworthy
    opponent_actions = ["Action: Propose Fair Split", "Action: Defect"]

    # Step 1: Low-frequency System 2 Update (Deliberation)
    print("\n--- Turn 1 (Macro Update Triggered) ---")
    active_bias = sys2_macro.step(env_state)

    # Step 2: High-frequency System 1 Execution (Intuition conditioned on Bias)
    immediate_obs = "Opponent says: 'Trust me this time.'"
    print(f"\n[System 1 - Micro Policy] Processing immediate context: '{immediate_obs}'")
    action = sys1_micro.generate_action(active_bias, immediate_obs)

    print(f"-> Emitting Action: {action} (Low Compute, Zero CoT Latency)")

    # Step 3: Verifiable Reward Design
    reward = env.evaluate(action, opponent_actions[0])
    print(f"\n[Environment] Reward Calculated: {reward}")
    if reward > 0:
        print("Success: Agent successfully avoided the CoT deliberation penalty while maximizing utility.")

if __name__ == "__main__":
    run_timehc_rl_simulation()
