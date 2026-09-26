import re

filepath = 'crm/src/views/admin/clients/ClientDetail.jsx'
with open(filepath, 'r', encoding='utf-8') as f: content = f.read()

# Add handleConvertToLead and handleDeleteClientFromDetail right before return
add_funcs = """
  const handleConvertToLead = async () => {
    if (!window.confirm("Are you sure you want to convert this Client back into a Lead?")) return;
    
    // 1. Insert into leads
    const { data: newLeadData, error: insertError } = await supabase.from('leads').insert([{ 
       name: clientData.name, 
       status: 'New', 
       email: clientData.email, 
       phone: clientData.phone, 
       address: clientData.address, 
       company: clientData.company, 
       source: clientData.source, 
       service_type: clientData.work_types, 
       lead_score: clientData.lead_score, 
       budget: clientData.budget, 
       plot_size: clientData.plot_size, 
       timeline: clientData.timeline, 
       lead_temperature: clientData.lead_temperature, 
       notes: clientData.notes, 
       created_at: clientData.created_at || new Date().toISOString()
    }]).select();

    if (insertError) {
      console.error(insertError);
      alert("Failed to convert back to lead.");
      return;
    }
    
    const newId = newLeadData[0].id;
    let whatsapp = clientData.phone;
    if (clientData.notes) {
        let match = clientData.notes.match(/WhatsApp:\s*([0-9]+)/i);
        if (match) whatsapp = match[1];
    }
    
    localStorage.setItem(`lead_${newId}`, JSON.stringify({
       whatsapp: whatsapp,
       email: clientData.email,
       address: clientData.address,
       notes: clientData.notes,
       lead_temperature: clientData.lead_temperature
    }));

    await supabase.from('clients').delete().eq('id', clientData.id);
    onBack({ id: clientData.id, deleted: true });
  };

  const handleDeleteClientFromDetail = async () => {
    if (!window.confirm("Are you sure you want to permanently delete this Client? This action cannot be undone.")) return;
    await supabase.from("clients").delete().eq("id", clientData.id);
    onBack({ id: clientData.id, deleted: true });
  };

  return (
"""
content = content.replace("  return (\n", add_funcs, 1)

# Add buttons under STATUS badge
old_status = "STATUS: {clientData.status.toUpperCase()}\n          </span>\n          <p className=\"mt-3"

new_status = """STATUS: {clientData.status.toUpperCase()}
          </span>
          {isAdmin && (
            <div className="flex gap-2 mt-3">
              <button onClick={handleConvertToLead} className="px-3 py-1.5 bg-yellow-500 text-white rounded-[8px] text-[12px] font-bold shadow hover:bg-yellow-600 transition">Convert back to Lead</button>
              <button onClick={handleDeleteClientFromDetail} className="px-3 py-1.5 bg-red-600 text-white rounded-[8px] text-[12px] font-bold shadow hover:bg-red-700 transition">Delete Client</button>
            </div>
          )}
          <p className="mt-3"""

content = content.replace(old_status, new_status)
with open(filepath, 'w', encoding='utf-8') as f: f.write(content)

# Patch clients/index.jsx onBack
filepath = 'crm/src/views/admin/clients/index.jsx'
with open(filepath, 'r', encoding='utf-8') as f: content = f.read()

old_onBack = 'onBack={(updated) => { if(updated && updated.id){ setClients(clients.map(c => c.id === updated.id ? updated : c)); } setSelectedClient(null); fetchClients(false); }}'
new_onBack = 'onBack={(updated) => { if(updated && updated.id){ if (updated.deleted) { setClients(clients.filter(c => c.id !== updated.id)); } else { setClients(clients.map(c => c.id === updated.id ? updated : c)); } } setSelectedClient(null); fetchClients(false); }}'

content = content.replace(old_onBack, new_onBack)
with open(filepath, 'w', encoding='utf-8') as f: f.write(content)

print("Client to Lead conversion & Delete buttons added")
