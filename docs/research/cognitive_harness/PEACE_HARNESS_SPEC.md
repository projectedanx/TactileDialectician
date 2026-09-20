# PEACE Meta-Architecture: Epistemic Cognitive Harness

This document outlines the **Epistemic Cognitive Harness** engineered to resolve the **thought-action gap** in large language models. The framework formally bridges the cognitive decoupling between *Literal Theory of Mind (ToM)* (descriptive forecasting) and *Functional ToM* (adaptive execution).

## The Cognitive Decoupling Model

```
                                  [ THE COGNITIVE DECOUPLING ]
                                               │
               ┌───────────────────────────────┴───────────────────────────────┐
               ▼                                                               ▼
 ┌─────────────────────────────┐                                 ┌─────────────────────────────┐
 │       LITERAL ToM           │                                 │       FUNCTIONAL ToM        │
 │  (Descriptive Forecasting)  │                                 │     (Adaptive Execution)    │
 ├─────────────────────────────┤                                 ├─────────────────────────────┤
 │ • Sparse Lookback Circuits  │ ◄─── [THE THOUGHT-ACTION GAP] ──► │ • Dynamic Context Trees     │
 │   co-locate entity triples  │      "I know you will play Rock,│   & Backtracking (ReCAP)    │
 │   in residual streams.      │       yet I default to Nash     │ • Neuro-Symbolic Logic and  │
 │ • Static QA accuracy.       │       instead of Paper".        │   BDI Solver Filters.       │
 └─────────────────────────────┘                                 └─────────────────────────────┘
```

## The PEACE Meta-Architecture

The harness operationalizes the PEACE framework to decouple intuitive proposal generation from deliberative logical validation.

```
                                      [ USER QUERY ]
                                             │
                                             ▼
                             ┌───────────────────────────────┐
                             │       Retrieval Module        │
                             │   (Contextual Priors / RAG)   │
                             └───────────────┬───────────────┘
                                             │ [Priors]
                                             ▼
                             ┌───────────────────────────────┐
                             │       Cognition Module        │
                             │  (System 1 - Heuristic Proposer)
                             └───────────────┬───────────────┘
                                             │ [Provisional Output]
                                             ▼
                             ┌───────────────────────────────┐
                             │        Control Module         │
                             │  (System 2 - BDI Solver/Filter)│
                             └───────────────┬───────────────┘
                                             ├───────────────────────────────┐
                              [Veto / Rewrite] │ [Authorized]                  │
                                             ▼                               ▼
                             ┌───────────────────────────────┐ ┌─────────────────────────────┐
                             │        Memory Module          │ │        Action Module        │
                             │  (State Update / Context Tree)│ │   (Environment Execution)   │
                             └───────────────────────────────┘ └─────────────────────────────┘
```

### Core Modules
1. **Retrieval Module**: Extracts task-relevant contextual priors from a long-term vector store.
2. **Cognition Module (System 1)**: Generates fast, associative, pre-trained hypotheses and proposed action sequences. Avoids the "CoT Deliberation Penalty".
3. **Control Module (System 2)**: A meta-cognitive overseer. Intercepts provisional outputs, parses them into formal Belief-Desire-Intention (BDI) propositions, and evaluates them against hard constraints (using symbolic solvers like ASP/Clingo) to inhibit invalid actions.
4. **Action Module**: Executes authorized primitive commands.
5. **Memory Module**: Manages state tracking using a sliding window and a dynamic context tree (ReCAP) to prevent context drift in long horizons.

## Corresponding Research Vectors

This specification is grounded in three verifiable research prompts modeled within this directory:

- **Prompt 1: Mechanistic Lookback Circuit Distillation (`mechanistic_distillation_sim.py`)**
  Uses CKA and activation patching to map and distill causal action-belief binding circuits, defeating the Nash Equilibrium prior.
- **Prompt 2: Recursive Context-Aware Planning (`recap_bdi_sim.py`)**
  Implements the BDI state transition matrix and the ReCAP dynamic context tree. Resolves the Sussman Anomaly (infinite recursive deadlocks) via Upward Backtracking.
- **Prompt 3: Temporal-Aware Hierarchical Cognitive RL (`temporal_hc_rl_sim.py`)**
  Maintains out-of-distribution generalization while solving the context window constraint by shifting computation between a low-frequency Macro-Policy and a high-frequency Micro-Policy.
