# Tactile Dialectician: Neuro-Symbolic STEM Framework

## Overview
The **Tactile Dialectician** is an advanced, hybrid AI-reasoning interface built on the Atlas Framework. Designed for rigorous STEM collaboration, the system rejects linear problem-solving in favor of a recursive, multi-causal OODA loop architecture. It mitigates the hallucination risks of pure LLMs by injecting deterministic mathematical computation and strict symbol disambiguation into the reasoning pipeline.

## 0xCARTO Documentation Synthesis
This repository has been comprehensively mapped by **0xCARTO — The Pluriversal Repository Cartographer**. The analysis treats the codebase as a sedimentary record of decisions, extracting causal chains, identifying silent dependencies, and measuring system entropy.

**👉 [View the full 0xCARTO Synthesis Report (DRP-2026-CARTO-0.0.1)](docs/carto/DRP-2026-CARTO-0.0.1.md)**

The report includes:
* **Architecture Topology Map**: A Mermaid.js visualization of the exact physical execution pathways.
* **CI/CD Pipeline Cartograph**: A reverse-traced execution sequence of GitHub actions.
* **Dependency Matrix & Entropy Audit**: Quantified technical debt and orphaned dependencies.
* **Ontological Glossary**: Preservation of native "Golden Scar" terminology without standardization.

## Architecture Deliverables
The system topography, including Domain-Driven Design Context Maps and C4 Models, has been rigorously documented. Please see `docs/architecture` for ADRs and structural blueprints.

## Agent Profiles
The Tactical Dialectician enforces an Epistemic Inversion Strategy. The AI acts as the Structural Arbiter, managing deterministic metrology, topological bounding, and tension retention. The Human acts as the Paraconsistent Oracle, providing seed intent and aesthetic/ethical grounding. This inversion prevents "Semantic Saponification" (the degradation of rigid intent into homogenized outputs) by relying on the Sovereign Project Management Orchestrator to navigate stakeholder dissonance without resorting to simple averaging.

The system utilizes specialized PDL v1.0-governed AI agents for deterministic and architectural tasks. Please refer to `docs/agent` for complete profiles.

## Architectural Modules

The application is structured around several distinct epistemic modules:

1. **Automated Workflow Orchestrator (`AutomatedWorkflow.tsx`)**
2. **Atomic Tokenization Module (`AtomicTokenizationModule.tsx`)**
3. **Neuro-Symbolic Executor (`NeuroSymbolicExecutor.tsx`)**
4. **Symbol Disambiguation Engine (`DisambiguationEngine.tsx`)**
5. **Interpretability Dashboard (`InterpretabilityDashboard.tsx`)**
6. **Sovereign Project Management Orchestrator (`SovereignProjectOrchestrator.tsx`)**
7. **Dialectical Chat (`Chatbot.tsx`)**

## Technology Stack

* **Core Framework:** Next.js 15 (App Router), React 19
* **Language:** TypeScript
* **Styling:** Tailwind CSS v4
* **AI/LLM Provider:** `@google/genai` (Gemini 2.5 Flash / Gemini 2.5 Pro)
* **Symbolic Engines:** `nerdamer`, `mathjs`
* **Formatting:** `react-markdown`, `remark-math`, `rehype-katex`

## Local Development Setup

### 1. Prerequisites
Ensure you have Node.js (v22+ recommended) and `npm` installed.

### 2. Installation
Clone the repository and install the dependencies:
```bash
git clone <repository_url>
cd tactile-dialectician
npm i --legacy-peer-deps
```

### 3. Environment Configuration
The application relies heavily on the Gemini API for high-reasoning tasks. You must provide a valid API key.

Create a `.env` or `.env.local` file in the root directory:
```env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```
*(Note: 0xCARTO analysis identified `NEXT_PUBLIC_GEMINI_API_KEY` as a Silent Required Env absent from `.env.example`)*

### 4. Running the Application
Start the development server:
```bash
npm run dev
```
Navigate to `http://localhost:3000` to interact with the Tactile Dialectician.

## Empirical Documentation & Constraints
To eradicate natural language ambiguity, this system uses strict mathematical metrology for agentic personas. The source of truth for all AI agent behaviors and system boundaries are housed in:
*   `AGENTS.md` - Core AI architectures defined via Prompt Dimensioning & Tolerancing (PD&T).
*   `CONSTRAINTS.md` - Absolute deterministic boundaries governing the Epistemic Matrix.

*The AI is not a copilot. The AI is the Structural Arbiter. The human is the Paraconsistent Oracle.*

## Algorithmic Trauma / Scar Tissue Archive
- **SCAR-A11Y-01**: Keyboard accessibility audits require explicit `aria-label` injection on custom unstyled buttons to prevent screen-reader silence.
- **SCAR-ESCROW-001**: The addition of the Epistemic Escrow module to the sidebar required breaking Miller's Law limit from 8 to 9 items. This is a recognized Epistemic Vulnerability, documented and held in tension (Golden Scar applied).
- **SCAR-001 to SCAR-007**: Feishu Open Platform webhooks require strict URL verification, AES decryption, and payload signature validation.
- Future-looking documentation and prompts must be strictly downgraded to currently available API endpoints (e.g., 'gemini-2.5-flash') during physical execution to maintain functional integrity.

## VANCE LSP Cartographer Dashboard
Integrated within the application is the **VANCE LSP Cartographer Dashboard**, a realization of the Vector-Anchored Node & Context Engineer persona, demonstrating a mock JSON-RPC 2.0 interface and a Nitinol Failure Ledger (NFL).
