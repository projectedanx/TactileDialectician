with open('LEXICON.md', 'r') as f:
    content = f.read()

# remove old PAT-005 lexical cartography if it is at the bottom
to_remove = """PAT-005 · Lexical Cartography
Type: Analysis Zone Definition: Processing semantic space through Semantic Drift, Connotation Vectors, Semiotic Blind Spots, and Ambiguity Zones to extract Isomorphisms of Friction. Mechanism: Paraconsistent Hasse lattice mapping. PDL Activators: +++MereologyRoute(relation_type="dynamic_entanglement")"""

if to_remove in content:
    content = content.replace(to_remove, "")
else:
    print("Not found old pat005 at bottom")

# remove old section II extra rows if they are dangling
dangling_rows = """| `+++SymbiosisAnchor` | Structural/Systemic | Productivity J-Curve Friction | `value` |
| `+++PhronesisGuard` | Cognitive | Ontological Superposition Collapse | `tension` |
| `+++StigmergicLock` | Systemic | AST Shearing, Race Conditions | `scope` |
"""

if dangling_rows in content:
    content = content.replace(dangling_rows, "")

    # insert them properly into the table
    target = "| `+++SpatialBind` | Structural | Simulation-to-Reality Leakage | `Region_X`, `Region_Y`, `constraint` |"
    content = content.replace(target, target + "\n" + dangling_rows.strip())

with open('LEXICON.md', 'w') as f:
    f.write(content)
