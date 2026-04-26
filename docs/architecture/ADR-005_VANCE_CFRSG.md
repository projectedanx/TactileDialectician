# ADR-005: Adoption of Conflict-Free Replicated Semantic Graph (CFRSG) for LSP State Synchronization

**Status:** Accepted
**Date:** 2026-03-27
**Author:** VANCE Architect
**Context Segment:** Algorithmic Reparation (AGS-A Audit)

## Context
Language Server Protocol (LSP) agents typically rely on naive hashmaps to store symbol definitions, treating code as a linear sequence of text. This leads to five critical comorbid factors:
1.  **Asynchronous State Desynchronization:** `textDocument/didChange` events fire faster than flat indices can update, causing ontological shear.
2.  **Scope Mereology Collapse:** Shadowed variables in inner closures are incorrectly conflated with global variables.
3.  **Semantic Embedding Drift:** Vector embeddings lose structural truth over time without tethered graph edges.
4.  **Draft-Conditioned Decoding Gap:** LLMs hallucinate structurally malformed JSON-RPC payloads that pass soft validation.
5.  **The Reversal Curse:** Agents capable of resolving definition (A -> B) cannot automatically perform reverse reference lookup (B -> A) without explicit bidirectionality.

## Decision
We will reject the flat hashmap pattern and deploy the **VANCE (Vector-Anchored Node & Context Engineer) Architecture**, utilizing a **Conflict-Free Replicated Semantic Graph (CFRSG)**.

This architecture enforces four non-negotiable layers:
1.  **Incremental Parse Engine:** Utilize Tree-Sitter's sub-millisecond incremental AST diffs to process `textDocument/didChange` events without full re-parses.
2.  **Semantic Graph (Neo4j + Pinecone):** Employ a directed property graph to model scoping rules (`SCOPES_WITHIN`) and symbol relationships (`CALLS`, `INHERITS_FROM`), preventing Mereology Collapse. Pinecone provides a vector overlay for fuzzy proximity, strictly validated against the Neo4j structural truth.
3.  **Nitinol Failure Ledger (NFL):** Store every intercepted JSON-RPC schema violation as a "Symbolic Scar." These scars serve as hard negative constraints injected into future generation contexts via Failure-Informed Prompt Inversion.
4.  **Draft-Conditioned Constrained Decoder (DCCD):** Enforce strict compliance with the LSP 3.17 schema at the generation boundary. Malformed payloads are physically rejected before emission.

## Consequences

**Positive:**
- Complete immunity to the Reversal Curse through bidirectional graph traversals (`MATCH (a)-[:CALLS]->(b)` and `MATCH (a)<-[:CALLS]-(b)`).
- Elimination of Scope Mereology Collapse; `textDocument/references` now respects strict transitivity constraints based on graph depth.
- Absolute schema adherence via the DCCD barrier, preventing JSON-RPC parsing failures on the client side.
- Near-zero Drift Deficit through strictly ordered, monotonic application of Tree-Sitter deltas.

**Negative / Constraints:**
- Significantly higher architectural complexity (Graph DB, Vector DB, Tree-Sitter) compared to standard in-memory LSP implementations.
- Imposes a hard requirement on the client to respect LSP 3.17 version stamping; non-compliant clients will cause the monotonic update queue to fail.
- Requires explicit client-side debouncing (minimum 150ms) for `textDocument/completion` requests to prevent the thermodynamic bottleneck associated with real-time Trie graph traversal.
