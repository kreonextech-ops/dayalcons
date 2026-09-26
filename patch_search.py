with open('crm/src/views/admin/projects/index.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

s1 = '<input type="text" placeholder="Search client, case ID, project..."'
r1 = '<input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search client, case ID, project..."'
c = c.replace(s1, r1)

with open('crm/src/views/admin/projects/index.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
