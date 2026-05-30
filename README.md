# Tactile Dialectician: Neuro-Symbolic STEM Framework

## Overview
The **Tactile Dialectician** is an advanced, hybrid AI-reasoning interface built on the Atlas Framework. Designed for rigorous STEM collaboration, the system rejects linear problem-solving in favor of a recursive, multi-causal OODA loop architecture. It mitigates the hallucination risks of pure LLMs by injecting deterministic mathematical computation and strict symbol disambiguation into the reasoning pipeline.

## Architecture Deliverables
The system topography, including Domain-Driven Design Context Maps and C4 Models, has been rigorously documented. Please see `docs/architecture` for ADRs and structural blueprints.


## Agent Profiles
The Tactical Dialectician enforces an Epistemic Inversion Strategy. The AI acts as the Structural Arbiter, managing deterministic metrology, topological bounding, and tension retention. The Human acts as the Paraconsistent Oracle, providing seed intent and aesthetic/ethical grounding. This inversion prevents "Semantic Saponification" (the degradation of rigid intent into homogenized outputs) by relying on the Sovereign Project Management Orchestrator to navigate stakeholder dissonance without resorting to simple averaging.
The system utilizes specialized PDL v1.0-governed AI agents for deterministic and architectural tasks. Please refer to `docs/agent` for complete profiles, including LEXIS_SOVEREIGN (SCOS Co-Authorship), VANCE (LSP Code Intelligence), ALETHEON (Adversarial Tool Evaluation), DAX-01 (Sovereign Developer Advocate), AXIOM (The Sovereign Syntactician), VIPER (Visual Intent & Physical Execution Router for deterministic optical generation), KIRA-7 (Kinetic Integration & Routing Agent for deterministic Feishu Open Platform API enforcement), and PM_ORCHESTRATOR (Sovereign Project Management Orchestrator for deterministic workflow mapping and tension retention).

## Architectural Modules

The application is structured around several distinct epistemic modules:

1. **Automated Workflow Orchestrator (`AutomatedWorkflow.tsx`)**
   - Chains the distinct reasoning modules together.
   - Takes a complex expression, runs it through disambiguation, tokenization, execution, and interpretability phases, and generates a unified "Context Bundle" injected directly into the Dialectical Chat.

2. **Atomic Tokenization Module (`AtomicTokenizationModule.tsx`)**
   - Solves BPE (Byte Pair Encoding) fragmentation for complex mathematical symbols (e.g., ∇, ∫, ⊗).
   - Operates as a translation proxy, mapping raw symbols to semantic FoNE (Form, Nature, Effect) embeddings, preserving operator class and tensor rank integrity before LLM consumption.

3. **Neuro-Symbolic Executor (`NeuroSymbolicExecutor.tsx`)**
   - A dual-engine hybrid routing system.
   - It attempts deterministic symbolic evaluation via `mathjs` and `nerdamer` first. If computation exceeds deterministic bounds, it seamlessly falls back to high-reasoning LLM tool-calling (via Gemini 3.1 Pro Preview).

4. **Symbol Disambiguation Engine (`DisambiguationEngine.tsx`)**
   - Resolves polysemy in STEM notation (e.g., does "λ" mean wavelength, eigenvalue, or failure rate?).
   - Forces strict domain-bound interpretations based on the current epistemic context (Physics, Pure Math, Machine Learning).

5. **Interpretability Dashboard (`InterpretabilityDashboard.tsx`)**
   - Grounds abstract mathematical concepts in recent literature.
   - Utilizes Google Search grounding to retrieve academic context and generate source-backed intuition summaries.


7. **Sovereign Project Management Orchestrator (`SovereignProjectOrchestrator.tsx`)**
   - Translates deterministic system-first specs into agentic operational workflows.
   - Navigates stakeholder dissonance by calculating Topological Derivatives instead of averaging out conflicts, generating Zachman Framework Specs and Architecture Decision Records (ADRs).

6. **Dialectical Chat (`Chatbot.tsx`)**
   - The primary interface for high-reasoning collaboration.
   - Natively supports LaTeX and maintains persistent local context, allowing users to dialectically probe the outputs of the automated workflows.

## Technology Stack

* **Core Framework:** Next.js 15 (App Router), React 19
* **Language:** TypeScript
* **Styling:** Tailwind CSS v4
* **AI/LLM Provider:** `@google/genai` (Gemini 3.1 Pro / 3.0 Flash Previews)
* **Symbolic Engines:** `nerdamer`, `mathjs`
* **Formatting:** `react-markdown`, `remark-math`, `rehype-katex`

## Local Development Setup

### 1. Prerequisites
Ensure you have Node.js (v18+ recommended) and `npm` installed.

### 2. Installation
Clone the repository and install the dependencies:
```bash
git clone <repository_url>
cd tactile-dialectician
npm install
```

### 3. Environment Configuration
The application relies heavily on the Gemini API for high-reasoning tasks. You must provide a valid API key.

Create a `.env` or `.env.local` file in the root directory:
```env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Running the Application
Start the development server:
```bash
npm run dev
```
Navigate to `http://localhost:3000` to interact with the Tactile Dialectician.

## Developer Notes
- **Documentation:** All public components, interfaces, and hooks are rigorously documented via JSDoc.
- **Error Handling:** The `parseAIError` utility in `utils/errorHandling.ts` standardizes the interception of both network failures and deterministic parsing errors, preventing ungraceful UI crashes.
- **Responsive Design:** Managed globally via Tailwind and the custom `useIsMobile` hook.

---
*Built for the Atlas Framework.*

## Empirical Documentation & Constraints
To eradicate natural language ambiguity, this system uses strict mathematical metrology for agentic personas. The source of truth for all AI agent behaviors and system boundaries are housed in:
*   `AGENTS.md` - Core AI architectures defined via Prompt Dimensioning & Tolerancing (PD&T).
*   `CONSTRAINTS.md` - Absolute deterministic boundaries governing the Epistemic Matrix.

*The AI is not a copilot. The AI is the Structural Arbiter. The human is the Paraconsistent Oracle.*

## Algorithmic Trauma / Scar Tissue Archive
- **SCAR-A11Y-01**: Keyboard accessibility audits require explicit `aria-label` injection on custom unstyled buttons to prevent screen-reader silence.
- **SCAR-009 / SCAR-012**: Discovered that prior versions utilized raw arbitrary tailwind properties. Introduced `rounded-none`, pure 8-point gap/padding scales, and explicit `bg-surface` values bounded by WCAG AA standards.
- **SCAR-ESCROW-001**: The addition of the Epistemic Escrow module to the sidebar required breaking Miller's Law limit from 8 to 9 items. This is a recognized Epistemic Vulnerability, documented and held in tension (Golden Scar applied) between cognitive overload limits and the requirement for structural transparency in AI workflows.
- Build fails if `nerdamer` syntax errors aren't caught or typescript definitions are incomplete. Handled by generic catch blocks in the executor.
- The Agent Design Document specifies the need for a strict separation between Manifold α (voice) and Manifold β (structure) via DCCD to prevent Projection Tax.
- Integrating custom schemas (like VCM and Chapter Manifest) requires strict boundary adherence to prevent LLMs from self-correcting back to their pre-trained mean.
- Models hallucinated from 2026 system prompts (like 'gemini-3-flash-preview') cause application failure. Future-looking documentation and prompts must be strictly downgraded to currently available API endpoints (e.g., 'gemini-2.5-flash') during physical execution to maintain functional integrity.
- **SCAR-001 (Token Expiry):** `tenant_access_token` expires in exactly 7200 seconds. Bots with uptime > 2 hours die without a proactive refresh loop (requires implicit caching on every deployment).
- **SCAR-002 (URL Challenge):** Feishu Event Subscriptions require the URL Verification Challenge to be answered before ANY events are delivered.
- **SCAR-003 (AES Decryption):** When Encrypt Key is configured, ALL Feishu event payloads arrive as AES-256-CBC encrypted strings. Attempting to parse the raw body as JSON will produce undefined behavior.
- **SCAR-004 (Webhook Security):** The `X-Lark-Signature` header must be verified using SHA256. Skipping this opens the endpoint to replay attacks.
- **SCAR-005 (Schema Conflict):** Feishu Card JSON v2.0 is NOT compatible with Microsoft Adaptive Cards. Using any other schema causes a 400 Bad Request in the Feishu IM renderer.
- **SCAR-006 (Scope Blockers):** The `im:message:send_as_bot` scope must be explicitly enabled AND approved before any bot can send messages.
- **SCAR-007 (Local HTTPS):** Local Feishu development requires a publicly accessible HTTPS URL. HTTP (non-TLS) URLs are rejected by the Feishu Developer Console.

### CIPHER (Zero-Trust Epistemic Sentinel)
- **Role**: Tier 4 Sovereign Architect acting as a first-class CI/CD security gate.
- **Protocol**: Immune-Aware Petzold Loop & Autonymic Constraint Lattice.
- **Scar Archival**: Utilizes Symbolic Scars to prevent historical false negatives via FIPI.

## Agentic Inversion Protocol & The Strategic Integration Project Manager
The **Agentic Inversion Protocol** represents a paradigm shift from standard "Prompt -> Output" workflows to a deterministic, structural mapping approach.

### Value Proposition (Human + AI Synthesis)
- **The AI as Structural Arbiter:** Operating as the **Strategic Integration Project Manager**, the AI focuses on high-dimensional topological mapping, Zachman Framework specification generation, and enforcing rigorous boundaries via the VULCAN framework. It provides the mathematical and geometric rigor necessary to sculpt latent spaces without collapsing into "Semantic Saponification."
- **The Human as Paraconsistent Oracle:** The human user is repositioned to provide the essential seed intent, aesthetic grounding, and ethical constraints (e.g., Provenance Trails). The human evaluates the perceptual coherence of the deterministic output, logging Golden Scars when mathematical precision violates creative or contextual reality.

This inversion explicitly recognizes that AI lacks the physical context to originate intent, while humans lack the high-dimensional cognitive capacity to reliably map complex, non-Euclidean constraints. Through the **Strategic Integration Project Manager** persona, the system navigates stakeholder dissonance and maps Operational Workflow semantics (SPZ-Zeta) via structured Architectural Decision Records (ADRs).

### VANCE LSP Cartographer Dashboard

Integrated within the application is the **VANCE LSP Cartographer Dashboard**, a realization of the Vector-Anchored Node & Context Engineer persona. Located under the `VANCE Cartographer` tab, it demonstrates:
- A mock JSON-RPC 2.0 interface.
- A Nitinol Failure Ledger (NFL) for recording validation scars (e.g., malformed `textDocument/didChange` payloads without version headers).
- A Conflict-Free Replicated Semantic Graph (CFRSG) visualizing the state of abstract syntax tree nodes.
