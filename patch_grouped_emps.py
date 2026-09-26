def patch_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Add employeesGrouped state
    if 'const [employeesGrouped, setEmployeesGrouped] = useState({});' not in content:
        content = content.replace(
            'const [employeesMap, setEmployeesMap] = useState({});',
            'const [employeesMap, setEmployeesMap] = useState({});\n  const [employeesGrouped, setEmployeesGrouped] = useState({});'
        )

    # 2. Fetch designations and group them
    old_fetch_1 = 'const { data: empDataFetch } = await supabase.from("employees").select("id, name");'
    new_fetch_1 = """const { data: empDataFetch } = await supabase.from("employees").select("id, name, designation, role");
         const eGrouped = { Admin: [], CRO: [], OAS: [], Engineers: [], Others: [] };
         if (empDataFetch) {
            empDataFetch.forEach(e => {
               const desig = (e.designation || "").toLowerCase();
               const role = (e.role || "").toLowerCase();
               if (role === "admin" || desig.includes("admin")) eGrouped.Admin.push(e);
               else if (role === "cro" || desig.includes("relationship")) eGrouped.CRO.push(e);
               else if (role === "oas" || desig.includes("oas")) eGrouped.OAS.push(e);
               else if (desig.includes("engineer")) eGrouped.Engineers.push(e);
               else eGrouped.Others.push(e);
            });
         }
         setEmployeesGrouped(eGrouped);"""
    
    # Try multiple variations in case it differs
    if old_fetch_1 in content:
        content = content.replace(old_fetch_1, new_fetch_1)
    
    # 3. Update the select dropdown
    old_ui = """                        <option value="">All Employees</option>
                        {Object.entries(employeesMap).map(([id, name]) => (
                           <option key={id} value={id}>{name}</option>
                        ))}"""
    
    new_ui = """                        <option value="">All Employees</option>
                        {Object.entries(employeesGrouped).map(([groupName, emps]) => {
                           if (!emps || emps.length === 0) return null;
                           return (
                              <optgroup key={groupName} label={groupName}>
                                 {emps.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                              </optgroup>
                           );
                        })}"""

    if new_ui not in content:
        content = content.replace(old_ui, new_ui)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Patched {filepath}")

patch_file('crm/src/views/admin/crm/index.jsx')
patch_file('crm/src/views/admin/clients/index.jsx')
