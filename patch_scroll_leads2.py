import os

filepath = 'crm/src/views/admin/crm/index.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('behavior: "instant"', 'behavior: "auto"')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Instant to auto")
