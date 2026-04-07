# Epic 2: Symbiotic LaTeX Streaming & Compilation

## Context
The `TODO.md` highlights an issue with `rehype-katex` causing unstyled math flashes during streaming responses. The current text-to-math pipeline is disjointed during active token generation.

## Epic Breakdown
Implement a double-buffered Symbiotic LaTeX Engine that intercepts the LLM's stream, buffers incomplete LaTeX blocks (`$$...$$` or `$...$`), parses them via a shadow DOM or Web Worker, and only flushes to the main React DOM when the equation is syntactically complete.

## User Stories & Acceptance Criteria

### Story 1: Jitter-Free Math Streaming
**As a** user reading a live response, **I want** mathematical equations to appear fully formatted **so that** my reading flow is not broken by flashing raw LaTeX code.
*   **AC1:** The streaming parser must identify the start of a math block (`$` or `$$`).
*   **AC2:** The parser must buffer incoming tokens until the closing delimiter is received.
*   **AC3:** Only complete math strings are passed to `react-markdown` -> `rehype-katex`.

### Story 2: Live Equation Validation
**As a** Dialectician Agent, **I want** to know if the LaTeX I just generated is syntactically valid **so that** I can self-correct before the user sees a rendering error.
*   **AC1:** If `katex.renderToString` throws a ParseError in the buffer, the engine intercepts it.
*   **AC2:** The engine triggers a silent `tool_call` back to the LLM to fix the syntax error before flushing to the UI.

## Stakeholder Perspective Analysis
*   **End User:** Massive UI/UX improvement. Enhances the "magic" feel of the system by removing the mechanical jitter of generation.
*   **AI Agent:** Provides a crucial feedback loop. The AI no longer flies blind regarding the renderability of its output.
*   **Frontend Developer:** High complexity. Requires deep integration with the React streaming hooks (e.g., `useChat`) and custom remark/rehype plugins.

## Requirement Decomposition
1.  Create a custom `remark` plugin to handle buffered math streaming.
2.  Implement a Web Worker to compile LaTeX off the main thread.
3.  Design the error-catching mechanism to feed `ParseError` back to the `NeuroSymbolicExecutor` trace.
