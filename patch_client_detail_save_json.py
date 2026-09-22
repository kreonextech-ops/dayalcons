import os

filepath = 'crm/src/views/admin/clients/ClientDetail.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target = """        if (newServices.length > 0) await supabase.from("services").insert(newServices);
        if (newProjects.length > 0) await supabase.from("projects").insert(newProjects);"""

replacement = """        if (newServices.length > 0) await supabase.from("services").insert(newServices);
        if (newProjects.length > 0) await supabase.from("projects").insert(newProjects);
        
        // Also save the leadData to the clients table so it persists!
        await supabase.from("clients").update({ leadData: clientData.leadData }).eq("id", clientData.id);"""

if target in content:
    content = content.replace(target, replacement)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Patched ClientDetail.jsx to save leadData JSON")
else:
    print("Target not found.")
