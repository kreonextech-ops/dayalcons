with open('crm/src/views/admin/assignments/index.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('<EmployeeWorkload employeeId={selectedEmployee.id} tab={activeTab} />',
                          '<EmployeeWorkload employeeId={selectedEmployee.id} employeeRole={selectedEmployee.role} tab={activeTab} />')

content = content.replace('const EmployeeWorkload = ({ employeeId, tab }) => {',
                          'const EmployeeWorkload = ({ employeeId, employeeRole, tab }) => {')

old_queries = """         if (!isDelegated) {
            const [lRes, cRes, sRes, pRes] = await Promise.all([
               supabase.from('leads').select('*').like('assigned_to', `%${employeeId}%`),
               supabase.from('clients').select('*').like('assigned_to', `%${employeeId}%`),
               supabase.from('services').select('*').like('assigned_to', `%${employeeId}%`),
               supabase.from('projects').select('*').like('assigned_to', `%${employeeId}%`)
            ]);"""

new_queries = """         if (!isDelegated) {
            const orQuery = `assigned_to.ilike.%${employeeId}%${employeeRole ? `,assigned_to.ilike.%${employeeRole}%` : ''}`;
            const [lRes, cRes, sRes, pRes] = await Promise.all([
               supabase.from('leads').select('*').or(orQuery),
               supabase.from('clients').select('*').or(orQuery),
               supabase.from('services').select('*').or(orQuery),
               supabase.from('projects').select('*').or(orQuery)
            ]);"""

if old_queries in content:
    content = content.replace(old_queries, new_queries)
    with open('crm/src/views/admin/assignments/index.jsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Patched successfully")
else:
    print("Could not find queries to patch")
