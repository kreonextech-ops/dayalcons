import re

filepath = 'crm/src/views/admin/crm/index.jsx'
with open(filepath, 'r', encoding='utf-8') as f: content = f.read()

# Replace handleCreateLead
old_create_lead = """  const handleCreateLead = async (e) => {
    e.preventDefault();
    // Only insert schema-supported columns
      const { data: newLeadData, error } = await supabase.from("leads").insert([{
         name: newLead.name,
         phone: newLead.phone,
         service_type: Array.isArray(newLead.service_type) ? newLead.service_type.join(', ') : newLead.service_type,
         source: newLead.source === "Other" ? (newLead.source_custom || "Other") : newLead.source,
         status: newLead.status,
         ...(newLead.created_at ? { created_at: new Date(newLead.created_at).toISOString() } : {})
      }]).select();

    if (!error && newLeadData && newLeadData.length > 0) {
      // Save unmapped fields to localStorage
      const leadId = newLeadData[0].id;
      localStorage.setItem(`lead_${leadId}`, JSON.stringify({
         whatsapp: newLead.whatsapp,
         email: newLead.email,
         address: newLead.address,
         notes: newLead.notes,
         lead_temperature: newLead.lead_temperature
      }));

      setShowNewLeadModal(false);
      setNewLead({ name: "", phone: "", whatsapp: "", email: "", service_type: [], source: "", address: "", notes: "", status: "New" });
      fetchLeads();
    } else {
      console.error("Error creating lead:", error);
      alert("Failed to create lead. Check console.");
    }
  };"""

new_create_lead = """  const handleCreateLead = async (e) => {
    e.preventDefault();
    
    // OPTIMISTIC UI
    const tempId = `temp-${Date.now()}`;
    const mappedService = Array.isArray(newLead.service_type) ? newLead.service_type.join(', ') : newLead.service_type;
    const mappedSource = newLead.source === "Other" ? (newLead.source_custom || "Other") : newLead.source;
    
    const optimisticLead = {
       id: tempId,
       name: newLead.name,
       phone: newLead.phone,
       service_type: mappedService,
       source: mappedSource,
       status: newLead.status || "New",
       created_at: newLead.created_at ? new Date(newLead.created_at).toISOString() : new Date().toISOString()
    };
    
    localStorage.setItem(`lead_${tempId}`, JSON.stringify({
       whatsapp: newLead.whatsapp,
       email: newLead.email,
       address: newLead.address,
       notes: newLead.notes,
       lead_temperature: newLead.lead_temperature
    }));

    setLeads([optimisticLead, ...leads]);
    setShowNewLeadModal(false);
    setNewLead({ name: "", phone: "", whatsapp: "", email: "", service_type: [], source: "", address: "", notes: "", status: "New" });

    // BACKGROUND SYNC
    const { data: newLeadData, error } = await supabase.from("leads").insert([{
       name: optimisticLead.name,
       phone: optimisticLead.phone,
       service_type: optimisticLead.service_type,
       source: optimisticLead.source,
       status: optimisticLead.status,
       created_at: optimisticLead.created_at
    }]).select();

    if (!error && newLeadData && newLeadData.length > 0) {
      const realId = newLeadData[0].id;
      const savedData = localStorage.getItem(`lead_${tempId}`);
      if (savedData) {
         localStorage.setItem(`lead_${realId}`, savedData);
         localStorage.removeItem(`lead_${tempId}`);
      }
      fetchLeads(false);
    } else {
      console.error("Error creating lead:", error);
      alert("Failed to create lead. Check console.");
      fetchLeads(false);
    }
  };"""

content = content.replace(old_create_lead, new_create_lead)

# Replace handleUpdateStatus
old_update_status = """  const handleUpdateStatus = async () => {
    if (!showStatusModal) return;
    const leadId = showStatusModal.id;
    
    // Update DB
    const { error } = await supabase.from("leads").update({ status: statusUpdateData.status }).eq("id", leadId);
    if (!error) {
       // Also update localStorage with the temperature
       const localData = JSON.parse(localStorage.getItem(`lead_${leadId}`) || "{}");
       localData.lead_temperature = statusUpdateData.lead_temperature;
       localStorage.setItem(`lead_${leadId}`, JSON.stringify(localData));
       
       if (statusUpdateData.status === "Won") {
          const leadToConvert = leads.find(l => l.id === leadId);
          if (leadToConvert) {
             setConvertLeadData(leadToConvert);
          }
       }
       
       setShowStatusModal(null);
       fetchLeads(false);
    }
  };"""

new_update_status = """  const handleUpdateStatus = async () => {
    if (!showStatusModal) return;
    const leadId = showStatusModal.id;
    const newStatus = statusUpdateData.status;
    const newTemp = statusUpdateData.lead_temperature;
    
    setLeads(leads.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
    setShowStatusModal(null);
    
    const { error } = await supabase.from("leads").update({ status: newStatus }).eq("id", leadId);
    if (!error) {
       const localData = JSON.parse(localStorage.getItem(`lead_${leadId}`) || "{}");
       localData.lead_temperature = newTemp;
       localStorage.setItem(`lead_${leadId}`, JSON.stringify(localData));
       
       if (newStatus === "Won") {
          const leadToConvert = leads.find(l => l.id === leadId);
          if (leadToConvert) setConvertLeadData(leadToConvert);
       }
    }
    fetchLeads(false);
  };"""

content = content.replace(old_update_status, new_update_status)

with open(filepath, 'w', encoding='utf-8') as f: f.write(content)
print("Leads index optimistic UI patched")
