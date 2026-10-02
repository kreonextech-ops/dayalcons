with open("crm/src/views/admin/crm/index.jsx", "r", encoding="utf-8") as f:
    crm_text = f.read()

crm_old = """<td className="py-2 px-4">
<p className="text-sm text-gray-800 font-bold">{lead.name}</p>
{lead.email && <p className="text-[12px] text-gray-500">{lead.email}</p>}
</td>"""

crm_new = """<td className="py-2 px-4">
<p className="text-sm text-gray-800 font-bold">{lead.name}</p>
{lead.phone && <p className="text-[12px] font-medium text-gray-500 flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">call</span> {lead.phone}</p>}
{lead.email && <p className="text-[11px] text-gray-400">{lead.email}</p>}
</td>"""

crm_text = crm_text.replace(crm_old, crm_new)

with open("crm/src/views/admin/crm/index.jsx", "w", encoding="utf-8") as f:
    f.write(crm_text)

with open("crm/src/views/admin/clients/index.jsx", "r", encoding="utf-8") as f:
    client_text = f.read()

client_old = """<td className="py-2 px-4">
<p className="text-sm text-gray-800 font-bold">{client.name}</p>
{client.company && <p className="text-[12px] text-gray-500">{client.company}</p>}
</td>"""

client_new = """<td className="py-2 px-4">
<p className="text-sm text-gray-800 font-bold">{client.name}</p>
{client.phone && <p className="text-[12px] font-medium text-gray-500 flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">call</span> {client.phone}</p>}
{client.company && <p className="text-[11px] text-gray-400">{client.company}</p>}
</td>"""

client_text = client_text.replace(client_old, client_new)

with open("crm/src/views/admin/clients/index.jsx", "w", encoding="utf-8") as f:
    f.write(client_text)
