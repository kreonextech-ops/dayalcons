import os

def patch_file(filepath, state_vars_to_remove, filter_blocks_to_remove):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove state vars
    for var in state_vars_to_remove:
        content = content.replace(f'const [{var}, set{var[0].upper() + var[1:]}] = useState("");\n', '')
        content = content.replace(f'    const [{var}, set{var[0].upper() + var[1:]}] = useState("");\n', '')
        content = content.replace(f'  const [{var}, set{var[0].upper() + var[1:]}] = useState("");\n', '')

    # Remove filtering logic
    for block in filter_blocks_to_remove:
        content = content.replace(block, '')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

# 1. Leads
leads_path = 'crm/src/views/admin/crm/index.jsx'
leads_vars = ['filterStatus', 'filterTemp', 'filterMonth']
leads_blocks = [
'''                         if (filterStatus) {
                            filtered = filtered.filter(x => x.status === filterStatus);
                         }\n''',
'''                         if (filterTemp) {
                            filtered = filtered.filter(x => x.lead_temperature === filterTemp);
                         }\n''',
'''                         if (filterMonth) {
                            const [y, m] = filterMonth.split("-");
                            filtered = filtered.filter(x => {
                               if (!x.created_at) return false;
                               const date = new Date(x.created_at);
                               return date.getFullYear() === parseInt(y) && (date.getMonth() + 1) === parseInt(m);
                            });
                         }\n'''
]
patch_file(leads_path, leads_vars, leads_blocks)

# 2. Clients
clients_path = 'crm/src/views/admin/clients/index.jsx'
clients_vars = ['filterStatus']
clients_blocks = [
'''                     if (filterStatus) {
                        filtered = filtered.filter(x => x.status === filterStatus);
                     }\n'''
]
patch_file(clients_path, clients_vars, clients_blocks)

print("Unused vars removed")
