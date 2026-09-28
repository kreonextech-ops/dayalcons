with open('crm/src/views/admin/clients/ClientDetail.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

old_save = """  const handleSaveClientInfo = async () => {
    setIsEditingClient(false);
    if (clientData.id) {
       await supabase.from("clients").update({
          company: clientData.company,
          name: clientData.name,
          phone: clientData.phone,
          email: clientData.email,
          address: clientData.address,
          source: clientData.source,
          created_at: clientData.created_at
       }).eq("id", clientData.id);
    }
  };"""

new_save = """  const handleSaveClientInfo = async () => {
    setIsEditingClient(false);
    if (clientData.id) {
       const { error } = await supabase.from("clients").update({
          company: clientData.company,
          name: clientData.name,
          phone: clientData.phone,
          email: clientData.email,
          address: clientData.address,
          source: clientData.source,
          created_at: clientData.created_at
       }).eq("id", clientData.id);
       if (error) {
          alert("Failed to save changes: " + error.message);
       }
    }
  };"""

c = c.replace(old_save, new_save)

with open('crm/src/views/admin/clients/ClientDetail.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
