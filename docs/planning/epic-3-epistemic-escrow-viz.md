# Epic 3: Epistemic Escrow Visualization

## Context
The overarching goal is to expose the "Shadow Compute Sandbox" and the tension nodes (contradictions) generated during the Petzold Sequence. Currently, the `InterpretabilityDashboard` exists but does not map paraconsistent divergence.

## Epic Breakdown
Build an interactive node-graph visualization (using a library like `recharts` or `d3` integrated into Next.js) that visualizes the "Epistemic Escrow" - the specific points where the deterministic engine (mathjs/nerdamer) and the probabilistic engine (Gemini) disagreed, and how those tensions were quarantined.

## User Stories & Acceptance Criteria

### Story 1: Visualizing Divergence
**As a** system auditor, **I want** to see a graphical representation of when `nerdamer` and `Gemini` produced conflicting answers **so that** I can understand the boundaries of the system's certainty.
*   **AC1:** The dashboard must render a bipartite graph showing Deterministic Paths vs. Probabilistic Paths.
*   **AC2:** Divergent nodes (where outputs differ by a calculated delta) must be highlighted in a distinct "Tension" color (e.g., Red/Orange).

### Story 2: Mining Tension for Novelty
**As an** advanced user, **I want** to click on a "Tension Node" to force the Dialectician to explore *why* the divergence occurred **so that** I can discover edge cases or new theories.
*   **AC1:** Clicking a divergent node opens a sub-chat focused exclusively on resolving the specific logic gap.
*   **AC2:** The system utilizes the "Anionic Veto" to prevent auto-resolving the tension, instead prompting the user with the contrasting viewpoints.

## Stakeholder Perspective Analysis
*   **System Auditor/Data Scientist:** Critical feature. Transforms the "black box" of AI into a transparent, inspectable topology.
*   **AI Agent:** Requires the Executor to explicitly format its trace output to flag `cfd_threshold` breaches.
*   **Frontend Developer:** Requires implementing complex interactive SVGs or Canvas elements within the React App Router architecture.

## Requirement Decomposition
1.  Enhance `NeuroSymbolicExecutor.tsx` to flag `TraceStep` items with a `divergence_score`.
2.  Integrate a graphing library (e.g., React Flow) into `InterpretabilityDashboard.tsx`.
3.  Design the "Tension Node" data schema.
4.  Implement the click-handler to trigger a scoped investigation in the `Chatbot`.
