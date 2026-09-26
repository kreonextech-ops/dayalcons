import os
import re

filepath = 'crm/src/views/admin/crm/components/TabServiceRequirement.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Normalize line endings
content = content.replace('\r\n', '\n')

# 1. Remove `{isEditing ? (` and the corresponding `) : (` blocks for grid
grid_pattern = re.compile(r'[ \t]*\{isEditing \? \(\n(.*?)<\/>\n[ \t]*\) : \(\n.*?\n[ \t]*\)\}', re.DOTALL)
content = re.sub(grid_pattern, r'\1</>', content)

# 2. Remove `{isEditing ? (` for textarea
text_pattern = re.compile(r'[ \t]*\{isEditing \? \(\n(.*?)<\/textarea>\n[ \t]*\) : \(\n.*?\n[ \t]*\)\}', re.DOTALL)
content = re.sub(text_pattern, r'\1</textarea>', content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("TabServiceRequirement patched properly")
