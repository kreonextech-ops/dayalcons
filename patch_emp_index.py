with open('crm/src/views/admin/employees/index.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Add states for counts
idx = c.find('const [refreshTrigger, setRefreshTrigger] = useState(0);')
states = """const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [empCount, setEmpCount] = useState(0);
  const [adminCount, setAdminCount] = useState(0);
  const [deptCount, setDeptCount] = useState(0);
  const [desigCount, setDesigCount] = useState(0);

  useEffect(() => {
    const loadStats = async () => {
       const { data, error } = await supabase.from('employees').select('*');
       if (data && !error) {
           setEmpCount(data.length);
           setAdminCount(data.filter(e => e.role === 'Admin' || e.role === 'CRO').length);
           
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

c = c.replace('const [refreshTrigger, setRefreshTrigger] = useState(0);', states)

# Update KPIs
old_kpis = """const kpis = [
    { title: "Total Employees", value: "", icon: <MdPeople /> },
    { title: "System Users", value: "", icon: <MdAdminPanelSettings /> },
    { title: "Departments", value: "", icon: <MdDomain /> },
    { title: "Designations", value: "", icon: <MdEngineering /> },
  ];"""
new_kpis = """const kpis = [
    { title: "Total Employees", value: empCount, icon: <MdPeople /> },
    { title: "System Admins", value: adminCount, icon: <MdAdminPanelSettings /> },
    { title: "Departments", value: deptCount, icon: <MdDomain /> },
    { title: "Designations", value: desigCount, icon: <MdEngineering /> },
  ];"""
c = c.replace(old_kpis, new_kpis)

with open('crm/src/views/admin/employees/index.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
