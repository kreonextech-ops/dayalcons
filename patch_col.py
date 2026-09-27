with open('crm/src/views/admin/clients/index.jsx', 'r', encoding='utf-8') as f:
    c = f.read()
c = c.replace('colSpan="7"', 'colSpan="8"')
with open('crm/src/views/admin/clients/index.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
