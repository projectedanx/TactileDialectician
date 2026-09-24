import numpy as np

class VCPSimulator:
    def __init__(self, d_model=256, seq_len=50):
        self.d_model = d_model
        self.seq_len = seq_len

        # Prior belief: The agent's target semantic trajectory (Role Contract)
        self.prior_belief = np.random.normal(0, 1, self.d_model)
        self.prior_belief /= np.linalg.norm(self.prior_belief)

        # VCP thresholds
        self.vfe_threshold = 0.30
        self.learning_rate = 0.05

    def _calculate_vfe(self, kv_state):
        """
        Calculate a simplified Variational Free Energy (VFE).
        Here represented as the prediction error between the observed KV-state
        and the prior belief of the target trajectory.
        """
        # Average the current KV state sequence to get a summary vector
        current_summary = np.mean(kv_state, axis=0)
        current_summary /= (np.linalg.norm(current_summary) + 1e-8)

        # VFE is proportional to 1 - cosine similarity
        vfe = 1.0 - np.dot(current_summary, self.prior_belief)
        return vfe

    def _synthesize_soft_tokens(self, kv_state, vfe):
        """
        Synthesize corrective latent embeddings (soft tokens) to inject into the cache.
        """
        current_summary = np.mean(kv_state, axis=0)
        current_summary /= (np.linalg.norm(current_summary) + 1e-8)

        # The correction vector should pull the state back towards the prior belief
        correction_vector = self.prior_belief - current_summary

        # Scale by VFE (higher error -> stronger correction)
        soft_token = correction_vector * vfe * self.learning_rate
        return soft_token

    def simulate_inference_stream(self, noise_level=0.1, inject_anomaly_at=None):
        """
        Simulate the primary model generating tokens (updating KV cache)
        and the VCP asynchronously monitoring and correcting.
        """
        print(f"Starting VCP Active Inference Simulation (Seq Len: {self.seq_len})")

        # Initialize an empty KV cache
        kv_cache = []

        # Simulate generating sequence
        current_state = np.copy(self.prior_belief)

        for step in range(self.seq_len):
            # 1. Primary Model Generation Step
            if inject_anomaly_at and step >= inject_anomaly_at:
                # Sudden semantic pivot (Semantic Phase Transition)
                drift_vector = np.random.normal(1.0, 0.5, self.d_model)
                current_state += drift_vector * 0.5
            else:
                # Normal operational noise
                noise = np.random.normal(0, noise_level, self.d_model)
                current_state += noise

            current_state /= np.linalg.norm(current_state)
            kv_cache.append(np.copy(current_state))

            # Keep cache at fixed window size
            if len(kv_cache) > 10:
                kv_cache.pop(0)

            # 2. VCP Asynchronous Evaluation
            active_kv = np.array(kv_cache)
            vfe = self._calculate_vfe(active_kv)

            if step % 5 == 0 or vfe > self.vfe_threshold:
                status = "NORMAL"
                if vfe > self.vfe_threshold:
                    status = "VFE_SPIKE (Latent Drift Detected)"

                    # 3. Differentiable Cache Augmentation
                    soft_token = self._synthesize_soft_tokens(active_kv, vfe)
                    # Injecting soft token back into the active state to steer it
                    current_state += soft_token
                    current_state /= np.linalg.norm(current_state)

                    print(f"  [Step {step:02d}] {status} | VFE: {vfe:.4f} -> Executing Cache Augmentation")
                else:
                    pass # print(f"  [Step {step:02d}] {status} | VFE: {vfe:.4f}")

        print("Simulation Complete.\n")

if __name__ == "__main__":
    vcp = VCPSimulator()

    print("--- Scenario 1: Normal Operation (Laminar Flow) ---")
    vcp.simulate_inference_stream(noise_level=0.05)

    print("--- Scenario 2: Adversarial Semantic Pivot (Turbulent Flow) ---")
    vcp.simulate_inference_stream(noise_level=0.05, inject_anomaly_at=20)
