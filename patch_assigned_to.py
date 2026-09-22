import re

with open('crm/src/views/admin/crm/index.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# We need to add employees state
if 'const [employeesMap, setEmployeesMap] = useState({});' not in content:
    content = content.replace('const [leads, setLeads] = useState([]);', 'const [leads, setLeads] = useState([]);\n   const [employeesMap, setEmployeesMap] = useState({});')
    
# In fetchLeads, right after we get data, let's also fetch employees
fetch_emp_str = '''      const { data, error } = await query;
      if (!error && data) {
         // Merge with localStorage
'''
new_fetch_emp = '''      const { data, error } = await query;
      if (!error && data) {
         const { data: empData } = await supabase.from('employees').select('id, name');
         const eMap = {};
         if (empData) {
            empData.forEach(e => eMap[e.id] = e.name);
         }
         setEmployeesMap(eMap);
         
         // Merge with localStorage
'''
content = content.replace(fetch_emp_str, new_fetch_emp)

# In the render part, change lead.assigned_to display
old_render = '{lead.assigned_to ? (lead.assigned_to.includes("-") ? EMP- : lead.assigned_to) : "Unassigned"}'

# If it's a UUID (contains '-'), check map, otherwise fallback to the ID or original string (like "CRO")
new_render = '{lead.assigned_to ? (employeesMap[lead.assigned_to] || (lead.assigned_to.includes("-") ? EMP- : lead.assigned_to)) : "Unassigned"}'

content = content.replace(old_render, new_render)

with open('crm/src/views/admin/crm/index.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Patched CRM leads table to show employee names.")
