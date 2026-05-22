import re

with open('LEXICON.md', 'r') as f:
    content = f.read()

# Let's extract exactly SECTION I and SECTION II, and rebuild from scratch to avoid duplicates.
# 1. Get original SECTION I up to PAT-010
sec1_end = content.find("## SECTION II")
sec1 = content[:sec1_end]

# It has duplicates in sec1? Let's check
if sec1.count("PAT-011") > 0:
    # the python script earlier appended to sec1
    # find where PAT-010 ends
    pat10_end = sec1.find("### PAT-011")
    if pat10_end != -1:
        sec1 = sec1[:pat10_end]

new_pats = """### PAT-011 · Human-AI Symbiosis Engine
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

"""

# 2. Get original SECTION II table without the new rows
sec2_start = content.find("## SECTION II")
sec3_start = content.find("## SECTION III")
sec2 = content[sec2_start:sec3_start]

# clean any added table rows in sec2 just in case
to_remove = """| `+++SymbiosisAnchor` | Structural/Systemic | Productivity J-Curve Friction | `value` |
| `+++PhronesisGuard` | Cognitive | Ontological Superposition Collapse | `tension` |
| `+++StigmergicLock` | Systemic | AST Shearing, Race Conditions | `scope` |
"""
sec2 = sec2.replace(to_remove, "")
sec2 = sec2.replace(to_remove.strip(), "")
# also remove them if they are separate
sec2 = re.sub(r'\| `\+\+\+SymbiosisAnchor`.*?\n', '', sec2)
sec2 = re.sub(r'\| `\+\+\+PhronesisGuard`.*?\n', '', sec2)
sec2 = re.sub(r'\| `\+\+\+StigmergicLock`.*?\n', '', sec2)

# Now inject the rows correctly
target = "| `+++SpatialBind` | Structural | Simulation-to-Reality Leakage | `Region_X`, `Region_Y`, `constraint` |"
if target in sec2:
    sec2 = sec2.replace(target, target + "\n" + to_remove.strip())
else:
    print("Could not find end of table")

# 3. Get rest of the content (SECTION III onwards)
rest = content[sec3_start:]
# ensure there are no trailing new pats here
rest = re.sub(r'### PAT-011.*?(?=## SECTION III)', '', rest, flags=re.DOTALL)
rest = re.sub(r'PAT-005 · Lexical Cartography.*?(?=## SECTION III)', '', rest, flags=re.DOTALL) # in case it was at the bottom

final_content = sec1 + new_pats + sec2 + rest
with open('LEXICON.md', 'w') as f:
    f.write(final_content)
