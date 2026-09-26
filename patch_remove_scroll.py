import os
import re

filepath = 'crm/src/views/admin/crm/index.jsx'
with open(filepath, 'r', encoding='utf-8') as f: content = f.read()

content = re.sub(r'  useEffect\(\(\) => \{\n    if \(!selectedLead.*?\}\n  \}, \[selectedLead, loading\]\);\n', '', content, flags=re.DOTALL)
content = content.replace(' onClick={() => { scrollPosRef.current = window.scrollY; setSelectedLead(lead); }}', ' onClick={() => setSelectedLead(lead)}')

with open(filepath, 'w', encoding='utf-8') as f: f.write(content)

filepath = 'crm/src/views/admin/clients/index.jsx'
with open(filepath, 'r', encoding='utf-8') as f: content = f.read()

content = re.sub(r'  useEffect\(\(\) => \{\n    if \(!selectedClient.*?\}\n  \}, \[selectedClient, loading\]\);\n', '', content, flags=re.DOTALL)
content = content.replace(' onClick={() => { scrollPosRef.current = window.scrollY; setSelectedClient(client); }}', ' onClick={() => setSelectedClient(client)}')

with open(filepath, 'w', encoding='utf-8') as f: f.write(content)
print("Removed manual scroll logic")
