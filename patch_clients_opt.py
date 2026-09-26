filepath = 'crm/src/views/admin/clients/index.jsx'
with open(filepath, 'r', encoding='utf-8') as f: content = f.read()

old_create_client = """  const handleCreateClient = async (e) => {
    e.preventDefault();
    const { data: newClientData, error } = await supabase.from("clients").insert([{
      name: newClient.name,
        status: 'active',
        work_types: Array.isArray(newClient.work_types) ? newClient.work_types.join(', ') : newClient.work_types,
        ...(newClient.created_at ? { created_at: new Date(newClient.created_at).toISOString() } : {})
      }]).select();
    
    if (!error && newClientData && newClientData.length > 0) {
      // Save extra fields to local storage
      const clientId = newClientData[0].id;
      localStorage.setItem(`client_${clientId}`, JSON.stringify({
         phone: newClient.phone,
         email: newClient.email,
         address: newClient.address,
         company: newClient.company,
         gst: newClient.gst
      }));

      setShowNewClientModal(false);
      setNewClient({ name: "", phone: "", email: "", address: "", company: "", gst: "", status: "active", work_types: [] });
      fetchClients();
    } else {
      console.error("Error creating client:", error);
      alert("Failed to create client. Check console.");
    }
  };"""

new_create_client = """  const handleCreateClient = async (e) => {
    e.preventDefault();
    
    // OPTIMISTIC UI
    const tempId = `temp-${Date.now()}`;
    const optimisticClient = {
      id: tempId,
      name: newClient.name,
      status: 'active',
      work_types: Array.isArray(newClient.work_types) ? newClient.work_types.join(', ') : newClient.work_types,
      created_at: newClient.created_at ? new Date(newClient.created_at).toISOString() : new Date().toISOString()
    };
    
    localStorage.setItem(`client_${tempId}`, JSON.stringify({
       phone: newClient.phone,
       email: newClient.email,
       address: newClient.address,
       company: newClient.company,
       gst: newClient.gst
    }));

    setClients([optimisticClient, ...clients]);
    setShowNewClientModal(false);
    setNewClient({ name: "", phone: "", email: "", address: "", company: "", gst: "", status: "active", work_types: [] });

    // BACKGROUND SYNC
    const { data: newClientData, error } = await supabase.from("clients").insert([{
      name: optimisticClient.name,
      status: 'active',
      work_types: optimisticClient.work_types,
      created_at: optimisticClient.created_at
    }]).select();
    
    if (!error && newClientData && newClientData.length > 0) {
      const realId = newClientData[0].id;
      const savedData = localStorage.getItem(`client_${tempId}`);
      if (savedData) {
         localStorage.setItem(`client_${realId}`, savedData);
         localStorage.removeItem(`client_${tempId}`);
      }
      fetchClients(false);
    } else {
      console.error("Error creating client:", error);
      alert("Failed to create client. Check console.");
      fetchClients(false);
    }
  };"""

content = content.replace(old_create_client, new_create_client)
with open(filepath, 'w', encoding='utf-8') as f: f.write(content)
print("Clients index optimistic UI patched")
