import re

filepath = 'crm/src/views/admin/clients/index.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix handleCreateClient
old_insert = """    const { data: newClientData, error } = await supabase.from("clients").insert([{
      name: newClient.name,
        status: 'active',
        work_types: Array.isArray(newClient.work_types) ? newClient.work_types.join(', ') : newClient.work_types,
        ...(newClient.created_at ? { created_at: new Date(newClient.created_at).toISOString() } : {})
      }]).select();"""

new_insert = """    const { data: newClientData, error } = await supabase.from("clients").insert([{
      name: newClient.name,
      status: 'active',
      phone: newClient.phone || null,
      email: newClient.email || null,
      address: newClient.address || null,
      company: newClient.company || null,
      notes: newClient.gst ? `GST: ${newClient.gst}` : null,
      work_types: Array.isArray(newClient.work_types) ? newClient.work_types.join(', ') : newClient.work_types,
      ...(newClient.created_at ? { created_at: new Date(newClient.created_at).toISOString() } : {})
    }]).select();"""

if old_insert in content:
    content = content.replace(old_insert, new_insert)
    print("Patched handleCreateClient in clients/index.jsx")
else:
    print("old_insert not found in clients/index.jsx")

# Fix fetchClients merge
old_merge = """         const finalWorkTypes = activeWorks.length > 0 ? activeWorks.join(', ') : (client.work_types || localData.work_types || "");
         
         return { ...client, ...localData, lastContact, activeProjectsCount: clientProjects.length, work_types: finalWorkTypes };"""

new_merge = """         const finalWorkTypes = activeWorks.length > 0 ? activeWorks.join(', ') : (client.work_types || localData.work_types || "");
         
         const mergedClient = { ...client };
         if (localData.phone && !mergedClient.phone) mergedClient.phone = localData.phone;
         if (localData.email && !mergedClient.email) mergedClient.email = localData.email;
         if (localData.address && !mergedClient.address) mergedClient.address = localData.address;
         if (localData.company && !mergedClient.company) mergedClient.company = localData.company;
         if (localData.gst && !mergedClient.gst) mergedClient.gst = localData.gst;
         
         return { ...mergedClient, lastContact, activeProjectsCount: clientProjects.length, work_types: finalWorkTypes };"""

if old_merge in content:
    content = content.replace(old_merge, new_merge)
    print("Patched fetchClients in clients/index.jsx")
else:
    print("old_merge not found in clients/index.jsx")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
