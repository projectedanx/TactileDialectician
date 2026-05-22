with open('LEXICON.md', 'r') as f:
    content = f.read()

target = "| `+++SpatialBind` | Structural | Simulation-to-Reality Leakage | `Region_X`, `Region_Y`, `constraint` |"
if target in content and "+++SymbiosisAnchor" not in content:
    content = content.replace(target, target + """
| `+++SymbiosisAnchor` | Structural/Systemic | Productivity J-Curve Friction | `value` |
| `+++PhronesisGuard` | Cognitive | Ontological Superposition Collapse | `tension` |
| `+++StigmergicLock` | Systemic | AST Shearing, Race Conditions | `scope` |""")
    with open('LEXICON.md', 'w') as f:
        f.write(content)
    print("Decorators injected into table")
else:
    print("Decorators already present or table not found")
