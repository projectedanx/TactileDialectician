# Project Aurelius: Isolated Research & Theoretical Artifacts

This directory contains conceptual models, algorithmic proofs, simulation scripts, and architectural blueprints. In accordance with the project's strict separation of concerns, these theoretical artifacts are isolated from the main Typescript source codebase.

## Directory Index

*   `self_improving_agents/`: Research into autonomous self-improving agents, ActPlane eBPF structures, and MIQ Protocols.
*   `agentic_tdd/`: System engineering specifications for zero-trust Test-Driven Development loops within agent harnesses.
    *   `ZERO_TRUST_TDD_STATE_MACHINE.md`: Isomorphic multi-agent state machine and containerization specs.
    *   `PARAMETRIC_TRADEOFF_ANALYSIS.md`: Mathematical modeling of Execution Velocity vs. Alignment Accuracy and the $T_{break}$ threshold.
    *   `MULTIMODAL_UI_VERIFICATION_HARNESS.md`: Design blueprint for vision-enabled, self-healing UI testing loops via Playwright.
*   `action_alignment/`: Systems engineering specifications and proofs for implementing Action-Alignment Loss to bridge the thought-action gap in reinforcement learning agents.
    *   `SPECIFICATION.md`: Detailed mathematical proofs and system specifications.
    *   `action_alignment_loss.py`: PyTorch implementation of the Action-Alignment Loss module.

## Contribution Guidelines
Any simulation code (e.g., Python, Rust) or theoretical designs must remain in this directory and its subdirectories to prevent violating the core React/TypeScript "Tech Stack Fidelity" constraint of the main application.
*   `parsimonious_architecture/`: Research into automated parsimonious theory selection and the application of Occam's Razor within AI harnesses.
    *   `OCCAM_LOSS_COMPILER.md`: Specification for the Occam Loss Compiler, using Bayesian structural penalties to avoid parameter over-fitting.
    *   `occam_compiler.py`: Simulation of Pareto Optimization over competing cosmological theories.
    *   `BMR_COGNITIVE_HARNESS.md`: Architecture for Bayesian Model Reduction to actively prune assumptions and compress logic into fictive principles.
    *   `bmr_harness.py`: Simulation of the Axiomatic Pruning Module calculating marginal likelihoods.
    *   `MODEL_TRAVEL_AUDITOR.md`: Audit harness for interdisciplinary model travel to prevent semantic slippage and boundary condition violation.
    *   `travel_auditor.py`: Simulation for validating asymptotic bounds and ensuring dimensional reducibility.
