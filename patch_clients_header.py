import os

filepath = 'crm/src/views/admin/clients/index.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix header
old_th = '<th className="py-4 px-4 text-[12px] font-medium text-[#64748B] dark:text-gray-400 uppercase tracking-wider">Last Contacted</th>'
new_th = '<th className="py-4 px-4 text-[12px] font-medium text-[#64748B] dark:text-gray-400 uppercase tracking-wider">Date Created</th>'
content = content.replace(old_th, new_th)

# Fix cell
old_td = '{client.lastContact ? new Date(client.lastContact).toLocaleDateString("en-GB", { day: \'2-digit\', month: \'short\', year: \'numeric\' }) : "-"}'
new_td = '{client.created_at ? new Date(client.created_at).toLocaleDateString("en-GB", { day: \'2-digit\', month: \'short\', year: \'numeric\' }) : "-"}'
content = content.replace(old_td, new_td)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Clients header and cell patched")
