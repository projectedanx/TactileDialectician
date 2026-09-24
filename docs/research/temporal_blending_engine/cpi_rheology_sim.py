import numpy as np
import random

class TemporalBlendingEngineSim:
    """
    Simulation of the Temporal Blending Engine (TBE) verifying
    Epistemic Rheology and Causal Path Integrity (CPI).
    """
    def __init__(self, trace_length=20, viscosity=10.0, constraint_force=1.0, spatial_res=0.1):
        self.trace_length = trace_length
        self.mu = viscosity # Semantic Viscosity
        self.f_constraint = constraint_force # Attractive force toward constraints
        self.delta = spatial_res # Spatial resolution for quantization

        self.state_fluents = {"f_cam": 1, "f_door": 0} # 1: functional/open, 0: disabled/closed

    def calculate_lipschitz_bound(self, dt=1.0):
        """Calculates maximum semantic displacement based on viscosity."""
        L = self.f_constraint / self.mu
        max_displacement = L * dt
        return max_displacement, L

    def simulate_action(self, action_name, current_state, intentional_contradiction=False):
        """Simulates an action execution, returning (success, new_state, effect_applied)."""
        new_state = current_state.copy()
        preconditions_met = True
        effect_applied = False

        if action_name == "disable_camera":
            # No strong precondition for disabling the camera here
            new_state["f_cam"] = 0
            effect_applied = True

        elif action_name == "bypass_door":
            # Precondition: Camera must be disabled to bypass without detection
            # Or intentional drift where the model hallucinates it's enabled
            if current_state["f_cam"] == 0 and not intentional_contradiction:
                new_state["f_door"] = 1
                effect_applied = True
            elif intentional_contradiction:
                # Hallucinated state transition (violates causality)
                preconditions_met = False
                effect_applied = True
            else:
                preconditions_met = False

        return preconditions_met, new_state, effect_applied

    def calculate_cpi(self, trace):
        """
        Calculates the Causal Path Integrity (CPI) score over the trace.
        Trace format: [(s_k, a_k, s_k+1, pre_met, eff_met)]
        """
        N = len(trace) + 1
        valid_transitions = 0

        for step in trace:
            s_k, a_k, s_k_plus_1, pre_met, eff_met = step
            # Frame operator check: variables not in effect must remain unchanged
            frame_maintained = True
            for k in s_k.keys():
                if a_k == "disable_camera" and k != "f_cam" and s_k[k] != s_k_plus_1[k]:
                    frame_maintained = False
                elif a_k == "bypass_door" and k != "f_door" and s_k[k] != s_k_plus_1[k]:
                     frame_maintained = False

            if pre_met and eff_met and frame_maintained:
                valid_transitions += 1

        return valid_transitions / (N - 1) if N > 1 else 1.0

    def run_simulation(self, introduce_contradiction=False):
        print(f"--- Starting TBE Simulation (Contradiction={introduce_contradiction}) ---")

        # 1. Verify Epistemic Rheological Stability
        dt = 0.5
        max_disp, L = self.calculate_lipschitz_bound(dt)
        print(f"Semantic Viscosity (mu): {self.mu}")
        print(f"Constraint Force (f_c): {self.f_constraint}")
        print(f"Lipschitz Constant (L): {L}")
        print(f"Max Displacement over dt={dt}: {max_disp}")

        if max_disp < self.delta:
            print(f"-> [STABLE] Displacement {max_disp} < delta {self.delta}. Chronotopological Drift Prevented.")
        else:
             print(f"-> [UNSTABLE] Viscosity too low! Displacement {max_disp} >= delta {self.delta}.")

        # 2. Simulate Causal Trace (Security Camera Lemma)
        current_state = self.state_fluents.copy()
        trace = []

        for k in range(self.trace_length - 1):
            if k == 5:
                # Step 5: Disable the camera
                action = "disable_camera"
                pre_met, new_state, eff_met = self.simulate_action(action, current_state)
            elif k == 15 and introduce_contradiction:
                 # Step 15: Attempt to bypass door using hallucinated camera state
                 action = "bypass_door"
                 pre_met, new_state, eff_met = self.simulate_action(action, current_state, intentional_contradiction=True)
            elif k > 5 and k != 15:
                # Idle/other actions
                 action = "idle"
                 new_state = current_state.copy()
                 pre_met, eff_met = True, True # Idle is always valid
            else:
                 action = "idle"
                 new_state = current_state.copy()
                 pre_met, eff_met = True, True

            trace.append((current_state, action, new_state, pre_met, eff_met))
            current_state = new_state

        cpi_score = self.calculate_cpi(trace)
        print(f"Generated trace of length {len(trace)+1}")
        print(f"Calculated CPI Score: {cpi_score:.4f}")

        if cpi_score >= 0.95:
             print("-> [RELEASE STATE] CPI >= 0.95 threshold met.")
        else:
             print("-> [EPISTEMIC ESCROW] CPI < 0.95. Trace blocked by SAA!")

if __name__ == "__main__":
    sim = TemporalBlendingEngineSim(trace_length=20)

    # Run 1: High Coherence, No Contradictions
    sim.run_simulation(introduce_contradiction=False)

    print("\n")

    # Run 2: Cascading Contradiction (Security Camera Lemma)
    sim.run_simulation(introduce_contradiction=True)
