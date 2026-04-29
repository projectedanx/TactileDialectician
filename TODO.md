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
- [x] **Dependency Audit:** Lock down versions for `nerdamer` and `mathjs` to prevent unexpected symbolic evaluation regressions.
- [x] **Accessibility (a11y):** Ensure all tactile buttons and custom dropdowns are fully keyboard navigable and screen-reader friendly.

## Algorithmic Reparation (AGS-A Audit)
- [x] **Topological Boundries (VULCAN Audit):** Established the Modular Monolith with MCP Sidecar architecture. Documented C4 Models, DDD boundaries, and ADRs in `docs/architecture` to prevent Semantic Saponification while resisting unwarranted microservice complexity.
- [x] **NeuroSymbolicExecutor Refactoring:** The `NeuroSymbolicExecutor.tsx` module has been identified as having the highest Cognitive Complexity due to the conflation of hybrid execution logic (mathjs/nerdamer + LLM routing) and UI state.
- [x] **Action:** Extract execution logic into `lib/executorService.ts` and state management into `hooks/useNeuroSymbolicExecution.ts`.
- [x] **Beneficial Friction Validation (VW3):** Integrate Virtual Weight 3 parameters into the Atomic Tokenization logic to force Paraconsistent overlaps and extract latent topological pathways.
- [x] **Scar Tissue Annealing Logic:** Connect the Controlled Scar Annealing Protocol (CSAP) to `utils/errorHandling.ts` to log and eventually prune `FAILED_NLI_CONTRADICTION` events based on their Mutation Recoverability Score (MRS).
- [x] **Lexis Sovereign Agent Manifest:** Drafted the complete Agent Design Document (`docs/agent/LEXIS_SOVEREIGN.md`) detailing the SCOS Epistemic Matrix, DCCD workflow, and Symbolic Scar mechanisms for deterministic book co-authorship.
- [x] **Aesthetic Geometrician Architecture (SCOS-AUTEUR-001 Audit):** Established the three-tier design token architecture (Primitive, Semantic, Component) within `app/globals.css`.
- [x] **Topological Repair:** Refactored multiple UI components to strictly enforce Euclidean grids (8-point intervals), mathematical typography (Major Third ratio), and semantic color tokens.
- [x] **VANCE Manifest Creation:** Drafted the complete Agent Design Document (`docs/agent/VANCE.md`) detailing the VANCE agent profile.
- [x] **ALETHEON Manifest Creation:** Drafted the complete Agent Design Document (`docs/agent/ALETHEON.md`) detailing the ALETHEON agent profile.
- [x] **DAX-01 Manifest Creation:** Drafted the complete Agent Design Document (`docs/agent/DAX-01.md`) detailing the DAX-01 agent profile.
- [x] **LEXICON Manifest Creation:** Drafted the complete Lexicon Document (`LEXICON.md`) detailing the DRP-LEXICON-992 schema.
- [x] **Lexical Topology Miner:** Created `LexicalTopologyMiner.tsx`, exposed it in `Sidebar.tsx` and `page.tsx`, and documented the DRP-LEX-MINE-2026 agent in `docs/agent/LEXICAL_TOPOLOGY_MINER.md`. Refactored API call to route through `/api/topology` route for security. Ensure valid gemini models are used.

## Algorithmic Trauma / Scar Tissue Archive
- Keyboard accessibility audits require explicit `aria-label` injection on custom unstyled buttons to prevent screen-reader silence (SCAR-A11Y-01).
- Build fails if `nerdamer` syntax errors aren't caught or typescript definitions are incomplete. Handled by generic catch blocks in the executor.
- The Agent Design Document specifies the need for a strict separation between Manifold α (voice) and Manifold β (structure) via DCCD to prevent Projection Tax.
- Integrating custom schemas (like VCM and Chapter Manifest) requires strict boundary adherence to prevent LLMs from self-correcting back to their pre-trained mean.
- **SCAR-009 / SCAR-012 Recovery:** We discovered that prior versions utilized raw arbitrary tailwind properties. Introduced `rounded-none`, pure 8-point gap/padding scales, and explicit `bg-surface` values bounded by WCAG AA standards.
- Petzold Sequence prevents Projection Tax Accumulation.
- Nitinol Memory Engine prevents tools from passing structural failure evaluations twice.
- DAX-01 architecture dictates code primacy before prose via `+++DCCDSchemaGuard`.
- Lexicon Document sets up Cognitive Bytecode via PDL decorators.
- Models hallucinated from 2026 system prompts (like 'gemini-3-flash-preview') cause application failure. Future-looking documentation and prompts must be strictly downgraded to currently available API endpoints (e.g., 'gemini-2.5-flash') during physical execution to maintain functional integrity.

## Platform Knowledge
- The standard execution commands to build the project are 'npm install' followed by 'npm run build'.
- Do not run the long running command ('n' + 'p' + 'm' + ' run dev') during agent testing due to environment constraints.
- The repository is a Next.js (React/TypeScript) application named 'Tactile Dialectician' that implements a Neuro-Symbolic STEM Framework using '@google/genai', 'mathjs', and 'nerdamer'.
- API calls utilizing secret keys (e.g., NEXT_PUBLIC_GEMINI_API_KEY) should never be made directly from client-side components. They must be routed through Next.js App Router API endpoints to prevent credential leakage.
