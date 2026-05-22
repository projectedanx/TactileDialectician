import re

with open('LEXICON.md', 'r') as f:
    content = f.read()

# I see `PAT-011` might be duplicated or something, let's just make sure there are no duplicate sections for PAT-011 to PAT-015
# And fix the decorator table.

start_sec2 = content.find("## SECTION II")
end_sec2 = content.find("## SECTION III")
sec2 = content[start_sec2:end_sec2]

# The decorators are at the very bottom of sec2
if "+++SymbiosisAnchor" in sec2 and "| `+++SymbiosisAnchor`" not in sec2:
    print("Table missing them?")
