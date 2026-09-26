filepath = 'crm/src/views/admin/crm/index.jsx'
with open(filepath, 'r', encoding='utf-8') as f: content = f.read()

old_delete = """  const handleDeleteLead = async (id) => {
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (!error) {
      setShowDeleteModal(null);
      localStorage.removeItem(`lead_${id}`);
      fetchLeads();
    }
  };"""

new_delete = """  const handleDeleteLead = async (id) => {
    // Optimistic UI
    setShowDeleteModal(null);
    setLeads(leads.filter(l => l.id !== id));
    localStorage.removeItem(`lead_${id}`);
    
    // Background Sync
    await supabase.from("leads").delete().eq("id", id);
    fetchLeads(false);
  };"""

content = content.replace(old_delete, new_delete)
with open(filepath, 'w', encoding='utf-8') as f: f.write(content)

filepath = 'crm/src/views/admin/clients/index.jsx'
with open(filepath, 'r', encoding='utf-8') as f: content = f.read()

old_delete_c = """  const handleDeleteClient = async (id) => {
    const { error } = await supabase.from("clients").delete().eq("id", id);
    if (!error) {
      setShowDeleteModal(null);
      localStorage.removeItem(`client_${id}`);
      fetchClients();
    }
  };"""

new_delete_c = """  const handleDeleteClient = async (id) => {
    setShowDeleteModal(null);
    setClients(clients.filter(c => c.id !== id));
    localStorage.removeItem(`client_${id}`);
    
    await supabase.from("clients").delete().eq("id", id);
    fetchClients(false);
  };"""

if old_delete_c in content:
    content = content.replace(old_delete_c, new_delete_c)
    with open(filepath, 'w', encoding='utf-8') as f: f.write(content)
else:
    print("Could not find old_delete_c")

print("Delete patched")
