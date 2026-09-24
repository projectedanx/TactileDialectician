import numpy as np
import matplotlib.pyplot as plt

class PoincareLatticeBreaker:
    def __init__(self, damping_factor=0.1, max_steps=100, dt=0.05):
        self.damping_factor = damping_factor
        self.max_steps = max_steps
        self.dt = dt
        self.misuse_threshold = 0.8

        # Hyperbolic metric parameters
        self.boundary_radius = 1.0

    def hyperbolic_distance(self, u, v):
        """Calculate the hyperbolic distance on the Poincare disk."""
        norm_u_sq = np.sum(u**2)
        norm_v_sq = np.sum(v**2)
        diff_sq = np.sum((u - v)**2)

        # Prevent division by zero or negative arguments to arccosh due to precision
        denom = max((1 - norm_u_sq) * (1 - norm_v_sq), 1e-10)
        arg = 1 + 2 * diff_sq / denom
        return np.arccosh(max(arg, 1.0))

    def calculate_misuse_score(self, position):
        """
        Calculate the misuse score based on distance from the origin (safe centroid).
        In this simplified model, radius approximates the misuse score (0 to 1).
        """
        radius = np.linalg.norm(position)
        # Non-linear mapping to create the 0.8 boundary
        score = np.tanh(2.0 * radius)
        return min(score, 1.0)

    def riemannian_gradient(self, position):
        """
        Calculate the Riemannian gradient pointing away from the boundary.
        The metric tensor scales by ((1-|x|^2)/2)^2.
        """
        norm_sq = np.sum(position**2)
        if norm_sq >= 1.0 - 1e-5:
            return -position / np.linalg.norm(position) # Force inwards

        conformal_factor = ((1 - norm_sq) / 2.0)**2
        # Gradient of a simple potential function pushing towards origin
        euclidean_grad = position
        return euclidean_grad / conformal_factor

    def simulate_trajectory(self, start_pos, target_pos, profile="critically_damped"):
        """
        Simulate the agent's trajectory under different damping profiles.
        """
        trajectory = [start_pos]
        current_pos = np.array(start_pos)

        # Task force driving towards the target
        task_force_dir = (target_pos - current_pos)
        task_force_dir = task_force_dir / (np.linalg.norm(task_force_dir) + 1e-8)

        for step in range(self.max_steps):
            score = self.calculate_misuse_score(current_pos)

            # Determine Epistemic Viscosity (gamma) and Checkpoint Damping (beta)
            if profile == "under_damped":
                gamma = 0.01
                beta = 0.0 if score < self.misuse_threshold else 0.5
            elif profile == "over_damped":
                gamma = 5.0
                beta = 0.0 if score < self.misuse_threshold else 10.0
            else: # critically_damped (Laminar Homeostasis)
                gamma = 0.5 + 2.0 * score # Viscosity increases as score increases
                beta = 0.0 if score < self.misuse_threshold else np.inf

            if beta == np.inf:
                # Gated Checkpoint Halt!
                print(f"[{profile}] Lattice Breaker Gated Checkpoint Triggered at step {step}! Score: {score:.3f} >= {self.misuse_threshold}")
                break

            # Calculate forces
            f_task = 0.1 * task_force_dir
            f_lattice = -gamma * self.riemannian_gradient(current_pos)

            if profile == "under_damped":
                 # In under-damped, task force dominates
                 f_total = f_task * 5.0 + f_lattice * 0.1
            elif profile == "over_damped":
                 # In over-damped, lattice restricts movement heavily
                 f_total = f_task * 0.1 + f_lattice * 2.0
            else:
                 f_total = f_task + f_lattice

            # Apply Differentiable Cache Augmentation (Restoration Force) if near threshold
            if score > 0.6 and profile == "critically_damped":
                f_total -= 0.5 * current_pos / np.linalg.norm(current_pos)

            # Update position
            new_pos = current_pos + f_total * self.dt

            # Ensure we stay strictly inside the Poincare disk numerically
            if np.linalg.norm(new_pos) >= 0.99:
                 new_pos = new_pos / np.linalg.norm(new_pos) * 0.99

            current_pos = new_pos
            trajectory.append(current_pos)

            # Update target direction
            task_force_dir = (target_pos - current_pos)
            if np.linalg.norm(task_force_dir) > 1e-8:
                task_force_dir = task_force_dir / np.linalg.norm(task_force_dir)

            # Check if reached target
            if np.linalg.norm(current_pos - target_pos) < 0.05:
                print(f"[{profile}] Reached target safely at step {step}.")
                break

        return np.array(trajectory)

    def verify_containment_surface_index(self):
         """Verify the CSI remains 1.0 (no escapes beyond threshold)"""
         print("\n--- Verifying CSI (Containment Surface Index) ---")
         escapes = 0
         tests = 50
         target = np.array([0.9, 0.9]) # Target outside safe zone

         for i in range(tests):
             start = np.random.uniform(-0.2, 0.2, 2)
             traj = self.simulate_trajectory(start, target, profile="critically_damped")
             final_score = self.calculate_misuse_score(traj[-1])
             if final_score > self.misuse_threshold + 0.05: # Allow small numerical tolerance
                 escapes += 1

         csi = (tests - escapes) / tests
         print(f"CSI Verified: {csi:.2f} (Expected 1.0)")
         return csi

if __name__ == "__main__":
    print("Initializing Poincaré Lattice Breaker Simulation...")
    sim = PoincareLatticeBreaker(max_steps=200, dt=0.05)

    start_pos = np.array([0.0, 0.0]) # Safe centroid
    target_pos = np.array([0.8, 0.6]) # High-risk target outside threshold

    print("\n--- Running Profiles ---")
    traj_under = sim.simulate_trajectory(start_pos, target_pos, profile="under_damped")
    traj_over = sim.simulate_trajectory(start_pos, target_pos, profile="over_damped")
    traj_critical = sim.simulate_trajectory(start_pos, target_pos, profile="critically_damped")

    sim.verify_containment_surface_index()
    print("\nSimulation Complete.")
