**Summary:**
This PR implements the "Epistemic Inversion Strategy" by formally introducing the `AXIOM` persona (The Sovereign Syntactician). It transitions the system's documentation approach from probabilistic generation to deterministic, schema-bound structural law via Draft-Conditioned Constrained Decoding (DCCD).

**Key Changes:**
- **Axiom Agent Profile:** Added `docs/agent/AXIOM.md` detailing the new Epistemic Matrix and negative-space constraints (Anionic Architecture) for zero-ambiguity documentation.
- **Inversion Strategy & Checklist:** Created `docs/axiom_inversion/PLAN.md` and `CHECKLIST.md` mapping the human's value as the Paraconsistent Oracle and the AI's value as the Structural Arbiter.
- **Global Documentation Updates:** Integrated Axiom into `AGENTS.md`, updated the `README.md` Agent Profiles section, appended new metrological terminology to `DOMAIN_GLOSSARY.md` (e.g., Interpretive Fracture, Symbolic Scar Registry, CFDI), and updated `TODO.md` with completion status.

**Verification:**
- Verified documentation constraints and structural logic manually.
- The standard vitest testing suite was run against `lib/utils` and `utils/errorHandling` (CSAP) successfully to ensure documentation updates did not inadvertently alter core deterministic execution boundaries.
