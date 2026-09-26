import os

filepath = 'crm/src/views/admin/crm/index.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Reduce table header and cell vertical padding to fit more leads
content = content.replace('className="py-4', 'className="py-2')
content = content.replace('className="py-3', 'className="py-1.5')

# Make sure we didn't accidentally shrink the Add New Lead button padding too much if it used py-4,
# but usually buttons use h-10 or py-2.
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Patched leads table padding")
