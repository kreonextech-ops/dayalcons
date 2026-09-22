import os

filepath = 'crm/src/views/admin/clients/ClientDetail.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the incorrect 'name' with 'title' for services and projects (just to be safe, projects uses name, services uses title)
target = """      const newServices = toDesign.filter(s => !exServiceNames.includes(s)).map(s => ({
         name: s, client_id: clientData.id, status: "Active"
      }));
      const newProjects = toConstruct.filter(p => !exProjectNames.includes(p)).map(p => ({
         name: p, client_id: clientData.id, status: "Active"
      }));"""

replacement = """      const newServices = toDesign.filter(s => !exServiceNames.includes(s)).map(s => ({
         title: s, client_id: clientData.id, status: "Active"
      }));
      const newProjects = toConstruct.filter(p => !exProjectNames.includes(p)).map(p => ({
         name: p, client_id: clientData.id, status: "Active"
      }));"""

if target in content:
    content = content.replace(target, replacement)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Fixed ClientDetail save payload")
else:
    print("Target not found.")
