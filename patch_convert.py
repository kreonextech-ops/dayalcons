import re

# PATCH LEAD DETAIL
filepath = 'crm/src/views/admin/crm/LeadDetail.jsx'
with open(filepath, 'r', encoding='utf-8') as f: content = f.read()

# Fix handleConvertToClient
old_convert = """    const { data: newClientData, error: insertError } = await supabase.from('clients').insert([{ name: leadData.name, status: 'active', email: leadData.email, phone: leadData.phone, address: leadData.address, company: leadData.company || leadData.name, source: leadData.source , service_type: leadData.service_type, lead_score: leadData.lead_score, budget: leadData.budget, plot_size: leadData.plot_size, timeline: leadData.timeline, lead_temperature: leadData.lead_temperature, notes: leadData.notes, created_at: leadData.created_at }]).select();"""

new_convert = """    let finalNotes = leadData.notes || "";
    if (leadData.whatsapp) finalNotes = `WhatsApp: ${leadData.whatsapp}\n${finalNotes}`;
    
    const { data: newClientData, error: insertError } = await supabase.from('clients').insert([{ 
       name: leadData.name, 
       status: 'active', 
       email: leadData.email, 
       phone: leadData.phone, 
       address: leadData.address, 
       company: leadData.company || leadData.name, 
       source: leadData.source, 
       service_type: leadData.service_type, 
       work_types: leadData.service_type, 
       lead_score: leadData.lead_score, 
       budget: leadData.budget, 
       plot_size: leadData.plot_size, 
       timeline: leadData.timeline, 
       lead_temperature: leadData.lead_temperature, 
       notes: finalNotes, 
       created_at: leadData.created_at 
    }]).select();"""

content = content.replace(old_convert, new_convert)
with open(filepath, 'w', encoding='utf-8') as f: f.write(content)

# PATCH CRM INDEX
filepath = 'crm/src/views/admin/crm/index.jsx'
with open(filepath, 'r', encoding='utf-8') as f: content = f.read()

old_convert_idx = """const { data: newClientData, error: insertError } = await supabase.from('clients').insert([{ name: convertLeadData.name, status: 'active', email: convertLeadData.email, phone: convertLeadData.phone, address: convertLeadData.address, company: convertLeadData.company || convertLeadData.name , source: convertLeadData.source, service_type: convertLeadData.service_type, lead_score: convertLeadData.lead_score, budget: convertLeadData.budget, plot_size: convertLeadData.plot_size, timeline: convertLeadData.timeline, lead_temperature: convertLeadData.lead_temperature, notes: convertLeadData.notes }]).select();"""

new_convert_idx = """
    let finalNotes = convertLeadData.notes || "";
    if (convertLeadData.whatsapp) finalNotes = `WhatsApp: ${convertLeadData.whatsapp}\n${finalNotes}`;
    
    const { data: newClientData, error: insertError } = await supabase.from('clients').insert([{ 
       name: convertLeadData.name, 
       status: 'active', 
       email: convertLeadData.email, 
       phone: convertLeadData.phone, 
       address: convertLeadData.address, 
       company: convertLeadData.company || convertLeadData.name, 
       source: convertLeadData.source, 
       service_type: convertLeadData.service_type, 
       work_types: convertLeadData.service_type,
       lead_score: convertLeadData.lead_score, 
       budget: convertLeadData.budget, 
       plot_size: convertLeadData.plot_size, 
       timeline: convertLeadData.timeline, 
       lead_temperature: convertLeadData.lead_temperature, 
       notes: finalNotes 
    }]).select();"""

if old_convert_idx in content:
    content = content.replace(old_convert_idx, new_convert_idx)
    with open(filepath, 'w', encoding='utf-8') as f: f.write(content)
else:
    print("Could not find old_convert_idx")

print("Conversion logic patched")
