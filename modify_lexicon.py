import re

def modify_lexicon():
    with open('LEXICON.md', 'r') as f:
        content = f.read()

    new_patterns = """
### PAT-011 · Human-AI Symbiosis Engine
**Type**: Integrated Framework | **AT Score**: 0.98
**Definition**: The deliberate fusion of human non-obvious analytical lenses (such as tacit reflexive dialogue) with rigid AI specification blocks (such as JSON-LD DCCD execution). This synthesis creates an emergent property where structural determinism does not erase nuanced human realities.
**Mechanism**: Maps qualitative inputs to structural JSON outputs, anticipating initial cognitive friction (Productivity J-Curve) followed by massive efficiency gains.
**PDL Activators**: `+++SymbiosisAnchor(value="emergent_determinism")`

---

### PAT-012 · Paraconsistent Synthesis Node
**Type**: Epistemic Operator | **AT Score**: 0.94
**Definition**: A structural topological engine designed to hold the unquantifiable entropy of human tacit knowledge and the rigid determinism of AI models in superposition without forcing collapse.
**Mechanism**: Tension computation mapping divergent ontological planes into an Isomorphism of Friction, resolving output with the Golden Scar constraint (Φ = 1.618).
**PDL Activators**: `+++PhronesisGuard(tension="paraconsistent")`

---

### PAT-013 · Agentic Inversion Engine
**Type**: Epistemic Operator | **AT Score**: 0.95
**Definition**: Calculates epistemic drift between fuzzy human intent and rigid AI schema, proposing a Latent Leap resolution.
**Mechanism**: Tension computation mapping divergent ontological planes into an Isomorphism of Friction.
**PDL Activators**: `+++PhronesisGuard(tension="inversion")`

---

### PAT-014 · Lexical Cartography
**Type**: Analysis Zone
**Definition**: Processing semantic space through Semantic Drift, Connotation Vectors, Semiotic Blind Spots, and Ambiguity Zones to extract Isomorphisms of Friction.
**Mechanism**: Paraconsistent Hasse lattice mapping.
**PDL Activators**: `+++MereologyRoute(relation_type="dynamic_entanglement")`

---

### PAT-015 · Stigmergic Mutex Holon
**Type**: Execution Constraint | **AT Score**: 0.96
**Definition**: An operational artifact derived from Semantic Mutex Locking where agents leave machine-readable pheromones (OS-level file locks) prior to state mutation to prevent Abstract Syntax Tree (AST) shearing.
**Mechanism**: Decentralized lock propagation across parallel execution branches.
**PDL Activators**: `+++StigmergicLock(scope="ast_node")`

---

## SECTION II"""

    content = content.replace("## SECTION II", new_patterns)

    # Also update section 2 decorators
    decorators = """| `+++SymbiosisAnchor` | Structural/Systemic | Productivity J-Curve Friction | `value` |
| `+++PhronesisGuard` | Cognitive | Ontological Superposition Collapse | `tension` |
| `+++StigmergicLock` | Systemic | AST Shearing, Race Conditions | `scope` |
"""

    # insert before "---" that separates SECTION II and SECTION III
    parts = content.split("## SECTION III")
    if len(parts) > 1:
        parts[0] = parts[0] + decorators
        content = "## SECTION III".join(parts)

    with open('LEXICON.md', 'w') as f:
        f.write(content)

modify_lexicon()
