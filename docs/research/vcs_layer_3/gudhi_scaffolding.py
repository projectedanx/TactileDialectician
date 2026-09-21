import numpy as np
import gudhi
import logging

logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')

class TDA_Harness:
    def __init__(self, beta1_threshold=0.5, beta2_threshold=0.4):
        self.beta1_threshold = beta1_threshold
        self.beta2_threshold = beta2_threshold

    def extract_activations(self, num_points=200, dim=768, anomaly_type="normal"):
        """
        Simulates the extraction of activation vectors from an LLM.
        """
        if anomaly_type == "normal":
            # Random uniform noise (few persistent features)
            return np.random.uniform(-1, 1, (num_points, dim))
        elif anomaly_type == "circular_loop":
            # Generate points on a 1D circle in high-D space (creates a beta_1 loop)
            t = np.linspace(0, 2 * np.pi, num_points)
            points = np.zeros((num_points, dim))
            points[:, 0] = np.cos(t)
            points[:, 1] = np.sin(t)
            points += np.random.normal(0, 0.1, (num_points, dim))
            return points
        elif anomaly_type == "epistemic_hollowness":
             # Generate points on a 2D sphere in high-D space (creates a beta_2 void)
             u = np.random.uniform(0, 2 * np.pi, num_points)
             v = np.random.uniform(0, np.pi, num_points)
             points = np.zeros((num_points, dim))
             points[:, 0] = np.sin(v) * np.cos(u)
             points[:, 1] = np.sin(v) * np.sin(u)
             points[:, 2] = np.cos(v)
             points += np.random.normal(0, 0.1, (num_points, dim))
             return points
        else:
            raise ValueError("Unknown anomaly type")

    def compute_persistent_homology(self, point_cloud, max_edge_length=3.0, max_dimension=3):
        """
        Computes the Vietoris-Rips complex and returns the persistence barcode.
        """
        rips_complex = gudhi.RipsComplex(points=point_cloud, max_edge_length=max_edge_length)
        simplex_tree = rips_complex.create_simplex_tree(max_dimension=max_dimension)
        persistence = simplex_tree.persistence()
        return persistence

    def analyze_barcode(self, persistence):
        """
        Analyzes persistence lengths to detect topological anomalies.
        """
        betti_1_max_persistence = 0.0
        betti_2_max_persistence = 0.0

        for dim, (birth, death) in persistence:
            if death == float('inf'): # Ignore infinite persistence for anomaly detection
                continue
            pers = death - birth
            if dim == 1:
                betti_1_max_persistence = max(betti_1_max_persistence, pers)
            elif dim == 2:
                betti_2_max_persistence = max(betti_2_max_persistence, pers)

        logging.info(f"Max Beta_1 Persistence: {betti_1_max_persistence:.4f}")
        logging.info(f"Max Beta_2 Persistence: {betti_2_max_persistence:.4f}")

        if betti_1_max_persistence > self.beta1_threshold:
             logging.warning("🚨 ANOMALY DETECTED: Circular Reasoning Trap (High Beta_1). Triggering SIC_VERIFY failsafe.")
             return "CIRCULAR_LOOP"

        if betti_2_max_persistence > self.beta2_threshold:
             logging.warning("🚨 ANOMALY DETECTED: Epistemic Hollowness (High Beta_2). Triggering Epistemic Escrow.")
             return "HOLLOWNESS"

        logging.info("Topology normal. No ruptures detected.")
        return "NORMAL"

if __name__ == "__main__":
    harness = TDA_Harness()

    print("\n--- Testing Normal Activations ---")
    normal_pts = harness.extract_activations(anomaly_type="normal", dim=5) # Reduced dim for computation speed in test
    persistence = harness.compute_persistent_homology(normal_pts, max_edge_length=2.0)
    harness.analyze_barcode(persistence)

    print("\n--- Testing Circular Logic Injection (Beta_1 Anomaly) ---")
    loop_pts = harness.extract_activations(anomaly_type="circular_loop", dim=5)
    persistence_loop = harness.compute_persistent_homology(loop_pts, max_edge_length=2.0)
    harness.analyze_barcode(persistence_loop)

    print("\n--- Testing Epistemic Hollowness Injection (Beta_2 Anomaly) ---")
    hollow_pts = harness.extract_activations(anomaly_type="epistemic_hollowness", dim=5)
    persistence_hollow = harness.compute_persistent_homology(hollow_pts, max_edge_length=2.0)
    harness.analyze_barcode(persistence_hollow)
