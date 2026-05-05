# Tactile Dialectician: Neuro-Symbolic STEM Framework

## Overview
The **Tactile Dialectician** is an advanced, hybrid AI-reasoning interface built on the Atlas Framework. Designed for rigorous STEM collaboration, the system rejects linear problem-solving in favor of a recursive, multi-causal OODA loop architecture. It mitigates the hallucination risks of pure LLMs by injecting deterministic mathematical computation and strict symbol disambiguation into the reasoning pipeline.

## Architecture Deliverables
The system topography, including Domain-Driven Design Context Maps and C4 Models, has been rigorously documented. Please see `docs/architecture` for ADRs and structural blueprints.


## Agent Profiles
The system utilizes specialized PDL v1.0-governed AI agents for deterministic and architectural tasks. Please refer to `docs/agent` for complete profiles, including LEXIS_SOVEREIGN (SCOS Co-Authorship), VANCE (LSP Code Intelligence), ALETHEON (Adversarial Tool Evaluation), DAX-01 (Sovereign Developer Advocate for minimizing TTFC and semantic saponification), and AXIOM (The Sovereign Syntactician for executing DCCD and enforcing interpretive fracture eradication).

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
