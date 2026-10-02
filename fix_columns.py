import re

# --- LEADS ---
with open("crm/src/views/admin/crm/index.jsx", "r", encoding="utf-8") as f:
    crm_text = f.read()

# 1. Add "Contact" header
crm_header_old = '<th className="py-2 px-4 text-[12px] font-medium text-[#64748B] dark:text-gray-400 uppercase tracking-wider">Lead</th>'
crm_header_new = '<th className="py-2 px-4 text-[12px] font-medium text-[#64748B] dark:text-gray-400 uppercase tracking-wider">Lead</th>\n                  <th className="py-2 px-4 text-[12px] font-medium text-[#64748B] dark:text-gray-400 uppercase tracking-wider">Contact</th>'
crm_text = crm_text.replace(crm_header_old, crm_header_new)

# 2. Fix the Lead cell and insert Contact cell, and fix Source cell
lead_pattern = r'<td className="py-2 px-4">\s*<p className="text-sm text-gray-800 font-bold">\{lead\.name\}</p>\s*\{lead\.phone && <p className="text-\[12px\] font-medium text-gray-500">\{lead\.phone\}</p>\}\s*\{lead\.email && <p className="text-\[11px\] text-gray-400">\{lead\.email\}</p>\}\s*</td>\s*<td className="py-2 px-4 text-sm text-gray-600">\{lead\.source \|\| lead\.phone \|\| "-"\}</td>'

lead_replacement = r"""<td className="py-2 px-4">
                              <p className="text-sm text-gray-800 font-bold">{lead.name}</p>
                              {lead.email && <p className="text-[11px] text-gray-400">{lead.email}</p>}
                           </td>
                           <td className="py-2 px-4 text-sm text-gray-600">{lead.phone || "-"}</td>
                           <td className="py-2 px-4 text-sm text-gray-600">{lead.source || "-"}</td>"""

crm_text = re.sub(lead_pattern, lead_replacement, crm_text)

# Also fix the colSpan in loading/empty states from 11 to 12
crm_text = crm_text.replace('colSpan="11"', 'colSpan="12"')

with open("crm/src/views/admin/crm/index.jsx", "w", encoding="utf-8") as f:
    f.write(crm_text)


# --- CLIENTS ---
with open("crm/src/views/admin/clients/index.jsx", "r", encoding="utf-8") as f:
    client_text = f.read()

# 1. Remove phone from under name in Clients
client_pattern = r'<p className="text-sm text-gray-800 font-bold">\{client\.name\}</p>\s*\{client\.phone && <p className="text-\[12px\] font-medium text-gray-500">\{client\.phone\}</p>\}\s*\{client\.company && <p className="text-\[11px\] text-gray-400">\{client\.company\}</p>\}'

client_replacement = r"""<p className="text-sm text-gray-800 font-bold">{client.name}</p>
                              {client.company && <p className="text-[11px] text-gray-400">{client.company}</p>}"""

client_text = re.sub(client_pattern, client_replacement, client_text)

with open("crm/src/views/admin/clients/index.jsx", "w", encoding="utf-8") as f:
    f.write(client_text)
