import os

def insert_after(filepath, search, new_content):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    content = content.replace(search, search + '\n' + new_content)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

# CLIENTS
c_path = 'crm/src/views/admin/clients/index.jsx'
# Header
c_th_search = '<th className="py-4 px-4 text-[12px] font-medium text-[#64748B] dark:text-gray-400 uppercase tracking-wider">Contact Info</th>'
c_th_new = '                  <th className="py-4 px-4 text-[12px] font-medium text-[#64748B] dark:text-gray-400 uppercase tracking-wider">Address</th>'
insert_after(c_path, c_th_search, c_th_new)
# Cell
c_td_search = """                            <td className="py-2 px-4">
                                {client.email && <p className="text-sm text-gray-600">{client.email}</p>}
                                {client.phone && <p className="text-[12px] text-gray-500">{client.phone}</p>}
                             </td>"""
c_td_new = """                             <td className="py-2 px-4 text-[12px] text-gray-500 truncate max-w-[180px]" title={client.address || ""}>
                                {client.address || "-"}
                             </td>"""
insert_after(c_path, c_td_search, c_td_new)
# ColSpan
with open(c_path, 'r', encoding='utf-8') as f:
    cc = f.read()
cc = cc.replace('colSpan="6"', 'colSpan="7"')
with open(c_path, 'w', encoding='utf-8') as f:
    f.write(cc)


# LEADS
l_path = 'crm/src/views/admin/crm/index.jsx'
# Header
l_th_search = '<th className="py-2 px-4 text-[12px] font-medium text-[#64748B] dark:text-gray-400 uppercase tracking-wider">Source</th>'
l_th_new = '                  <th className="py-2 px-4 text-[12px] font-medium text-[#64748B] dark:text-gray-400 uppercase tracking-wider">Address</th>'
insert_after(l_path, l_th_search, l_th_new)
# Cell
l_td_search = '<td className="py-2 px-4 text-sm text-gray-600">{lead.source || lead.phone || "-"}</td>'
l_td_new = '                            <td className="py-2 px-4 text-sm text-gray-600 truncate max-w-[150px]" title={lead.address || ""}>{lead.address || "-"}</td>'
insert_after(l_path, l_td_search, l_td_new)
# ColSpan
with open(l_path, 'r', encoding='utf-8') as f:
    lc = f.read()
lc = lc.replace('colSpan="7"', 'colSpan="11"')
with open(l_path, 'w', encoding='utf-8') as f:
    f.write(lc)

print("Columns added")
