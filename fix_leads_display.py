import re

with open('crm/src/views/admin/crm/index.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Replace single mapping with multiple mapping
old_display = '{lead.assigned_to ? (employeesMap[lead.assigned_to] || (lead.assigned_to.includes("-") ? `EMP-${lead.assigned_to.substring(0, 5).toUpperCase()}` : lead.assigned_to)) : "Unassigned"}'

new_display = '{lead.assigned_to ? (lead.assigned_to.split(",").filter(Boolean).map(id => employeesMap[id.trim()] || (id.includes("-") ? `EMP-${id.substring(0, 5).toUpperCase()}` : id)).join(", ")) : "Unassigned"}'

c = c.replace(old_display, new_display)

with open('crm/src/views/admin/crm/index.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
