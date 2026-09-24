"""
Simulation of ALA Threshold Dynamics:
Models the evolution of the detection threshold theta(t) as a dynamic physical system.

d(theta(t))/dt = -alpha * Grad_theta(L_FalsePositive(t)) + beta * Grad_theta(L_TruePositive(t)) - eta * theta(t)
"""

import math
import matplotlib.pyplot as plt

def simulate_threshold_dynamics(
    alpha: float,
    beta: float,
    eta: float,
    steps: int = 100,
    initial_theta: float = 0.5,
    fp_gradient_constant: float = 1.0,
    tp_gradient_constant: float = 1.0
):
    """
    Simulates the trajectory of the ALA anomaly threshold theta(t).

    alpha: Learning rate for false positives (human overrides - pushes threshold up)
    beta: Learning rate for true positives (human terminates - pulls threshold down)
    eta: Decay term (Systemic Obsolescence)
    """
    theta = initial_theta
    history = [theta]

    for t in range(steps):
        # In a real system, these gradients would be stochastic and based on data.
        # Here we simulate with constants or mild oscillations.
        fp_grad = fp_gradient_constant * (math.sin(t / 5.0) * 0.5 + 0.5)
        tp_grad = tp_gradient_constant * (math.cos(t / 5.0) * 0.5 + 0.5)

        # d_theta = -alpha * Grad(FP) + beta * Grad(TP) - eta * theta
        # Note: high alpha pushes threshold UP (more permissive).
        # In the prompt: -alpha * Grad_theta(L_FP) + beta * Grad_theta(L_TP) - eta * theta.
        # Actually prompt says: "which 'pushes' the threshold up". So alpha term should be positive
        # if we are pushing up, or we define the gradient as negative.
        # Let's adjust signs to match the description:
        # alpha drives it up (permissive), beta drives it down (restrictive), eta pulls it down.

        d_theta = alpha * fp_grad - beta * tp_grad - eta * theta
        theta += d_theta

        # Bound theta between 0.01 (over-damped / restrictive) and 1.0 (under-damped / permissive)
        theta = max(0.01, min(1.0, theta))
        history.append(theta)

    return history

if __name__ == "__main__":
    steps = 150

    # 1. Under-Damped (High Alpha, Low Beta) -> Sycophantic Blindness
    under_damped = simulate_threshold_dynamics(alpha=0.3, beta=0.05, eta=0.01, steps=steps)

    # 2. Over-Damped (High Beta, Low Alpha) -> Semantic Ossification
    over_damped = simulate_threshold_dynamics(alpha=0.05, beta=0.3, eta=0.01, steps=steps)

    # 3. Critically Damped (Homeostatic Balance) -> Epistemic Homeostasis
    critically_damped = simulate_threshold_dynamics(alpha=0.15, beta=0.15, eta=0.05, steps=steps)

    print("Under-Damped Final Theta (Permissive):", round(under_damped[-1], 3))
    print("Over-Damped Final Theta (Restrictive):", round(over_damped[-1], 3))
    print("Critically-Damped Final Theta (Homeostasis):", round(critically_damped[-1], 3))
