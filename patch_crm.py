import re
with open('crm/src/views/admin/crm/index.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# fetch logic
content = re.sub(r'(const\s+\{\s*data,\s*error\s*\}\s*=\s*await\s+query;\s*if\s*\(!error\s*&&\s*data\)\s*\{)', 
r'\1\n         const { data: empDataFetch } = await supabase.from("employees").select("id, name");\n         const eMap = {};\n         if (empDataFetch) { empDataFetch.forEach(e => eMap[e.id] = e.name); }\n         setEmployeesMap(eMap);\n', content)

# render logic
content = re.sub(r'\{lead\.assigned_to\s*\?\s*\(lead\.assigned_to\.includes\("-"\)\s*\?\s*EMP-\$\{lead\.assigned_to\.substring\(0,\s*5\)\.toUpperCase\(\)\}\s*:\s*lead\.assigned_to\)\s*:\s*"Unassigned"\}',
r'{lead.assigned_to ? (employeesMap[lead.assigned_to] || (lead.assigned_to.includes("-") ? EMP- : lead.assigned_to)) : "Unassigned"}', content)

with open('crm/src/views/admin/crm/index.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Regex patched")
