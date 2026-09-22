with open('crm/src/views/admin/assignments/index.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# I will revert the employeeRole prop and the orQuery
target_query = """         if (!isDelegated) {
            const orQuery = `assigned_to.ilike.%${employeeId}%${employeeRole ? `,assigned_to.ilike.%${employeeRole}%` : ''}`;
            const [lRes, cRes, sRes, pRes] = await Promise.all([
               supabase.from('leads').select('*').or(orQuery),
               supabase.from('clients').select('*').or(orQuery),
               supabase.from('services').select('*').or(orQuery),
               supabase.from('projects').select('*').or(orQuery)
            ]);"""

replacement_query = """         if (!isDelegated) {
            const [lRes, cRes, sRes, pRes] = await Promise.all([
               supabase.from('leads').select('*').ilike('assigned_to', `%${employeeId}%`),
               supabase.from('clients').select('*').ilike('assigned_to', `%${employeeId}%`),
               supabase.from('services').select('*').ilike('assigned_to', `%${employeeId}%`),
               supabase.from('projects').select('*').ilike('assigned_to', `%${employeeId}%`)
            ]);"""

if target_query in content:
    content = content.replace(target_query, replacement_query)
    with open('crm/src/views/admin/assignments/index.jsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Reverted EmployeeWorkload query back to strict UUID.")
else:
    print("Could not find the target query.")
