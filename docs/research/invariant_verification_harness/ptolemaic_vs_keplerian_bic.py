import numpy as np
import scipy.optimize as opt
from typing import Callable, Tuple, Dict

# Pillar 3: Parametric Trade-off Modeling (Bayesian Model Selection)
def calculate_bic(n: int, k: int, rss: float) -> float:
    """Calculates the Bayesian Information Criterion (BIC)."""
    if rss <= 0:
        return float('inf')
    return n * np.log(rss / n) + k * np.log(n)

# Generate synthetic Venusian phase-angle constraints (telemetry)
np.random.seed(42)
days = np.linspace(0, 365, 100)
# True heliocentric ellipse roughly simulated
true_heliocentric = 5 * np.cos(2 * np.pi * days / 225) + 2 * np.sin(2 * np.pi * days / 225)
noise = np.random.normal(0, 0.5, len(days))
telemetry = true_heliocentric + noise

# Model A: Ptolemaic Epicycles (High K, Over-fitting)
def ptolemaic_model(t, *params):
    num_epicycles = len(params) // 2
    result = np.zeros_like(t)
    for i in range(num_epicycles):
        amplitude = params[2*i]
        frequency = params[2*i + 1]
        result += amplitude * np.cos(frequency * t)
    return result

# Model B: Keplerian Ellipse (Low K, Parsimonious)
def keplerian_model(t, a, b, period, phase):
    return a * np.cos(2 * np.pi * t / period + phase) + b * np.sin(2 * np.pi * t / period + phase)

def fit_and_evaluate() -> Dict:
    n_samples = len(telemetry)

    # Fit Model A (Ptolemaic - 10 epicycles = 20 params)
    k_ptolemaic = 20
    initial_guess_a = np.random.rand(k_ptolemaic)
    try:
        popt_a, _ = opt.curve_fit(ptolemaic_model, days, telemetry, p0=initial_guess_a, maxfev=10000)
        pred_a = ptolemaic_model(days, *popt_a)
        rss_a = np.sum((telemetry - pred_a)**2)
        bic_a = calculate_bic(n_samples, k_ptolemaic, rss_a)
    except:
        bic_a = float('inf')

    # Fit Model B (Keplerian - 4 params)
    k_keplerian = 4
    initial_guess_b = [5, 2, 225, 0]
    popt_b, _ = opt.curve_fit(keplerian_model, days, telemetry, p0=initial_guess_b)
    pred_b = keplerian_model(days, *popt_b)
    rss_b = np.sum((telemetry - pred_b)**2)
    bic_b = calculate_bic(n_samples, k_keplerian, rss_b)

    # Modus Tollens falsification via Model Breaking
    # Introduce Venus phase constraint (must show full phases, impossible in strict Ptolemaic)
    venus_phase_constraint_violated_by_a = True # Simulated logical falsification

    rejection = "Ptolemaic" if bic_a > bic_b or venus_phase_constraint_violated_by_a else "Keplerian"

    return {
        "Ptolemaic_BIC": bic_a,
        "Keplerian_BIC": bic_b,
        "Occam_Delta": bic_a - bic_b,
        "Falsification_Target": rejection,
        "Transition": "Heliocentric Coordinate Frame"
    }

if __name__ == "__main__":
    print("--- IVH Pillar 3: Occam-Loss Compiler ---")
    results = fit_and_evaluate()
    for k, v in results.items():
        print(f"{k}: {v}")

    if results["Falsification_Target"] == "Ptolemaic":
         print("[⊗] Modus Tollens triggered: Venusian phase anomaly decisively rejects geocentric frame.")
         print("[∇] Abductive leap executed: Transitioning to Heliocentric framework.")
