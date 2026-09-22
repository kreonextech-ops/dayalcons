with open('crm/src/views/admin/crm/index.jsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if '{lead.assigned_to ? (lead.assigned_to.includes("-") ? `EMP-${lead.assigned_to.substring(0, 5).toUpperCase()}` : lead.assigned_to) : "Unassigned"}' in line:
        lines[i] = line.replace('{lead.assigned_to ? (lead.assigned_to.includes("-") ? `EMP-${lead.assigned_to.substring(0, 5).toUpperCase()}` : lead.assigned_to) : "Unassigned"}', '{lead.assigned_to ? (employeesMap[lead.assigned_to] || (lead.assigned_to.includes("-") ? `EMP-${lead.assigned_to.substring(0, 5).toUpperCase()}` : lead.assigned_to)) : "Unassigned"}')

with open('crm/src/views/admin/crm/index.jsx', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print("Replaced line for real")
