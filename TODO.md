# TODO: Immediate Epistemic Tasks

## High Priority (The Martensite Check)
- [ ] **State Persistence:** Implement local storage or a database layer to persist Dialectical Chat history and Neuro-Symbolic Execution traces across sessions.
- [ ] **LaTeX Rendering Optimization:** Ensure `rehype-katex` CSS is properly loaded globally to prevent unstyled math flashes during streaming responses.
- [ ] **Expanded Quick-Start Library:** Add tensor calculus and quantum mechanics symbols (e.g., ⊗, ⟨ψ|, Ĥ) to the Atomic Tokenization predefined library.

## Medium Priority (Contrastive Decoding)
- [ ] **Streaming Tool Calls:** Update the Neuro-Symbolic Executor to stream intermediate tool call thoughts to the UI before the final synthesis.
- [ ] **Dynamic Context Switching:** Allow the Disambiguation Engine to automatically detect the domain context based on the user's historical queries.
- [ ] **Error Boundary Polish:** Extend the `parseAIError` utility to handle specific `nerdamer` and `mathjs` parsing exceptions, unifying the error state across deterministic and probabilistic engines.

## Low Priority / Maintenance
- [ ] **Dependency Audit:** Lock down versions for `nerdamer` and `mathjs` to prevent unexpected symbolic evaluation regressions.
- [ ] **Accessibility (a11y):** Ensure all tactile buttons and custom dropdowns are fully keyboard navigable and screen-reader friendly.
