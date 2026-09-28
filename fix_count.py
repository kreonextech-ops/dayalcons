with open('crm/src/views/admin/employees/index.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace("e.role === 'Admin' || e.role === 'CRO'", "e.role === 'Admin'")

with open('crm/src/views/admin/employees/index.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
