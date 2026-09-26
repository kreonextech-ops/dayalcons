import os

filepath = 'crm/src/views/admin/clients/ClientDetail.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Make sure we normalize lines
content = content.replace('\r\n', '\n')

old_save = """  const handleSaveServiceRequirements = async () => {
    try {
      const selected = clientData.leadData?.selectedServices || [];
      if (!selected.length) return;
      
      const toDesign = selected.filter(s => DESIGN_SERVICES_LIST.includes(s));
      const toConstruct = selected.filter(s => CONSTRUCTION_SERVICES_LIST.includes(s));
      
      // We should check if they already exist to prevent dupes, but for now we just insert missing
      
      // Fetch existing
      const { data: exServices } = await supabase.from("services").select("title").eq("client_id", clientData.id);
      const { data: exProjects } = await supabase.from("projects").select("name").eq("client_id", clientData.id);
      
      const exServiceNames = exServices?.map(s => s.title) || [];
      const exProjectNames = exProjects?.map(p => p.name) || [];
      
      const newServices = toDesign.filter(s => !exServiceNames.includes(s)).map(s => ({
         title: s, client_id: clientData.id, status: "Active"
      }));
      const newProjects = toConstruct.filter(p => !exProjectNames.includes(p)).map(p => ({
         name: p, client_id: clientData.id, status: "Active"
      }));
      
      if (newServices.length > 0) await supabase.from("services").insert(newServices);
        if (newProjects.length > 0) await supabase.from("projects").insert(newProjects);
        await supabase.from("clients").update({ leadData: clientData.leadData }).eq("id", clientData.id);
      
      alert("Service requirements saved & created successfully!");
    } catch (err) {
      alert("Error saving service requirements: " + err.message);
    }
  };"""

new_save = """  const handleSaveServiceRequirements = async () => {
    try {
      const selected = clientData.leadData?.selectedServices || [];
      
      const toDesign = selected.filter(s => DESIGN_SERVICES_LIST.includes(s));
      const toConstruct = selected.filter(s => CONSTRUCTION_SERVICES_LIST.includes(s));
      
      const { data: exServices } = await supabase.from("services").select("title").eq("client_id", clientData.id);
      const { data: exProjects } = await supabase.from("projects").select("name").eq("client_id", clientData.id);
      
      const exServiceNames = exServices?.map(s => s.title) || [];
      const exProjectNames = exProjects?.map(p => p.name) || [];
      
      const newServices = toDesign.filter(s => !exServiceNames.includes(s)).map(s => ({
         title: s, client_id: clientData.id, status: "Active"
      }));
      const newProjects = toConstruct.filter(p => !exProjectNames.includes(p)).map(p => ({
         name: p, client_id: clientData.id, status: "Active"
      }));
      
      if (newServices.length > 0) await supabase.from("services").insert(newServices);
      if (newProjects.length > 0) await supabase.from("projects").insert(newProjects);

      // Update work_types summary for list view
      const finalWorkTypes = selected.join(', ');
      await supabase.from("clients").update({ 
         leadData: clientData.leadData,
         work_types: finalWorkTypes
      }).eq("id", clientData.id);

      // Save to localStorage so list views fetch it immediately
      const local = JSON.parse(localStorage.getItem(`client_${clientData.id}`) || "{}");
      local.work_types = finalWorkTypes;
      local.leadData = clientData.leadData;
      localStorage.setItem(`client_${clientData.id}`, JSON.stringify(local));
      
      alert("Service requirements saved successfully!");
    } catch (err) {
      alert("Error saving service requirements: " + err.message);
    }
  };"""

content = content.replace(old_save, new_save)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("ClientDetail patched")
