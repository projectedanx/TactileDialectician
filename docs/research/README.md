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
