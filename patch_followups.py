filepath = 'crm/src/views/admin/followups/index.jsx'
with open(filepath, 'r', encoding='utf-8') as f: content = f.read()
if 'r.phone.includes(searchTerm)' in content:
    content = content.replace('r.phone.includes(searchTerm)', 'String(r.phone).includes(searchTerm)')
    with open(filepath, 'w', encoding='utf-8') as f: f.write(content)
