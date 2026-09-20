# Systems Engineering Specification: Implementing Action-Alignment Loss in PyTorch

To align an artificial agent's internal cognitive modeling with its external strategic execution, we must resolve the **thought-action gap**. Standard behavioral cloning and next-token prediction objectives often decouple descriptive representation (**Literal Theory of Mind**) from utility-maximizing action (**Functional Theory of Mind**).

When prompted to interact in sequential multi-agent games (such as Rock, Paper, Scissors), models equipped with perfect predictors of opponent behavior (Head A) still default to unexploitative, high-entropy **Nash equilibria** (Head B). They fail to translate their descriptive beliefs into optimal strategic policy.

By applying structured modeling to the cognitive boundary of transformer activations, we specify a mathematically rigorous **Action-Alignment Loss** to causally bind the predicted belief state to policy optimization.

---

### The Four Pillars of Specification Planning

```
   ┌──────────────────────────────────────────────────────────┐
   │                  RAW DATA OBSERVATIONS                   │
   └────────────────────────────┬─────────────────────────────┘
                                │
                                ▼
   ┌──────────────────────────────────────────────────────────┐
   │             LITERAL ToM MODULE (PREDICTION)              │
   │  Softmax Probability Over Opponent Actions: p_hat (141)  │
   └────────────────────────────┬─────────────────────────────┘
                                │
                                ├──────────────────────────────┐
                                │ [Causal Conditioning]        │
                                ▼                              ▼
   ┌────────────────────────────────────────┐     ┌─────────────────────────┐
   │  EXPECTED UTILITY CALCULATION (141)   │     │    ORACLE BEST RESPONSE │
   │  E_u = U @ p_hat                      │     │    V* = max(E_u)        │
   └────────────────────┬───────────────────┘     └────────────┬────────────┘
                        │                                      │
                        ▼                                      ▼
                        └──────────────────┬───────────────────┘
                                           │
                                           ▼
   ┌──────────────────────────────────────────────────────────┐
   │                ACTION-ALIGNMENT PENALTY                  │
   │            L_align = V* - sum(p * E_u)                   │
   │   - Forces policy 'p' to match the optimal best response.│
   │   - Prevents uncooperative Nash collapse. (141)          │
   └──────────────────────────────────────────────────────────┘
```

#### 1. Automated Discovery and Constraint Mining
Through systematic testing of LLMs in repeated strategic interactions, we isolate two key invariants (hard boundaries) and optimizable goals (soft targets):
*   **Invariant 1 (Behavioral-Predictive Decoupling):** Standard Cross-Entropy training on dialogue or action logs maximizes next-token prediction accuracy of the scene, but does not mathematically bind the agent's *own* policy execution to those predicted parameters.
*   **Invariant 2 (Gradient Variance in Non-Stationary Games):** In zero-sum competitive settings, standard policy gradients exhibit high variance against non-stationary, sub-optimal opponents, causing the focal agent to default to high-entropy, conservative priors (such as uniform mixing) rather than risk-maximizing exploitation.
*   **Soft Target (Minimizing Empirical Regret):** The optimization target is to drive step-wise functional regret ($\Delta_{\text{Functional}}/T$) to zero against predictable, biased opponents.

#### 2. Isomorphic Formalization (The Regret Minimization Schema)
To translate the "thought-action gap" into a testable data schema, we define the **Action-Alignment Loss** ($\mathcal{L}_{\text{Align}}$) as a bounded regret objective representing the distance between the expected utility of the selected policy and the expected utility of the optimal best response:

$$\text{Focal Agent's Policy (Head B):} \quad p = \text{Softmax}(\mathbf{z}^i) \in \mathbb{R}^{|A^i|} \quad$$

$$\text{Opponent's Predicted Policy (Head A):} \quad \hat{p} = \text{Softmax}(\mathbf{z}^{-i}) \in \mathbb{R}^{|A^{-i}|} \quad$$

Let $U \in \mathbb{R}^{|A^i| \times |A^{-i}|}$ denote the game's payoff (utility) matrix for the focal agent $i$ against opponent $-i$. The expected utility of each individual action $a^i \in A^i$ given the opponent's predicted action distribution is:

$$E(a^i) = [U \hat{p}]_{a^i} \quad$$

The expected utility of the agent's current mixed policy $p$ is:

$$\mathbb{E}_{p, \hat{p}}[U] = p^T U \hat{p} \quad$$

The expected utility of the absolute optimal Best Response (oracle value function) is:

$$V^*(\hat{p}) = \max_{j} [U \hat{p}]_j \quad$$

The exact **Action-Alignment Loss** is the difference between these two expected values:

$$\mathcal{L}_{\text{Align}}(p, \hat{p}) = V^*(\hat{p}) - p^T U \hat{p} \quad$$

#### 3. Parametric Trade-off Modeling (The Smoothness-Precision Frontier)
The hard `max` operator inside the exact regret calculation yields sparse subgradients: it provides zero learning signal to any sub-optimal actions because their probability changes do not affect the maximum value. This results in optimization instability during the early phases of reinforcement learning.

To restore smooth gradient flow across all possible actions, we introduce the **Boltzmann Best-Response Approximation** using LogSumExp:

$$V^*_{\tau}(\hat{p}) = \tau \log \sum_{j} \exp\left(\frac{[U \hat{p}]_j}{\tau}\right) \quad$$

where $\tau > 0$ is a temperature parameter.
*   As $\tau \to 0$, $V^*_{\tau}(\hat{p})$ converges to the exact hard maximum, prioritizing precise best-response enforcement.
*   As $\tau \to \infty$, $V^*_{\tau}(\hat{p})$ approaches a uniform average utility, smoothing the gradient landscape to prevent premature local minima trapping at the cost of precision.

#### 4. Continuous Falsification and Edge-Case Stress Testing
This loss function is stress-tested against the **Rock, Paper, Scissors "Nash Trap"**. In this edge case, an opponent plays only "Rock" with $100\%$ confidence ($\hat{p} = [1, 0, 0]^T$). Without the alignment loss, standard policy gradient agents default to the unexploitative Nash equilibrium ($p_{\text{Nash}} = [1/3, 1/3, 1/3]^T$), incurring a catastrophic step-wise regret of $1.0$.

---

### Inferred Harness Specification & High-Value Research Prompts

To structurally deploy this specification in production-grade AI harnesses, we define three highly rigorous, non-obvious research prompts targeting representation alignment, cognitive architectures, and active learning:

#### Research Prompt 1: Mechanistic Lookback Circuit Alignment and Distillation
> **Domain:** Mechanistic Interpretability, Activation Engineering, and Model Compression.
>
> **Task:** Synthesize an automated training pipeline that performs **Circuit Distillation** to transfer the causal belief-tracking "lookback circuit" from an unaligned teacher model (e.g., Llama-3-70B-Instruct) into a smaller student model (e.g., Llama-3-8B), directly mitigating the thought-action gap.
>
> **Experimental Setup & Implementation:**
> 1.  **Circuit Mapping:** Write a PyTorch-based path-patching and activation-patching framework utilizing the `TransformerLens` library. Isolate the specific attention heads responsible for the *binding lookback* (co-locating character-object-state triples via Ordering IDs in low-rank subspaces) and the *answer lookback* (retrieving the state payload during query evaluation) in the teacher model.
> 2.  **Functional Mappings:** Calculate the functional importance of student attention heads. Identify "functionally correspondent" heads between the student and teacher models by minimizing the absolute difference in their performance degradation under mean ablation.
> 3.  **Representational Distillation:** Implement a training run where only the mapped student circuit heads are unfrozen. Formulate a composite objective function that combines a standard Cross-Entropy task loss ($\mathcal{L}_{\text{task}}$) with a Centered Kernel Alignment (CKA) loss ($\mathcal{L}_{\text{CKA}}$) to structurally align corresponding activation matrices:
>
>     $$\mathcal{L}_{\text{total}} = \mathcal{L}_{\text{task}}(y, \hat{y}_s) + \lambda \sum_{c \in \mathcal{C}_{\text{paired}}} \left(1 - \text{CKA}\left(K_s^{(c)}, K_t^{(c)}\right)\right) \quad$$
>
> 4.  **Verification:** Evaluate the student model on sequential game-theoretic benchmarks (such as Rock, Paper, Scissors). Conduct test-time activation-patching on the student's distilled lookback circuit to verify whether the forced activation of these heads successfully steers the student model's final-token vocabulary distribution away from the default Nash prior and binds it causally to the optimal exploit-policy.

#### Research Prompt 2: Closed-Loop ReCAP with BDI Symbolic Logic Verification
> **Domain:** Cognitive Agent Architectures, Answer Set Programming (ASP), and Epistemic Governance.
>
> **Task:** Design and implement a closed-loop neuro-symbolic agent execution harness that wraps a frontier LLM (e.g., Qwen-2.5-72B-Instruct) inside a formal Belief-Desire-Intention (BDI) engine to eliminate "predictive-behavioral decoupling" in dynamic, resource-constrained environments.
>
> **Experimental Setup & Implementation:**
> 1.  **Dynamic Context Tree Management:** Build a Python execution harness that manages a dynamic context tree where each node is represented as a structured tuple: $\mathcal{N} = \langle \text{desc}, \text{subtask\_list}, \text{children\_list}, \text{obs\_list}, \text{think\_list} \rangle$. Implement the downward *plan-ahead decomposition* and upward *backtracking-driven refinement* loops.
> 2.  **Epistemic Scaffolding:** Wrap the LLM with strict XML/JSON syntactic fences to partition its in-context reasoning into distinct, unshared BDI blocks: `#Beliefs` (dynamic partner and environmental state predictions), `#Desires` (long-term utility constraints), and `#Intentions` (proposed tactical steps).
> 3.  **Symbolic Logic Loop:** Construct a non-LLM control layer in Python that continuously parses the LLM's `#Beliefs` and `#Intentions` into formal Dynamic Epistemic Logic (DEL) propositions or Answer Set Programming (ASP) rules.
> 4.  **Metacognitive Guardrail:** Run the compiled propositions through a symbolic solver (e.g., Clingo) to check for logical consistency and goal alignment. If the proposed neural action ($a^i$) violates the optimal game-theoretic response to the predicted partner state ($\hat{a}^{-i}$)—such as failing to play "Paper" when predicting "Rock"—the symbolic supervisor must veto the token generation, inject an "Unresolved Confusion" indicator into the agent's memory, and trigger a recursive context-aware replanning loop (ReCAP) to rewrite the tactical intention. Compare the pass@1 success rate and loop-detection latency of this harness against standard sequential ReAct agents.

#### Research Prompt 3: Epistemic Sponge Mitigation via Active Bayes Risk Probing in POMDPs
> **Domain:** Post-Training RL Alignment, Robust Evaluation, and Active Learning.
>
> **Task:** Implement and evaluate an interactive reinforcement learning evaluation harness based on Sequential Inverse Plan Search (SIPS) to model the "expectation-realization gap" under high model-uncertainty and partial observability.
>
> **Experimental Setup & Implementation:**
> 1.  **POMDP Modeling:** Construct a formal Partially Observable Markov Decision Process (POMDP) model representing a cooperative human-robot gridworld task (such as Doors, Keys & Gems) with irreversible failure modes.
> 2.  **Active Learning Controller:** Write a Python module using PyTorch that calculates the immediate Bayes Risk ($BR$) associated with the agent's actions when transition, observation, and human reward models are uncertain:
>
>     $$BR(a) = \int_{\mathcal{M}} \left(Q^*_m(b_m, a) - Q^*_m(b_m, a^*_m)\right) p_{\mathcal{M}}(m) \, dm \quad$$
>
> 3.  **Meta-Query Execution:** Implement an active learning "meta-query" controller. When the calculated Bayes Risk of the least-risky action exceeds a defined cost threshold ($BR(a') > \xi$), the agent must halt autonomous execution and issue a programmatic, language-grounded "meta-query" to the human principal (e.g., "I am highly uncertain about your path; should I fetch Key 2 or Key 3?") to update its Dirichlet priors.
> 4.  **Verification:** Mathematically demonstrate how this active risk-minimization harness prevents the model's assumed partner rationality parameter ($\beta$) from collapsing under high model-uncertainty (mitigating the "epistemic sponge" effect), preserving high coordination efficiency and preventing catastrophic task failure.
