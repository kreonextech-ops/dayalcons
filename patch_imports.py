import os

filepath = 'crm/src/views/admin/clients/index.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target = 'MdPerson, '
replacement = 'MdPerson, MdPeople, MdLocalFireDepartment, '

content = content.replace(target, replacement)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Imports patched")
