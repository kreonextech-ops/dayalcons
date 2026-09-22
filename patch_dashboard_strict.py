import os

filepath = 'crm/src/views/admin/default/index.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

replacements = [
    (".like('assigned_to', `%${loggedInUser.id}%`)", ".or(`assigned_to.ilike.%${loggedInUser.id}%${loggedInUser.role ? `,assigned_to.ilike.%${loggedInUser.role}%` : ''}`)"),
]

for old, new in replacements:
    content = content.replace(old, new)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Dashboard patched")
