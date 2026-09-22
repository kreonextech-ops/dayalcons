with open('crm/src/views/admin/assignments/index.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

bad_str = "name: (d.title || d.name || '') + (d.phone ?  -  : '')"
good_str = "name: (d.title || d.name || '') + (d.phone ? ` - ${d.phone}` : '')"

if bad_str in content:
    content = content.replace(bad_str, good_str)
    with open('crm/src/views/admin/assignments/index.jsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Fixed syntax error")
else:
    print("Could not find bad string")
