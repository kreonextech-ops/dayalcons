import os

filepath = 'crm/src/views/admin/clients/index.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace Header
content = content.replace(
    '<th className="py-2 px-4 text-left text-[11px] font-bold text-[#64748B] uppercase tracking-wider">LAST CONTACTED</th>',
    '<th className="py-2 px-4 text-left text-[11px] font-bold text-[#64748B] uppercase tracking-wider">DATE CREATED</th>'
)

# Replace Cell
cell_old = """                             <td className="py-2 px-4 text-[12px] text-gray-500">
                                {client.lastContact ? new Date(client.lastContact).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' }) : "-"}
                             </td>"""
cell_new = """                             <td className="py-2 px-4 text-[12px] text-gray-500">
                                {client.created_at ? new Date(client.created_at).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' }) : "-"}
                             </td>"""
content = content.replace(cell_old, cell_new)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Clients index patched")
