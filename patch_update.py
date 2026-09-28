with open('crm/src/views/admin/crm/LeadDetail.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

old_save = """  const handleSaveClientInfo = async () => {
    setIsEditingClient(false);
    await supabase.from("leads").update({
       name: leadData.name,
       phone: leadData.phone,
       email: leadData.email,
       address: leadData.address,
       source: leadData.source,
       created_at: leadData.created_at
    }).eq("id", leadData.id);
  };"""

new_save = """  const handleSaveClientInfo = async () => {
    setIsEditingClient(false);
    const { error } = await supabase.from("leads").update({
       name: leadData.name,
       phone: leadData.phone,
       email: leadData.email,
       address: leadData.address,
       source: leadData.source,
       created_at: leadData.created_at
    }).eq("id", leadData.id);
    if (error) {
       alert("Failed to save changes: " + error.message);
    }
  };"""

c = c.replace(old_save, new_save)

with open('crm/src/views/admin/crm/LeadDetail.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
