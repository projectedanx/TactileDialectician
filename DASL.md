# Domain Agnostic Semantic Language (DASL)

## Operational Workflow Semantics: SPZ-Zeta
The **Strategic Integration Project Manager** (PM Persona) utilizes the SPZ-Zeta framework to encode Operational Workflows into deterministic architecture maps.

### SPZ-Zeta Primitives
- **Zeta-Node (ζ-Node):** Represents an atomic stakeholder intent or constraint (e.g., "Must execute within 100ms").
- **Tension Vector (τ-Vector):** The directional conflict between two ζ-Nodes (e.g., High Quality vs. Low Latency).
- **Paraconsistent Escrow (PE):** A designated holding state for unresolvable τ-Vectors, where the human (Paraconsistent Oracle) makes the final qualitative evaluation before architectural lock.

### Workflow Execution (Structural Mapping)
1. **Intake:** PM Persona extracts ζ-Nodes from natural language requirements.
2. **Topological Mapping:** PM Persona aligns ζ-Nodes onto a Zachman Framework matrix.
3. **Friction Calculation:** Calculates τ-Vectors and evaluates against the CFDI limit.
4. **Escrow/Lock:** If CFDI > 0.15, triggers a Paraconsistent Escrow state (requires Human evaluation). If CFDI <= 0.15, applies structural lock and generates an Architecture Decision Record (ADR).
