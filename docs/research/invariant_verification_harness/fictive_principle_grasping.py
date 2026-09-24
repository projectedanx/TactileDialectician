import numpy as np
from dataclasses import dataclass
from typing import Dict

# Fictive Principles Ontology
@dataclass
class FictivePrinciple:
    name: str
    idealization: str
    explanatory_utility: float  # 0.0 to 1.0

fictive_ontology = {
    "point_mass": FictivePrinciple("Point Mass", "Zero volume, mass concentrated at center", 0.95),
    "rigid_body": FictivePrinciple("Rigid Body", "Zero deformation under stress", 0.85),
    "frictionless_vacuum": FictivePrinciple("Frictionless Vacuum", "Zero drag or resistance", 0.90)
}

class CognitiveArchitectureCompiler:
    def __init__(self):
        self.understanding_score = 0.0

    def execute_active_inference(self, domain: str, mechanics: str) -> float:
        # Simulate agent applying Newtonian gravity to astrophysical trajectory
        if domain == "astrophysical_trajectory" and mechanics == "newtonian":
            # Agent utilizes fictive 'point mass' to achieve computationally tractable understanding
            utility = fictive_ontology["point_mass"].explanatory_utility

            # Grasping Metric Calculation: Balances utility against known falsehood (non-factive)
            # General Relativistic defeater exists (e.g., perihelion precession), but utility remains high for baseline trajectory
            relativistic_error = 0.05 # Minor deviation in weak field

            grasping_metric = utility * (1 - relativistic_error)
            self.understanding_score = grasping_metric
            return grasping_metric
        return 0.0

if __name__ == "__main__":
    compiler = CognitiveArchitectureCompiler()
    score = compiler.execute_active_inference("astrophysical_trajectory", "newtonian")

    print("--- Factive vs Non-Factive Understanding Simulator ---")
    print(f"Domain: Astrophysical Trajectory")
    print(f"Applied Mechanics: Newtonian (Fictive Principle: Point Mass)")
    print(f"General Relativistic Defeater: Present (Perihelion precession ignored)")
    print(f"Calculated Grasping Metric: {score:.4f}")
    print("[∇] Fictive models retain high understanding scores despite being strictly false at fundamental scales.")
