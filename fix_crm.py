import re

with open('crm/src/views/admin/crm/index.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Inject fetching logic
target_fetch = '''      const { data, error } = await query;
      if (!error && data) {
         // Merge with localStorage'''
         
new_fetch = '''      const { data, error } = await query;
      if (!error && data) {
         const { data: empData } = await supabase.from('employees').select('id, name');
         const eMap = {};
         if (empData) {
            empData.forEach(e => eMap[e.id] = e.name);
         }
         setEmployeesMap(eMap);
         // Merge with localStorage'''

if target_fetch in content:
    content = content.replace(target_fetch, new_fetch)
else:
    print("Could not find target_fetch")

# 2. Inject rendering logic
target_render = '{lead.assigned_to ? (lead.assigned_to.includes("-") ? EMP- : lead.assigned_to) : "Unassigned"}'
new_render = '{lead.assigned_to ? (employeesMap[lead.assigned_to] || (lead.assigned_to.includes("-") ? EMP- : lead.assigned_to)) : "Unassigned"}'

if target_render in content:
    content = content.replace(target_render, new_render)
else:
    print("Could not find target_render")

with open('crm/src/views/admin/crm/index.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Done")
