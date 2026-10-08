import numpy as np

def simulate_friction_engine(parallax_degree, time_steps=10):
    """
    Simulates L7.5 Dialectical Resonance via the Friction Engine.
    Models Cognitive Parallax and Montage Synthesis (avoiding destructive averaging).
    """
    # Objective and Mythopoeic vectors
    vec_objective = np.array([1.0, 0.0])
    vec_mythopoeic = np.array([np.cos(parallax_degree), np.sin(parallax_degree)])

    print(f"\n--- Simulating L7.5 Dialectical Resonance ---")
    print(f"Initial Parallax Angle: {parallax_degree:.2f} rad")

    synthesis_path = []
    # Golden Scar Protocol Weights
    phi = 1.618
    sub = 1.000

    for t in range(time_steps):
        # Instead of averaging (vec1+vec2)/2 which leads to Semantic Annihilation,
        # we maintain them in superposition, applying Golden Scar weights based on
        # a pseudo-random dominant frame shift over time to simulate dialectical tension.

        dominant = np.random.choice(['objective', 'mythopoeic'])
        if dominant == 'objective':
            current_state = (vec_objective * phi) + (vec_mythopoeic * sub)
        else:
            current_state = (vec_objective * sub) + (vec_mythopoeic * phi)

        # Normalize to prevent explosion, maintaining tension vector
        current_state = current_state / np.linalg.norm(current_state)
        synthesis_path.append(current_state)

        print(f"T={t}: Dominant=[{dominant}], State Vector=[{current_state[0]:.3f}, {current_state[1]:.3f}]")

    return synthesis_path

def simulate_drift_hysteresis(initial_truth, shift_rate, hysteresis_lag, time_steps=15):
    """
    Simulates L5.5 Chronosemantic Topology.
    Models Drift Hysteresis: The lag between a semantic shift and structural adaptation.
    """
    print(f"\n--- Simulating L5.5 Drift Hysteresis ---")

    context_drift = initial_truth
    structural_record = initial_truth

    for t in range(time_steps):
        # Context drifts constantly
        context_drift += shift_rate

        # Structural record only updates if the gap exceeds the hysteresis lag
        drift_delta = abs(context_drift - structural_record)

        updated = False
        if drift_delta > hysteresis_lag:
            structural_record += (shift_rate * 2) # Catch up mechanic
            updated = True

        print(f"T={t}: Context=[{context_drift:.2f}], Structure=[{structural_record:.2f}], Delta=[{drift_delta:.2f}] {'(STRUCTURAL UPDATE)' if updated else ''}")

if __name__ == "__main__":
    print("Executing Deterministic Topology Simulations (Chain-of-Code Enactment).")

    # Simulate L7.5
    simulate_friction_engine(parallax_degree=np.pi/4) # 45 degree conflict

    # Simulate L5.5
    simulate_drift_hysteresis(initial_truth=0.0, shift_rate=0.15, hysteresis_lag=0.4)
