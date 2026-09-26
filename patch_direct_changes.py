import re

filepath = 'crm/src/views/admin/crm/index.jsx'
with open(filepath, 'r', encoding='utf-8') as f: content = f.read()

# handleDirectStatusChange
old_ds = """  const handleDirectStatusChange = async (leadId, newStatus) => {
    const { error } = await supabase.from("leads").update({ status: newStatus }).eq("id", leadId);
    if (!error) {
       if (newStatus === "Won") {
          const leadToConvert = leads.find(l => l.id === leadId);
          if (leadToConvert) setConvertLeadData(leadToConvert);
       }
       fetchLeads(false);
    }
  };"""

new_ds = """  const handleDirectStatusChange = async (leadId, newStatus) => {
    // Optimistic UI
    setLeads(leads.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
    
    const { error } = await supabase.from("leads").update({ status: newStatus }).eq("id", leadId);
    if (!error) {
       if (newStatus === "Won") {
          const leadToConvert = leads.find(l => l.id === leadId);
          if (leadToConvert) setConvertLeadData(leadToConvert);
       }
       fetchLeads(false);
    } else {
       fetchLeads(false);
    }
  };"""
content = content.replace(old_ds, new_ds)

# handleDirectTempChange
old_dt = """  const handleDirectTempChange = async (leadId, newTemp) => {
    const localData = JSON.parse(localStorage.getItem(`lead_${leadId}`) || "{}");
    localData.lead_temperature = newTemp;
    localStorage.setItem(`lead_${leadId}`, JSON.stringify(localData));
    fetchLeads(false); // trigger re-render
  };"""

new_dt = """  const handleDirectTempChange = async (leadId, newTemp) => {
    const localData = JSON.parse(localStorage.getItem(`lead_${leadId}`) || "{}");
    localData.lead_temperature = newTemp;
    localStorage.setItem(`lead_${leadId}`, JSON.stringify(localData));
    
    // Force re-render of just the list natively
    setLeads([...leads]);
    // fetchLeads(false) is too slow for UI response
  };"""
content = content.replace(old_dt, new_dt)

# Patch onBack in index.jsx
content = content.replace('onBack={() => { setSelectedLead(null); fetchLeads(false); }}', 'onBack={(updated) => { if(updated && updated.id){ setLeads(leads.map(l => l.id === updated.id ? updated : l)); } setSelectedLead(null); fetchLeads(false); }}')

with open(filepath, 'w', encoding='utf-8') as f: f.write(content)

# Patch onBack in clients index.jsx
filepath = 'crm/src/views/admin/clients/index.jsx'
with open(filepath, 'r', encoding='utf-8') as f: content = f.read()
content = content.replace('onBack={() => { setSelectedClient(null); fetchClients(false); }}', 'onBack={(updated) => { if(updated && updated.id){ setClients(clients.map(c => c.id === updated.id ? updated : c)); } setSelectedClient(null); fetchClients(false); }}')
with open(filepath, 'w', encoding='utf-8') as f: f.write(content)

# Patch LeadDetail onClick={onBack}
filepath = 'crm/src/views/admin/crm/LeadDetail.jsx'
with open(filepath, 'r', encoding='utf-8') as f: content = f.read()
content = content.replace('onClick={onBack}', 'onClick={() => onBack(leadData)}')
with open(filepath, 'w', encoding='utf-8') as f: f.write(content)

# Patch ClientDetail onClick={onBack}
filepath = 'crm/src/views/admin/clients/ClientDetail.jsx'
with open(filepath, 'r', encoding='utf-8') as f: content = f.read()
content = content.replace('onClick={onBack}', 'onClick={() => onBack(clientData)}')
with open(filepath, 'w', encoding='utf-8') as f: f.write(content)

print("Optimistic patches applied")
