import re

filepath = 'crm/src/views/admin/crm/index.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

old_insert = """    const { data: newClientData, error: insertError } = await supabase.from('clients').insert([{
       name: convertLeadData.name, 
       status: 'active', 
       source: convertLeadData.source, 
       service_type: convertLeadData.service_type, 
       budget: convertLeadData.budget, 
       plot_size: convertLeadData.plot_size, 
       lead_score: convertLeadData.lead_score, 
       timeline: convertLeadData.timeline, 
       lead_temperature: convertLeadData.lead_temperature, 
       notes: finalNotes 
    }]).select();"""

new_insert = """    const { data: newClientData, error: insertError } = await supabase.from('clients').insert([{
       name: convertLeadData.name, 
       status: 'active', 
       source: convertLeadData.source, 
       service_type: convertLeadData.service_type, 
       budget: convertLeadData.budget, 
       plot_size: convertLeadData.plot_size, 
       lead_score: convertLeadData.lead_score, 
       timeline: convertLeadData.timeline, 
       lead_temperature: convertLeadData.lead_temperature, 
       notes: finalNotes,
       phone: convertLeadData.phone || null,
       email: convertLeadData.email || null,
       address: convertLeadData.address || null
    }]).select();"""

if old_insert in content:
    content = content.replace(old_insert, new_insert)
    print("Patched confirmConvert in crm/index.jsx")
else:
    print("old_insert not found in crm/index.jsx")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
