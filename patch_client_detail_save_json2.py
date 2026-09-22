import os, re

filepath = 'crm/src/views/admin/clients/ClientDetail.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target = r'if \(newServices\.length > 0\) await supabase\.from\("services"\)\.insert\(newServices\);\s*if \(newProjects\.length > 0\) await supabase\.from\("projects"\)\.insert\(newProjects\);'
replacement = """if (newServices.length > 0) await supabase.from("services").insert(newServices);
        if (newProjects.length > 0) await supabase.from("projects").insert(newProjects);
        await supabase.from("clients").update({ leadData: clientData.leadData }).eq("id", clientData.id);"""

content = re.sub(target, replacement, content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Patched ClientDetail.jsx to save leadData JSON")
