filepath = 'crm/src/views/admin/clients/index.jsx'
with open(filepath, 'r', encoding='utf-8') as f: content = f.read()

old_delete = """  const handleDeleteClient = async (id) => {
    const { error } = await supabase.from("clients").delete().eq("id", id);
    if (!error) {
      setShowDeleteModal(null);
      fetchClients();
    }
  };"""

new_delete = """  const handleDeleteClient = async (id) => {
    setShowDeleteModal(null);
    setClients(clients.filter(c => c.id !== id));
    
    await supabase.from("clients").delete().eq("id", id);
    fetchClients(false);
  };"""

if old_delete in content:
    content = content.replace(old_delete, new_delete)
    with open(filepath, 'w', encoding='utf-8') as f: f.write(content)
    print('Client delete patched')
else:
    print('Failed')
