with open('crm/src/views/admin/employees/index.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

old_loadStats = """  useEffect(() => {
    const loadStats = async () => {
       // Employees & Admins
       const { data, error } = await supabase.from('employees').select('role');
       if (data && !error) {
           setEmpCount(data.length);
           setAdminCount(data.filter(e => e.role === 'Admin').length);
       }
       
       // Real Database Counts
       const { count: dCount } = await supabase.from('departments').select('*', { count: 'exact', head: true });
       if (dCount !== null) setDeptCount(dCount);
       
       const { count: desCount } = await supabase.from('designations').select('*', { count: 'exact', head: true });
       if (desCount !== null) setDesigCount(desCount);
    };
    loadStats();
  }, [refreshTrigger]);"""

new_loadStats = """  useEffect(() => {
    const loadStats = async () => {
       const { data, error } = await supabase.from('employees').select('role, department, designation');
       if (data && !error) {
           setEmpCount(data.length);
           setAdminCount(data.filter(e => e.role === 'Admin').length);
           
           const depts = new Set();
           const desigs = new Set();
           data.forEach(e => {
               if (e.department) depts.add(e.department);
               if (e.designation) desigs.add(e.designation);
           });
           setDeptCount(depts.size);
           setDesigCount(desigs.size);
       }
    };
    loadStats();
  }, [refreshTrigger]);"""

c = c.replace(old_loadStats, new_loadStats)

with open('crm/src/views/admin/employees/index.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
