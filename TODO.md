# TODO: Immediate Epistemic Tasks

## High Priority (The Martensite Check)
- [x] **State Persistence:** Implement local storage or a database layer to persist Dialectical Chat history and Neuro-Symbolic Execution traces across sessions.
- [x] **LaTeX Rendering Optimization:** Ensure `rehype-katex` CSS is properly loaded globally to prevent unstyled math flashes during streaming responses.
- [x] **Expanded Quick-Start Library:** Add tensor calculus and quantum mechanics symbols (e.g., ⊗, ⟨ψ|, Ĥ) to the Atomic Tokenization predefined library.

## Medium Priority (Contrastive Decoding)
- [x] **Streaming Tool Calls:** Update the Neuro-Symbolic Executor to stream intermediate tool call thoughts to the UI before the final synthesis.
- [x] **Dynamic Context Switching:** Allow the Disambiguation Engine to automatically detect the domain context based on the user's historical queries.
- [x] **Error Boundary Polish:** Extend the `parseAIError` utility to handle specific `nerdamer` and `mathjs` parsing exceptions, unifying the error state across deterministic and probabilistic engines.

## Low Priority / Maintenance
- [ ] **Dependency Audit:** Lock down versions for `nerdamer` and `mathjs` to prevent unexpected symbolic evaluation regressions.
- [ ] **Accessibility (a11y):** Ensure all tactile buttons and custom dropdowns are fully keyboard navigable and screen-reader friendly.

## Algorithmic Reparation (AGS-A Audit)
- [x] **NeuroSymbolicExecutor Refactoring:** The `NeuroSymbolicExecutor.tsx` module has been identified as having the highest Cognitive Complexity due to the conflation of hybrid execution logic (mathjs/nerdamer + LLM routing) and UI state.
- [x] **Action:** Extract execution logic into `lib/executorService.ts` and state management into `hooks/useNeuroSymbolicExecution.ts`.


## Algorithmic Trauma / Scar Tissue Archive
- Note: Build fails if `nerdamer` syntax errors aren't caught or typescript definitions are incomplete. Handled by generic catch blocks in the executor.

## Platform Knowledge
- The standard execution commands to build the project are 'npm install' followed by 'npm run build'.
- Do not run the long running command ('n' + 'p' + 'm' + ' run dev') during agent testing due to environment constraints.
- The repository is a Next.js (React/TypeScript) application named 'Tactile Dialectician' that implements a Neuro-Symbolic STEM Framework using '@google/genai', 'mathjs', and 'nerdamer'.
## Algorithmic Reparation (AGS-A Audit)
- [x] **Beneficial Friction Validation (VW3):** Integrate Virtual Weight 3 parameters into the Atomic Tokenization logic to force Paraconsistent overlaps and extract latent topological pathways.
- [x] **Scar Tissue Annealing Logic:** Connect the Controlled Scar Annealing Protocol (CSAP) to `utils/errorHandling.ts` to log and eventually prune `FAILED_NLI_CONTRADICTION` events based on their Mutation Recoverability Score (MRS).
