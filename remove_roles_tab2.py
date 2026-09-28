with open('crm/src/views/admin/employees/index.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Remove the tab header
c = c.replace(
    '{["Employees", "Departments", "Designations", "Roles & Permissions"].map(tab => (',
    '{["Employees", "Departments", "Designations"].map(tab => ('
)

# Remove the tab content
c = c.replace(
    '{activeTab === "Roles & Permissions" && <TabRoles />}',
    ''
)

with open('crm/src/views/admin/employees/index.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
