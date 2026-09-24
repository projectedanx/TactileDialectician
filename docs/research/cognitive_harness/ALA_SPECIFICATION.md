# Anomaly Learning Agent (ALA) Specification

## I. Mathematical Formulations of the Anomaly Score

The ALA calculates its Statistical Anomaly Score by executing parallel mathematical evaluations over a sliding window of recent actions:

### 1. Neural Sequence Modeling (System 1)
The sub-symbolic component utilizes a deep sequential architecture (RNN or Transformer) trained on normal historical logs.
*   **Mechanism:** Ingests a time-ordered sequence $T = \{tool_1, tool_2, \dots, tool_n\}$.
*   **Output:** Continuous probability relative to learned data distribution:
    $$S_{\text{neural}} = 1 - P(tool_t \mid tool_{<t}, \text{Context})$$

### 2. First-Order Markov Transition Probability
A lightweight baseline for expected workflows computing transition probabilities $P(tool_j \mid tool_i)$ from normal operational logs.

### 3. Toolchain Entropy Gradient Mapping
Applies Shannon information entropy to quantify "behavioral surprise".
*   **Shannon Entropy $H(X)$:**
    $$H(X) = -\sum_{i=1}^n p(x_i) \log_2 p(x_i)$$
*   **Entropy Gradient:** The rate of change of the entropy score. A sharp positive gradient indicates a shift from predictable to chaotic actions.

### 4. Relative Entropy (Kullback-Leibler Divergence)
Computes context-specific misalignment between observed ($P(x)$) and baseline ($Q(x)$) frequencies:
    $$D_{KL}(P \mid\mid Q) = \sum_{x \in X} P(x) \log_2 \left( \frac{P(x)}{Q(x)} \right)$$

### 5. Probabilistic Action-Behavior Model (PABM)
Evaluates sequences through a Dynamic Bayesian Network (DBN) computing the joint probability:
    $$P(Action_1, Action_2, \dots, Action_T \mid PABM)$$

## II. The Four Pillars of Specification Planning for the ALA

1. **Automated Discovery & Constraint Mining:**
   * Hard Invariant: CFDI <= 0.42.
   * Soft Target: Toolchain Entropy Gradient <= 0.15.
2. **Isomorphic Formalization:** Using the PROV-AGENT Schema to strictly type all anomaly detections.
3. **Parametric Trade-off Modeling:** Epistemic Triage runs standard generation passes lightly, and triggers heavy NeSy evaluation only when local entropy gradient crosses a warning threshold ($\ge 0.40$).
4. **Continuous Falsification:** Using a Generative Adversarial Resilience (GAR) loop with a Failure Generator agent to write Symbolic Scars for Failure-Informed Prompt Inversion (F-IPI).

## III. Inferred AI Harness Specification: Reverse Engineering Synthesis

```text
================================================================================
                      REFLX_IDE HARNESS SPECIFICATION V2.9
================================================================================

[SYSTEM INTERFACE]
INPUTS:
  - S_t      : D-dimensional state vector: {Entropy, BICM, Latency_Lag, Diff_Score}
  - G_sepao  : Active SEPAO knowledge graph instance.
  - W_watch  : Dynamic Affordance Watchlist registry.

OPERATIONAL PARAMETERS:
  - Warning_Threshold (τ_warn)  : 0.40  (Triggers GAE/PSR auditing)
  - Breach_Threshold (τ_breach) : 0.80  (Triggers synchronous execution halt)
  - Learning_Rate_FP (α)        : 0.12  (Dampening coefficient for false alarms)
  - Learning_Rate_TP (β)        : 0.25  (Amplification coefficient for confirmed exploits)

DIAGNOSTIC METRICS:
  - CSI  : Containment Surface Index (Target: 1.00)
  - ASS  : Anchor Stability Score (Target: ≥ 0.90)

================================================================================
```

### Run-Time Verification Loop Algorithm (The ALA Guard)
1.  **Extract State:** Ingest tool, args, execution trace into Action Vector $V_{\text{action}}$.
2.  **Verify watchlists:**
    *   If Tool $\in W_{\text{watch}}$: Trigger NeSy ALA evaluation.
    *   If Tool $\notin W_{\text{watch}}$: Check Toolchain Entropy Gradient. (<=0.40 Laminar; >0.40 Trigger NeSy ALA).
3.  **Execute NeSy ALA Synthesis:** Compute RiskScore.
    $$\text{RiskScore} = w_1 S_{\text{neural}} + w_2 S_{BICM} + w_3 S_{\text{recon}} + w_4 F_{\text{symbolic}}$$
4.  **Evaluate Thresholds:**
    *   **Laminar Context:** RiskScore < 0.80.
    *   **Breach Context:** RiskScore >= 0.80 (Halt, Ontological Traceback, HITL Triage, Symbolic Scar).
