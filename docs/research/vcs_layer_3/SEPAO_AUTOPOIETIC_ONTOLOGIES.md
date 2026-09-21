# Designing an Autopoietic Self-Healing Ontology Engine using Static AST Analysis and Failure-Informed Prompt Inversion

## 1. The Environment Scanner (AST Parsing)

The **Self-Evolving Plugin Affordance Ontology (SEPAO)** begins with a continuous background process that monitors the target environment. Rather than relying on unreliable textual diffs, the scanner parses raw source code into an **Abstract Syntax Tree (AST)**.

By walking the AST (e.g., using Python's `ast` module), the scanner extracts functional signatures, class definitions, and type hints. This structured representation allows the system to detect when a third-party API changes a required argument from `string` to `int`, or when a database schema adds a new `NOT NULL` constraint.

## 2. Semantic Delta Mapping & Ontological Conflict

The extracted AST entities are mapped into a unified knowledge graph $G = (V, E)$, where $V$ are entities (functions, variables) and $E$ are relations (calls, inherits).

Let $G_{t-1}$ be the ontology at time $t-1$ (the agent's current understanding) and $G_t$ be the freshly parsed ontology. We compute the **Semantic Drift Delta** $\Delta_S$:
$$ \Delta_S = G_t \setminus G_{t-1} \cup G_{t-1} \setminus G_t $$

To quantify the risk of an **Ontological Conflict**, we use Graph Edit Distance (GED). If the GED exceeds a safety threshold $\tau_{\text{drift}}$, the agent's internal constitution is formally out-of-sync with the physical environment:
$$ \text{GED}(G_{t-1}, G_t) > \tau_{\text{drift}} \implies \text{Ontological Conflict Detected} $$

## 3. Failure-Informed Prompt Inversion (F-IPI)

When an Ontological Conflict causes a runtime failure (e.g., a test suite fails because the agent used a deprecated API parameter), the **F-IPI pipeline** activates:

1.  **Isolation:** The stack trace is mapped back to the specific line-range in the generated code.
2.  **Scar Generation:** The failure is translated into a **Symbolic Scar** (a structured JSON object detailing the `expected` vs. `actual` state).
3.  **Prompt Mutation:** A gradient-free optimization routine (using an LLM as a meta-optimizer) mutates the agent's master constitution (`GEMINI.md`). It injects a negative constraint (e.g., `"FORBID use of parameter X in function Y; MANDATE use of Z."`) derived from the Symbolic Scar.

### JSON Schema for Symbolic Scar

```json
{
  "scar_id": "SCAR_API_DEPRECATION_001",
  "timestamp": "2024-05-20T10:00:00Z",
  "trigger": "TypeError: update() got an unexpected keyword argument 'force'",
  "ast_delta": {
    "removed_node": "FunctionDef(name='update', args=['force'])",
    "added_node": "FunctionDef(name='update', args=['override_flag'])"
  },
  "f_ipi_mutation": "FORBID usage of 'force' kwarg in API update calls. MANDATE usage of 'override_flag' as boolean."
}
```

## 4. Metamorphic Invariance Verification

To ensure that the newly injected constraint (the F-IPI mutation) does not cause **Scar-Induced Rigidity** (overfitting to the specific failure and breaking general functionality), the system performs **Metamorphic Testing**.

1.  The mutated prompt is subjected to semantically equivalent paraphrasing (e.g., changing the task description while keeping the core objective intact).
2.  The agent generates code based on these paraphrased prompts.
3.  If the generated code passes the local verification mandates (tests/linters) across all paraphrases, the F-IPI mutation is considered **Invariant** and is permanently committed to `GEMINI.md`. If it fails, the mutation is rejected, and a human operator is notified.
