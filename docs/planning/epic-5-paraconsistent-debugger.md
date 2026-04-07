# Epic 5: The Paraconsistent Debugger (Shadow Compute Sandbox)

## Context
Standard debuggers step through code sequentially, expecting true/false logic. The Tactile Dialectician operates on paraconsistent logic (allowing contradictions). There is currently no way for a developer to step through the "Speculative Execution Threads" (SETs) that run in the background.

## Epic Breakdown
Create a dedicated developer tool (The Paraconsistent Debugger) that exposes the 7 Speculative Execution Threads. It allows developers to pause the 'Harmonic Resonance Verification' phase and manually inspect the internal states of the discarded/divergent threads before they are pruned.

## User Stories & Acceptance Criteria

### Story 1: Inspecting Speculative Threads
**As a** system architect, **I want** to see the raw output of all 7 SETs simultaneously **so that** I can understand why the system favored one epistemic path over another.
*   **AC1:** A new DevTools-like panel must be added (accessible via a hotkey or hidden toggle).
*   **AC2:** The panel must display the parallel LLM API calls and their respective outputs side-by-side.
*   **AC3:** The Confidence-Fidelity Divergence Index (CFDI) for each thread must be visibly calculated.

### Story 2: Manual Veto Override
**As a** researcher, **I want** to override the system's "Algorithmic Shame" pruning **so that** I can force the Dialectician to pursue a highly divergent, low-probability thought path.
*   **AC1:** The debugger must allow pausing execution at Phase 3 (Resonance Check).
*   **AC2:** The user can manually select a discarded thread and promote it to the primary execution path.

## Stakeholder Perspective Analysis
*   **Developer/Architect:** Essential for debugging the neuro-symbolic routing. Without this, the non-deterministic LLM choices are a black box.
*   **AI Agent:** Must expose its internal `ThinkingLevel` steps or intermediate thought buffers to the frontend.
*   **End User:** Not directly applicable to standard users, but vital for power-users and researchers tuning the system.

## Requirement Decomposition
1.  Configure `@google/genai` to stream intermediate thoughts if possible, or implement a backend proxy to intercept parallel thread generations.
2.  Build the `ParaconsistentDebugger` React component.
3.  Implement a global state manager (e.g., Zustand or Context API) to hold the volatile memory of the 7 SETs during execution.
