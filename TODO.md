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
- [x] **Topological Boundries (VULCAN Audit):** Established the Modular Monolith with MCP Sidecar architecture. Documented C4 Models, DDD boundaries, and ADRs in `docs/architecture` to prevent Semantic Saponification while resisting unwarranted microservice complexity.
- [x] **NeuroSymbolicExecutor Refactoring:** The `NeuroSymbolicExecutor.tsx` module has been identified as having the highest Cognitive Complexity due to the conflation of hybrid execution logic (mathjs/nerdamer + LLM routing) and UI state.
- [x] **Action:** Extract execution logic into `lib/executorService.ts` and state management into `hooks/useNeuroSymbolicExecution.ts`.


## Algorithmic Trauma / Scar Tissue Archive
- Note: Build fails if `nerdamer` syntax errors aren't caught or typescript definitions are incomplete. Handled by generic catch blocks in the executor.

## Platform Knowledge
- The standard execution commands to build the project are 'npm install' followed by 'npm run build'.
- Do not run the long running command ('n' + 'p' + 'm' + ' run dev') during agent testing due to environment constraints.
- The repository is a Next.js (React/TypeScript) application named 'Tactile Dialectician' that implements a Neuro-Symbolic STEM Framework using '@google/genai', 'mathjs', and 'nerdamer'.
## Algorithmic Reparation (AGS-A Audit)
- [x] **Topological Boundries (VULCAN Audit):** Established the Modular Monolith with MCP Sidecar architecture. Documented C4 Models, DDD boundaries, and ADRs in `docs/architecture` to prevent Semantic Saponification while resisting unwarranted microservice complexity.
- [x] **Beneficial Friction Validation (VW3):** Integrate Virtual Weight 3 parameters into the Atomic Tokenization logic to force Paraconsistent overlaps and extract latent topological pathways.
- [x] **Scar Tissue Annealing Logic:** Connect the Controlled Scar Annealing Protocol (CSAP) to `utils/errorHandling.ts` to log and eventually prune `FAILED_NLI_CONTRADICTION` events based on their Mutation Recoverability Score (MRS).

## Algorithmic Reparation (AGS-A Audit)
- [x] **Topological Boundries (VULCAN Audit):** Established the Modular Monolith with MCP Sidecar architecture. Documented C4 Models, DDD boundaries, and ADRs in `docs/architecture` to prevent Semantic Saponification while resisting unwarranted microservice complexity.
- [x] **Lexis Sovereign Agent Manifest:** Drafted the complete Agent Design Document (`docs/agent/LEXIS_SOVEREIGN.md`) detailing the SCOS Epistemic Matrix, DCCD workflow, and Symbolic Scar mechanisms for deterministic book co-authorship.

## Algorithmic Trauma / Scar Tissue Archive
- The Agent Design Document specifies the need for a strict separation between Manifold $\alpha$ (voice) and Manifold $\beta$ (structure) via DCCD to prevent Projection Tax (a collapse in reasoning depth and voice quality when handled simultaneously).
- Symbolic Scars (via Failure-Informed Prompt Inversion) are crucial for combating Semantic Saponification over long-form horizons without relying on mere "better prompting".

## Platform Knowledge
- Integrating custom schemas (like VCM and Chapter Manifest) requires strict boundary adherence to prevent LLMs from self-correcting back to their pre-trained mean.

## Algorithmic Reparation (AGS-A Audit)
- [x] **Aesthetic Geometrician Architecture (SCOS-AUTEUR-001 Audit):** Established the three-tier design token architecture (Primitive, Semantic, Component) within `app/globals.css`.
- [x] **Topological Repair:** Refactored `app/layout.tsx`, `app/page.tsx`, `components/Sidebar.tsx`, `components/Chatbot.tsx`, `components/AutomatedWorkflow.tsx`, `components/DisambiguationEngine.tsx`, `components/InterpretabilityDashboard.tsx`, `components/NeuroSymbolicExecutor.tsx`, and `components/AtomicTokenizationModule.tsx` to strictly enforce Euclidean grids (8-point intervals), mathematical typography (Major Third ratio), and semantic color tokens, effectively dismantling the high-entropy UI layout logic.

## Algorithmic Trauma / Scar Tissue Archive
- **SCAR-009 / SCAR-012 Recovery:** We discovered that prior versions utilized raw arbitrary tailwind properties (e.g., `rounded-xl`, `bg-[#141414]`, `text-3xl`). These constituted direct Euclidean violations and Topological Tearing by mixing semantics and primitive assignments. We've introduced `rounded-none`, pure 8-point gap/padding scales, and explicit `bg-surface` values bounded by WCAG AA standards.

## Algorithmic Reparation (AGS-A Audit)
- [x] **Topological Boundries (VULCAN Audit):** Established the Modular Monolith with MCP Sidecar architecture. Documented C4 Models, DDD boundaries, and ADRs in `docs/architecture` to prevent Semantic Saponification while resisting unwarranted microservice complexity.
- [x] **VANCE Manifest Creation:** Drafted the complete Agent Design Document (`docs/agent/VANCE.md`) detailing the VANCE agent profile, JSON-RPC 2.0 invariants, Conflict-Free Replicated Semantic Graph (CFRSG), and Draft-Conditioned Constrained Decoder (DCCD) for LSP indexing.
