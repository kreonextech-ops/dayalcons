with open('crm/src/views/admin/assignments/index.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

import re
content = re.sub(r'\{isAdmin \? employees\.map\(emp => \(\s*<option key=\{emp\.id\} value=\{emp\.id\}>\{emp\.name\}</option>\s*\)\) : \(\s*<option value=\{user\?\.id\}>Myself \(\{user\?\.name\}\)</option>\s*\)\}', r'{employees.map(emp => (\n                          <option key={emp.id} value={emp.id}>{emp.name}</option>\n                       ))}', content)

with open('crm/src/views/admin/assignments/index.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Dropdown patched with regex")
