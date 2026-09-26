import re

files = ['crm/src/views/admin/projects/index.jsx', 'crm/src/views/admin/services/index.jsx']

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    old_insert = """       const { data: newClientData, error } = await supabase.from("clients").insert([{
         name: newCase.clientName,
         status: 'active'
       }]).select();"""

    new_insert = """       const { data: newClientData, error } = await supabase.from("clients").insert([{
         name: newCase.clientName,
         status: 'active',
         phone: newCase.phone || null,
         email: newCase.email || null,
         address: newCase.address || null,
         notes: newCase.whatsapp ? `WhatsApp: ${newCase.whatsapp}` : null
       }]).select();"""

    if old_insert in content:
        content = content.replace(old_insert, new_insert)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Patched insert in {filepath}")
    else:
        print(f"old_insert not found in {filepath}")
