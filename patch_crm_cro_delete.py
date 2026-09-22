import os

filepath = 'crm/src/views/admin/crm/index.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target = "const isAdmin = loggedInUser?.role === 'Admin';"
replacement = "const isAdmin = loggedInUser?.role === 'Admin' || loggedInUser?.role === 'CRO';"

if target in content:
    content = content.replace(target, replacement)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Patched CRM leads index.jsx for CRO delete access")
else:
    print("Target not found.")
