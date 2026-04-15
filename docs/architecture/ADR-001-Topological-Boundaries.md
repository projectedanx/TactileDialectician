# ADR-001: Topological Boundaries - Modular Monolith with Deterministic MCP Sidecar

## Context
The Tactile Dialectician is a neuro-symbolic reasoning framework requiring low-latency state transitions between UI (Dialectical Chat), abstract interpretation (Disambiguation, Tokenization), and heavy execution (Neuro-Symbolic Executor). The underlying execution relies on a hybrid probabilistic (Google GenAI) and deterministic (`nerdamer`, `mathjs`) engine. A critical topological decision is required to prevent "Semantic Saponification" (domains bleeding into one another) while resisting unwarranted distributed complexity ("Resume-Driven Development").

## Decision
We establish and defend a **Modular Monolith Architecture with an Isolated Deterministic Sidecar**.
1. **The Monolith (Next.js/React):** The Automated Workflow, Disambiguation Engine, Tokenization Module, and Interpretability Dashboard will remain tightly cohesive within the Next.js process. They will communicate via in-process memory and React state boundaries, not over network APIs.
2. **The Sidecar (MCP Server):** The deterministic execution environment (`korsakov-neurosymbolic-server`), utilizing `nerdamer` and `mathjs`, is strictly sandboxed as an out-of-process Model Context Protocol (MCP) server communicating via `stdio`.

We explicitly reject the fracturing of this system into distinct Kubernetes-hosted microservices.

## Status
Accepted

## Consequences

### Positive
- **Latency Minimization:** Eliminates TCP/HTTP overhead for the high-frequency OODA loop traversing between Disambiguation, Tokenization, and LLM routing.
- **Transitivity Enforcement:** The MCP sidecar enforces a strict physical boundary, preventing the monolithic UI from directly importing or mutating the volatile state of the `mathjs` sandbox.
- **Architectural Bricolage:** Solves the problem with the minimum viable complexity, bypassing Kafka/Kubernetes overhead.

### Negative (The Projection Tax)
- **Vertical Scaling Constraints:** The Next.js monolith binds UI rendering and heavy probabilistic orchestration to the same Node.js event loop, risking starvation under concurrent load.
- **Stdio Bottlenecks:** Deep recursive symbolic computations within the MCP server may saturate the `stdio` pipe, leading to head-of-line blocking for subsequent compute requests.
- **Deployment Rigidity:** The UI cannot be scaled horizontally independent of the orchestration logic without replicating the entire monolith.

## Mitigations
- **Transport Agnosticism:** The MCP SDK abstracts the transport layer. Should the `stdio` pipe bottleneck materialize, the `korsakov-neurosymbolic-server` can be detached to an SSE (Server-Sent Events) transport on an isolated compute node with zero changes to the Domain Models.
- **Asynchronous Execution Boundaries:** Enforce strict asynchronous limits and timeout boundaries on the Neuro-Symbolic Executor to prevent the Node.js event loop from deadlocking during prolonged mathematical evaluations.
