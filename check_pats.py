with open('LEXICON.md', 'r') as f:
    content = f.read()

if "Lexical Cartography" in content:
    print("Lexical Cartography found")
else:
    print("Not found")

if "Stigmergic Mutex Holon" in content:
    print("Stigmergic Mutex Holon found")
else:
    print("Not found")

if "Human-AI Symbiosis Engine" in content:
    print("Human-AI Symbiosis Engine found")
else:
    print("Not found")

import re
matches = re.findall(r'PAT-\d{3}', content)
print(set(matches))
