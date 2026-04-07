# Epic 1: Temporal Causality Mapping in Disambiguation

## Context
The current `DisambiguationEngine` uses a rudimentary `historicalDomains` array in local storage to hint at context. This is linear and insufficient for complex STEM workflows where variables have temporal dependencies (e.g., $t$ as time in phase 1, $t$ as a dummy variable in phase 2).

## Epic Breakdown
Introduce a Temporal Causality Graph that tracks the evolution of symbol definitions across a session's history, allowing the Disambiguation Engine to probabilistically weight meanings based on the proximity and causal link to previous derivations.

## User Stories & Acceptance Criteria

### Story 1: Temporal Context Injection
**As a** STEM researcher, **I want** the Disambiguation Engine to remember how I defined a symbol three queries ago **so that** I don't have to constantly redefine polysemic variables.
*   **AC1:** The system must maintain a directed acyclic graph (DAG) of symbol definitions per session.
*   **AC2:** The Gemini Flash prompt must include the current node's ancestor history.
*   **AC3:** If a symbol definition explicitly changes (e.g., "Let $v$ now equal velocity, not volume"), a new branch in the DAG is created.

### Story 2: Visual Causal Trace
**As a** user auditing the AI's logic, **I want** to see the temporal path the engine used to resolve a symbol **so that** I can trust the Disambiguation Engine's choice.
*   **AC1:** The UI must display a mini-timeline showing when a symbol was last defined.
*   **AC2:** Provide a rollback button to revert context to a previous temporal node.

## Stakeholder Perspective Analysis
*   **Human Researcher:** High value. Reduces cognitive load by maintaining implicit state, mimicking a conversation with a human colleague.
*   **AI Agent (Dialectician):** High value. Reduces token waste by not re-explaining context; the DAG structure provides a clean topological map of the user's intent.
*   **Developer:** Moderate complexity. Requires migrating state from simple arrays to graph structures, potentially utilizing a lightweight client-side graph library or structured local storage schemas.

## Requirement Decomposition
1.  Define the `TemporalNode` TypeScript interface (symbol, meaning, timestamp, parentId).
2.  Update `DisambiguationEngine.tsx` state to manage `TemporalNode[]` instead of `string[]`.
3.  Modify the `handleDisambiguate` Gemini prompt to inject the localized DAG path.
4.  Build a React component to visualize the active temporal branch.
