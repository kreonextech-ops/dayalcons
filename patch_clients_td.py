import os
import re

filepath = 'crm/src/views/admin/clients/index.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Normalize line endings
content = content.replace('\r\n', '\n')

pattern = re.compile(r'([ \t]*<td className="py-2 px-4">\n[ \t]*\{client\.email && <p.*?<\/p>\}\n[ \t]*\{client\.phone && <p.*?<\/p>\}\n[ \t]*<\/td>)', re.DOTALL)

replacement = r'\1\n                             <td className="py-2 px-4 text-[12px] text-gray-500 truncate max-w-[180px]" title={client.address || ""}>\n                                {client.address || "-"}\n                             </td>'

content = re.sub(pattern, replacement, content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Clients cell patched")
