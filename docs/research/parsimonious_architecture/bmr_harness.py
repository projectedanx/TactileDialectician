import math
from typing import List, Dict, Any

class ReasoningChain:
    def __init__(self, id: str, accuracy: float, prior_prob: float, posterior_prob: float, assumptions: int):
        self.id = id
        self.accuracy = accuracy # Fit to data
        self.prior_prob = prior_prob # P(theta | G)
        self.posterior_prob = posterior_prob # P(theta | D, G)
        self.assumptions = assumptions

    def kl_divergence(self) -> float:
        """
        Approximate KL Divergence D_KL(Posterior || Prior) representing Complexity.
        For simplicity in this simulation, we use a basic discrete approximation.
        """
        # Ensure non-zero probabilities
        post = max(self.posterior_prob, 1e-9)
        prior = max(self.prior_prob, 1e-9)
        return abs(post * math.log(post / prior))

    def marginal_likelihood(self) -> float:
        """
        Evidence approx = Accuracy - Complexity
        """
        complexity = self.kl_divergence() + (0.1 * self.assumptions) # additional penalty for raw assumptions
        return self.accuracy - complexity

class BMRHarness:
    def __init__(self):
        self.active_chains: List[ReasoningChain] = []
        self.consolidated_principles: List[str] = []

    def theory_building_phase(self, chains: List[ReasoningChain]):
        print(f"Theory Building: Generated {len(chains)} candidate reasoning chains.")
        self.active_chains = chains

    def axiomatic_pruning_module(self):
        print("Axiomatic Pruning Module: Evaluating Marginal Likelihoods...")
        pruned_chains = []
        best_chain = None
        best_evidence = -float('inf')

        for chain in self.active_chains:
            evidence = chain.marginal_likelihood()
            print(f"  Chain {chain.id}: KL Div={chain.kl_divergence():.3f}, Assumptions={chain.assumptions}, Evidence={evidence:.3f}")
            if evidence > best_evidence:
                best_evidence = evidence
                best_chain = chain

            # Prune threshold (arbitrary for simulation)
            if evidence > 0.5:
                pruned_chains.append(chain)

        print(f"Pruned down to {len(pruned_chains)} viable chains. Best is {best_chain.id} (Evidence: {best_evidence:.3f})")
        self.active_chains = [best_chain] if best_chain else []

    def self_consolidation_loop(self):
        print("Self-Consolidation Loop: Compressing active chains into fictive principles.")
        for chain in self.active_chains:
            principle = f"Principle derived from {chain.id} (Accuracy: {chain.accuracy:.2f}, Assumptions: {chain.assumptions})"
            self.consolidated_principles.append(principle)
            print(f"  Consolidated: {principle}")
        self.active_chains = [] # Clear context window

def run_simulation():
    print("--- BMR Cognitive Harness Simulation ---")
    harness = BMRHarness()

    # 1. Theory Building
    # Chain A: Highly complex, ad-hoc (over-fitted). Low prior, high posterior (it memorized the data).
    chain_a = ReasoningChain("AdHoc_Overfit", accuracy=0.99, prior_prob=0.01, posterior_prob=0.95, assumptions=12)
    # Chain B: Simple, elegant. Good prior, decent posterior.
    chain_b = ReasoningChain("Parsimonious_Causal", accuracy=0.90, prior_prob=0.60, posterior_prob=0.85, assumptions=2)
    # Chain C: Under-fitted. Great prior, terrible posterior/accuracy.
    chain_c = ReasoningChain("Underfit_Idealized", accuracy=0.40, prior_prob=0.90, posterior_prob=0.30, assumptions=0)

    harness.theory_building_phase([chain_a, chain_b, chain_c])

    # 2. Pruning
    harness.axiomatic_pruning_module()

    # 3. Consolidation
    harness.self_consolidation_loop()

    print("--- Simulation Complete ---")

if __name__ == "__main__":
    run_simulation()
