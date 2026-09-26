import os

filepath = 'crm/src/views/admin/clients/ClientDetail.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('\r\n', '\n')

old_func = """  const handleSaveServiceRequirements = async () => {
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

new_func = """  const handleSaveServiceRequirements = async () => {
    try {
      const selected = clientData.leadData?.selectedServices || [];
      const finalWorkTypes = selected.join(', ');

      // Optimistic update for UI speed
      const local = JSON.parse(localStorage.getItem(`client_${clientData.id}`) || "{}");
      local.work_types = finalWorkTypes;
      local.leadData = clientData.leadData;
      localStorage.setItem(`client_${clientData.id}`, JSON.stringify(local));

      // Separate into types
      const toDesign = selected.filter(s => DESIGN_SERVICES_LIST.includes(s));
      const toConstruct = selected.filter(s => CONSTRUCTION_SERVICES_LIST.includes(s));
      
      // Fetch concurrently to save time
      const [resServices, resProjects] = await Promise.all([
        supabase.from("services").select("title").eq("client_id", clientData.id),
        supabase.from("projects").select("name").eq("client_id", clientData.id)
      ]);
      
      const exServiceNames = resServices.data?.map(s => s.title) || [];
      const exProjectNames = resProjects.data?.map(p => p.name) || [];
      
      const newServices = toDesign.filter(s => !exServiceNames.includes(s)).map(s => ({ title: s, client_id: clientData.id, status: "Active" }));
      const newProjects = toConstruct.filter(p => !exProjectNames.includes(p)).map(p => ({ name: p, client_id: clientData.id, status: "Active" }));
      
      const toDeleteServices = exServiceNames.filter(s => !toDesign.includes(s));
      const toDeleteProjects = exProjectNames.filter(p => !toConstruct.includes(p));

      const promises = [];

      if (newServices.length > 0) promises.push(supabase.from("services").insert(newServices));
      if (newProjects.length > 0) promises.push(supabase.from("projects").insert(newProjects));
      
      if (toDeleteServices.length > 0) promises.push(supabase.from("services").delete().eq("client_id", clientData.id).in("title", toDeleteServices));
      if (toDeleteProjects.length > 0) promises.push(supabase.from("projects").delete().eq("client_id", clientData.id).in("name", toDeleteProjects));

      promises.push(
        supabase.from("clients").update({ 
          leadData: clientData.leadData,
          work_types: finalWorkTypes
        }).eq("id", clientData.id)
      );

      // Run all insertions/deletions and updates concurrently
      await Promise.all(promises);
      
      alert("Service requirements saved successfully!");
    } catch (err) {
      alert("Error saving service requirements: " + err.message);
    }
  };"""

content = content.replace(old_func, new_func)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("ClientDetail fully optimized")
