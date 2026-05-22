import re

with open('LEXICON.md', 'r') as f:
    content = f.read()

# I accidentally put the new patterns in between section II table and section III, they should be in section I before section II.
# Let's clean it up properly.

# Find the end of PAT-010 which is the last pattern of Section I
pat_010_end = content.find("## SECTION II")

section_1_part = content[:pat_010_end]
rest = content[pat_010_end:]

# extract the added patterns from `rest`
# they are between --- and | `+++SymbiosisAnchor`

start_of_new_pats = rest.find("### PAT-011")
end_of_new_pats = rest.find("| `+++SymbiosisAnchor`")

new_pats = rest[start_of_new_pats:end_of_new_pats]

# Clean up `rest`
rest_clean = rest[:start_of_new_pats] + rest[end_of_new_pats:]

# Now reconstruct
final_content = section_1_part + new_pats + rest_clean

with open('LEXICON.md', 'w') as f:
    f.write(final_content)
