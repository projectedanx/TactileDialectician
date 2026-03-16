# Atlas Framework: Tactile Dialectician v1

## 1. [MISE-EN-SCÈNE] (Contextual Stage Setting)
This repository houses the **Tactile Dialectician**, a neuro-symbolic reasoning engine and STEM assistant built on the Atlas Framework. It rejects the linear, waterfall approach to problem-solving in favor of a recursive, multi-causal OODA loop (Observe, Orient, Decide, Act).

## Core Modules
* **Atomic Tokenization Module:** Mitigates BPE fragmentation by injecting FoNE-inspired semantic embeddings for complex STEM symbols. Acts as a "Translation Proxy" to generate token-efficient, unambiguous payloads for primary LLMs.
* **Neuro-Symbolic Executor:** A hybrid routing engine that attempts deterministic symbolic computation (via `nerdamer`/`mathjs`) before falling back to high-reasoning LLM tool-calling (Gemini 3.1 Pro Preview).
* **Disambiguation Engine:** A multi-lens classifier for resolving polysemy across STEM domains.
* **Interpretability Dashboard:** Audits reasoning paths and grounds symbols in recent literature via Google Search.
* **Dialectical Chat:** A high-reasoning STEM collaboration interface with native LaTeX support.

## Tech Stack
* **Framework:** Next.js 15 (App Router), React 19
* **Styling:** Tailwind CSS v4
* **AI/LLM:** `@google/genai` (Gemini 3.1 Pro Preview, Gemini 3 Flash Preview)
* **Computation:** `nerdamer`, `mathjs`
* **Markdown/Math:** `react-markdown`, `remark-math`, `rehype-katex`

## Setup & Installation
1. Clone the repository.
2. Install dependencies: `npm install`
3. Configure your environment:
   Create a `.env` file and add your Gemini API key:
   ```env
   NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
   ```
4. Run the development server: `npm run dev`
