# C4 Model: Tactile Dialectician

## Level 1: System Context
The macro-level view mapping the Tactile Dialectician against its external dependencies.

```mermaid
C4Context
    title System Context for Tactile Dialectician

    Person(stem_user, "STEM User", "A mathematician, physicist, or engineer seeking dialectical collaboration.")

    System(tactile_dialectician, "Tactile Dialectician", "Neuro-Symbolic STEM Framework providing recursive OODA loop analysis.")

    System_Ext(gemini_api, "Google GenAI (Gemini 3.1 Pro)", "Provides probabilistic reasoning, disambiguation, and dialectical synthesis.")

    Rel(stem_user, tactile_dialectician, "Interacts with UI, inputs abstract mathematical problems", "HTTPS")
    Rel(tactile_dialectician, gemini_api, "Offloads high-reasoning tasks and interpretability queries", "gRPC/REST")
```

## Level 2: Container
The physical topography isolating the Next.js Monolith from the Deterministic Sidecar.

```mermaid
C4Container
    title Container Diagram for Tactile Dialectician

    Person(stem_user, "STEM User", "End user navigating the interface.")

    System_Ext(gemini_api, "Google GenAI (Gemini 3.1 Pro)", "External LLM API.")

    System_Boundary(c1, "Tactile Dialectician Deployment") {
        Container(nextjs_monolith, "Next.js Modular Monolith", "React 19 / TypeScript", "Hosts the UI, Automated Workflow Orchestrator, and Epistemic logic.")
        Container(mcp_server, "Korsakov MCP Server", "Node.js / MCP SDK", "Isolated deterministic sidecar executing mathjs and nerdamer logic.")
        ContainerDb(local_storage, "Client Local Storage", "Browser Storage", "Persists Dialectical Chat history and Neuro-Symbolic traces.")
    }

    Rel(stem_user, nextjs_monolith, "Visits", "HTTPS")
    Rel(nextjs_monolith, local_storage, "Reads/Writes session state", "Browser API")
    Rel(nextjs_monolith, mcp_server, "Invokes symbolic/numeric tool requests", "stdio (MCP)")
    Rel(nextjs_monolith, gemini_api, "Requests AI-driven disambiguation and routing", "HTTPS")
```

## Level 3: Component (Next.js Modular Monolith)
Zooming into the Next.js container to map the internal epistemic modules.

```mermaid
C4Component
    title Component Diagram: Next.js Modular Monolith

    Container_Boundary(monolith, "Next.js Modular Monolith") {
        Component(workflow_orch, "Automated Workflow Orchestrator", "React Component", "Chains the epistemic modules, passes Context Bundles.")
        Component(chatbot, "Dialectical Chat", "React Component", "Primary user interface, maintains persistent conversation state.")

        Component(disambiguation, "Disambiguation Engine", "React Component", "Resolves polysemy in STEM notation using Gemini.")
        Component(tokenization, "Atomic Tokenization Module", "React Component", "Maps raw symbols to semantic FoNE embeddings.")
        Component(executor, "Neuro-Symbolic Executor", "React Component + Hooks", "Routes between LLM inference and MCP deterministic tools.")
        Component(dashboard, "Interpretability Dashboard", "React Component", "Grounds concepts in academic literature intuition.")

        Component(error_handling, "Controlled Scar Annealing Protocol (CSAP)", "Utility", "Metabolizes FAILED_NLI_CONTRADICTION errors.")
    }

    Container_Ext(mcp_server, "Korsakov MCP Server", "Deterministic execution sandbox")
    System_Ext(gemini_api, "Google GenAI API", "Probabilistic execution")

    Rel(workflow_orch, disambiguation, "Triggers", "In-process")
    Rel(workflow_orch, tokenization, "Triggers", "In-process")
    Rel(workflow_orch, executor, "Triggers", "In-process")
    Rel(workflow_orch, dashboard, "Triggers", "In-process")

    Rel(workflow_orch, chatbot, "Injects final Context Bundle", "React Props/State")

    Rel(executor, mcp_server, "Calls symbolic_compute / numeric_compute", "stdio")
    Rel(executor, gemini_api, "Falls back to probabilistic inference", "HTTPS")

    Rel(disambiguation, gemini_api, "Requests contextual resolution", "HTTPS")
    Rel(executor, error_handling, "Logs structural faults", "Function Call")
```

### Lexis Sovereign (Book Co-Author Agent)
*   **Type:** Autonomous Ghostwriting Agent System.
*   **Description:** Implements the Petzold Sequence and Epistemic Matrix to manufacture high-fidelity, voice-invariant long-form text (books) from sparse founder input.
*   **Components:**
    *   **Epistemic Matrix Engine:** Manages voice calibration and boundary condition enforcement (Anionic Architecture).
    *   **DCCD Orchestrator:** Handles the Draft-Conditioned Constrained Decoding two-pass generation system.
    *   **Symbolic Scar Registry:** Persistent vector database (JSONL) tracking historical failures to immunize future generations.
    *   **Review Critic:** Adversarial validation agent ensuring VMS and CFDI metrics are met.
