import math
import json
from typing import List, Dict, Any

class Theory:
    def __init__(self, name: str, params: int, assumptions: List[float], error: float):
        self.name = name
        self.params = params
        self.assumptions = assumptions  # list of probabilities for each assumption
        self.error = error # e.g. Mean Squared Error against observations

    def joint_probability(self) -> float:
        prob = 1.0
        for a in self.assumptions:
            prob *= a
        return prob

class OccamLossCompiler:
    def __init__(self, alpha: float = 1.0, beta: float = 1.0):
        self.alpha = alpha
        self.beta = beta

    def compute_complexity(self, theory: Theory) -> float:
        p_t = theory.joint_probability()
        # Avoid log(0)
        p_t = max(p_t, 1e-9)
        return self.alpha * theory.params - self.beta * math.log(p_t)

    def compute_loss(self, theory: Theory) -> float:
        complexity = self.compute_complexity(theory)
        return theory.error + complexity

    def pareto_optimize(self, theories: List[Theory], significance_threshold: float = 3.0) -> Theory:
        """
        Selects the simplest adequate approximation.
        Rejects a more complex model if its error reduction isn't significant.
        """
        if not theories:
            raise ValueError("No theories provided")

        best_theory = theories[0]
        best_loss = self.compute_loss(best_theory)

        for theory in theories[1:]:
            loss = self.compute_loss(theory)

            # If the current theory has lower loss, it might be better
            if loss < best_loss:
                # Check for significant error reduction if complexity increases
                complexity_diff = self.compute_complexity(theory) - self.compute_complexity(best_theory)
                error_diff = best_theory.error - theory.error

                # If it's more complex, it MUST provide significant error reduction
                if complexity_diff > 0:
                    if error_diff >= significance_threshold:
                        best_theory = theory
                        best_loss = loss
                else:
                    # If it's simpler (or equal) AND has lower loss, we accept it
                    best_theory = theory
                    best_loss = loss

        return best_theory

def run_simulation():
    print("--- Occam Loss Compiler Simulation ---")

    # Galileo's observation of phases of Venus
    # Ptolemaic model (Geocentric)
    # Requires dozens of epicycles (params) and many assumptions (equants, deferents, etc.)
    # Error is somewhat low because of epicycle curve-fitting, but non-zero.
    ptolemaic = Theory(
        name="Ptolemaic Geocentrism",
        params=40,
        assumptions=[0.5] * 15, # many unlikely assumptions
        error=5.0
    )

    # Copernican model (Heliocentric)
    # Requires far fewer parameters (simple orbits) and fewer assumptions.
    # Error is very low when evaluated against Galileo's phases of Venus.
    copernican = Theory(
        name="Copernican Heliocentrism",
        params=6,
        assumptions=[0.9, 0.9, 0.85], # fewer, more plausible assumptions
        error=1.2
    )

    compiler = OccamLossCompiler(alpha=0.5, beta=2.0)

    print(f"Theory 1: {ptolemaic.name}")
    print(f"  Params: {ptolemaic.params}, Assumptions: {len(ptolemaic.assumptions)}")
    print(f"  Complexity Penalty: {compiler.compute_complexity(ptolemaic):.2f}")
    print(f"  Total Occam Loss: {compiler.compute_loss(ptolemaic):.2f}\n")

    print(f"Theory 2: {copernican.name}")
    print(f"  Params: {copernican.params}, Assumptions: {len(copernican.assumptions)}")
    print(f"  Complexity Penalty: {compiler.compute_complexity(copernican):.2f}")
    print(f"  Total Occam Loss: {compiler.compute_loss(copernican):.2f}\n")

    selected = compiler.pareto_optimize([ptolemaic, copernican])

    print(f"Selected Theory (Simplest Adequate Approximation): {selected.name}")
    print("--- Simulation Complete ---")

if __name__ == "__main__":
    run_simulation()
