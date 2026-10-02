import re

# Fix Leads
with open("crm/src/views/admin/crm/index.jsx", "r", encoding="utf-8") as f:
    text = f.read()

pattern = r'<span className="material-symbols-outlined text-\[12px\]">call</span> '
text = re.sub(pattern, '', text)
text = text.replace(' flex items-center gap-1', '')

with open("crm/src/views/admin/crm/index.jsx", "w", encoding="utf-8") as f:
    f.write(text)

# Fix Clients
with open("crm/src/views/admin/clients/index.jsx", "r", encoding="utf-8") as f:
    ctext = f.read()

ctext = re.sub(pattern, '', ctext)
ctext = ctext.replace(' flex items-center gap-1', '')

with open("crm/src/views/admin/clients/index.jsx", "w", encoding="utf-8") as f:
    f.write(ctext)
