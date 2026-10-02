import re

with open("crm/src/views/admin/crm/index.jsx", "r", encoding="utf-8") as f:
    text = f.read()

pattern = r'(<p className="text-sm text-gray-800 font-bold">\{lead\.name\}</p>\s*\{lead\.email && <p className="text-\[12px\] text-gray-500">\{lead\.email\}</p>\})'

replacement = r'<p className="text-sm text-gray-800 font-bold">{lead.name}</p>\n                              {lead.phone && <p className="text-[12px] font-medium text-gray-500 flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">call</span> {lead.phone}</p>}\n                              {lead.email && <p className="text-[11px] text-gray-400">{lead.email}</p>}'

text = re.sub(pattern, replacement, text)

with open("crm/src/views/admin/crm/index.jsx", "w", encoding="utf-8") as f:
    f.write(text)


with open("crm/src/views/admin/clients/index.jsx", "r", encoding="utf-8") as f:
    ctext = f.read()

cpattern = r'(<p className="text-sm text-gray-800 font-bold">\{client\.name\}</p>\s*\{client\.company && <p className="text-\[12px\] text-gray-500">\{client\.company\}</p>\})'

creplacement = r'<p className="text-sm text-gray-800 font-bold">{client.name}</p>\n                              {client.phone && <p className="text-[12px] font-medium text-gray-500 flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">call</span> {client.phone}</p>}\n                              {client.company && <p className="text-[11px] text-gray-400">{client.company}</p>}'

ctext = re.sub(cpattern, creplacement, ctext)

with open("crm/src/views/admin/clients/index.jsx", "w", encoding="utf-8") as f:
    f.write(ctext)
