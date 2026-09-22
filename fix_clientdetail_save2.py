import os

filepath = 'crm/src/views/admin/clients/ClientDetail.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target = 'const { data: exServices } = await supabase.from("services").select("name").eq("client_id", clientData.id);'
replacement = 'const { data: exServices } = await supabase.from("services").select("title").eq("client_id", clientData.id);'
content = content.replace(target, replacement)

target2 = 'const exServiceNames = exServices?.map(s => s.name) || [];'
replacement2 = 'const exServiceNames = exServices?.map(s => s.title) || [];'
content = content.replace(target2, replacement2)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed select query in ClientDetail save")
