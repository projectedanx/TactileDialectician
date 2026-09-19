# Parametric Trade-off Analysis: TDD Convergence vs. Multi-Model Cascade Latency

**Artifact Status:** PROPOSED
**Author:** Lead AI Performance Engineer
**Domain:** Large-Context Optimization & Inference Latency

## 1. Multi-Model Cascade Tuning Analysis

Deploying a homogenous model architecture (e.g., exclusively Gemini 3 Pro) for every stage of the TDD loop creates unsustainable token overheads. A multi-model cascade optimizes the cost-to-accuracy ratio.

### Cascade Architecture Model

1.  **Stage 1: Architect (Gemini 3 Pro, High Thinking Level)**
    *   **Role:** Analyzes the issue, plans the ReAct loop, and generates the failing unit test.
    *   **Cost:** High ($C_{pro}$)
    *   **Frequency:** Executed once per task.
2.  **Stage 2: Implementer Loop (Gemini 2.5 Flash)**
    *   **Role:** The high-frequency code-writing turn based on sanitized error feedback.
    *   **Cost:** Low ($C_{flash}$)
    *   **Frequency:** Iterative ($n$ turns).
3.  **Stage 3: Verifier (Gemini 3 Pro)**
    *   **Role:** Refactor logic and static analysis check prior to PR.
    *   **Cost:** High ($C_{pro}$)
    *   **Frequency:** Executed once upon Green Phase entry.

### Cost Equation

Let $n$ be the number of ReAct turns to converge on a passing test.

$$ \text{Total Cost} = C_{pro\_architect} + \sum_{i=1}^{n} (C_{flash\_iter}(i)) + C_{pro\_verifier} $$

This architecture significantly reduces compute footprint compared to running $n$ iterations on the heavier model, provided the lighter model can successfully follow structured ReAct loops.

## 2. The 'Doom Loop' Breaking Threshold ($T_{break}$)

Unbound agents can waste millions of tokens iterating on unsolvable compilation errors. We must establish a mathematical breaking threshold.

### Derivation

Given empirical data:
*   Average successful repair (TDD Converge): $1.1 \times 10^6$ input tokens over $\sim 10.6$ turns.
*   Failed repair (Doom Loop): $4.1 \times 10^6$ input tokens over $\sim 27.5$ turns.

Let $P(\text{converge} | n)$ be the probability of success on turn $n$. Based on survival analysis of agent repairs, $P(\text{converge} | n)$ decays exponentially after $n = 10$.

Let $E_{cost}$ be the expected cost of continuing vs breaking:

$$ E_{cost} = P(\text{converge} | n) \times \text{Value} - (1 - P(\text{converge} | n)) \times C_{token\_burn} $$

When $P(\text{converge} | n)$ drops below a critical threshold, $E_{cost}$ becomes negative. To optimize resource utilization, the harness must trigger an out-of-band intervention.

$$ \text{Set } T_{break} = 10 \text{ iterations (or } \Delta \text{stderr} = 0 \text{ for 3 consecutive turns)} $$

If $n > T_{break}$, execute a shadow Git rollback (`/restore`) and prompt human operator.

## 3. Context Compression & State Retention (The $K_{prune}$ Algorithm)

As the TDD loop iterates, raw execution logs push critical instructions out of the context window.

### Compression Algorithm

Define a total token limit $L_{max} = 300,000$.

1.  **Anchor Preservation:** Global context (`GEMINI.md`, Task Spec, Persona) is pinned at index 0 and marked immutable.
2.  **State Pruning:** When $\sum \text{Tokens} > L_{max}$:
    *   Discard execution logs from iterations $n - 3$ and older.
    *   Summarize discarded iterations into a 'Symbolic Scar' (e.g., "Attempts 1-4 failed due to missing module exports").
3.  **Execution Diffing:** Instead of feeding full code files, supply only the unified diff of the agent's previous attempt and the *sanitized* schema of the resulting error.

## 4. Benchmarking Methodology (`SWE-Bench Verified`)

1.  **Control Group:** Baseline agent executing YOLO direct shell execution (No TDD loop, Gemini 3 Pro homogeneous).
2.  **Experimental Group A:** Homogeneous Agent (Gemini 3 Pro) with TDD Loop enabled.
3.  **Experimental Group B:** Multi-Model Cascade Agent (Pro Architect $\rightarrow$ Flash Implementer $\rightarrow$ Pro Verifier) with TDD Loop, Context Compression, and $T_{break} = 10$.
4.  **Metrics:** Record $V_{exec}$ (Time to delivery), $A_{align}$ (Pass@1 rate on SWE-bench), and $C_{token}$ (Total tokens consumed). Map to the Pareto curve.
