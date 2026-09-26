import os
import re

def clean_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # 1. Remove localStorage.setItem blocks for clients
    # This regex looks for localStorage.setItem(`client_...`, JSON.stringify({...}));
    # We will use simple string replacements for the known blocks since regex across multiple lines can be tricky.

    # Block 1: clients/index.jsx
    block1 = """      if (!error && newClientData && newClientData.length > 0) {
        // Save extra fields to local storage
        const clientId = newClientData[0].id;
        localStorage.setItem(`client_${clientId}`, JSON.stringify({
          phone: newClient.phone,
          email: newClient.email,
          address: newClient.address,
          company: newClient.company,
          gst: newClient.gst
        }));
        
        setNewClient({ name: "", phone: "", email: "", address: "", company: "", gst: "", work_types: [] });"""
    
    replace1 = """      if (!error && newClientData && newClientData.length > 0) {
        setNewClient({ name: "", phone: "", email: "", address: "", company: "", gst: "", work_types: [] });"""
    
    content = content.replace(block1, replace1)

    # Block 2: clients/index.jsx fetchClients merge
    block2 = """      // Merge with localStorage to bypass Supabase schema limits
      const merged = data.map(client => {
         const localData = JSON.parse(localStorage.getItem(`client_${client.id}`) || "{}");
         const clientActivities = activitiesData.filter(a => a.client_id === client.id);
         const lastContact = clientActivities.length > 0 ? clientActivities[0].created_at : null; 
         
         const clientProjects = projectsData.filter(p => p.client_id === client.id);
         const clientServices = servicesData.filter(s => s.client_id === client.id);
         
         // Dynamically generate work_types from actual projects and services
         const activeWorks = [
            ...clientServices.map(s => s.title),
            ...clientProjects.map(p => p.title || p.name)
         ].filter(Boolean);
         
         const finalWorkTypes = activeWorks.length > 0 ? activeWorks.join(', ') : (client.work_types || localData.work_types || "");
         
         const mergedClient = { ...client };
         if (localData.phone && !mergedClient.phone) mergedClient.phone = localData.phone;
         if (localData.email && !mergedClient.email) mergedClient.email = localData.email;
         if (localData.address && !mergedClient.address) mergedClient.address = localData.address;
         if (localData.company && !mergedClient.company) mergedClient.company = localData.company;
         if (localData.gst && !mergedClient.gst) mergedClient.gst = localData.gst;
         
         return { ...mergedClient, lastContact, activeProjectsCount: clientProjects.length, work_types: finalWorkTypes };
      });"""

    replace2 = """      const merged = data.map(client => {
         const clientActivities = activitiesData.filter(a => a.client_id === client.id);
         const lastContact = clientActivities.length > 0 ? clientActivities[0].created_at : null; 
         
         const clientProjects = projectsData.filter(p => p.client_id === client.id);
         const clientServices = servicesData.filter(s => s.client_id === client.id);
         
         const activeWorks = [
            ...clientServices.map(s => s.title),
            ...clientProjects.map(p => p.title || p.name)
         ].filter(Boolean);
         
         const finalWorkTypes = activeWorks.length > 0 ? activeWorks.join(', ') : (client.work_types || "");
         
         return { ...client, lastContact, activeProjectsCount: clientProjects.length, work_types: finalWorkTypes };
      });"""

    content = content.replace(block2, replace2)

    # Block 3: projects/index.jsx & services/index.jsx setItem
    block3 = """       if (!error && newClientData && newClientData.length > 0) {
         finalClientId = newClientData[0].id;
         localStorage.setItem(`client_${finalClientId}`, JSON.stringify({
            phone: newCase.phone,
            whatsapp: newCase.whatsapp,
            email: newCase.email,
            address: newCase.address
         }));
       }"""

    replace3 = """       if (!error && newClientData && newClientData.length > 0) {
         finalClientId = newClientData[0].id;
       }"""

    content = content.replace(block3, replace3)

    # Block 4: projects/index.jsx & services/index.jsx merge
    block4 = """      if (!error && data) {
        const merged = data.map(client => {
           const localData = JSON.parse(localStorage.getItem(`client_${client.id}`) || "{}");
           const mergedClient = { ...client };
           if (localData.phone && !mergedClient.phone) mergedClient.phone = localData.phone;
           if (localData.email && !mergedClient.email) mergedClient.email = localData.email;
           if (localData.address && !mergedClient.address) mergedClient.address = localData.address;
           if (localData.company && !mergedClient.company) mergedClient.company = localData.company;
           return mergedClient;
        });
        setAllClients(merged);"""
    
    replace4 = """      if (!error && data) {
        setAllClients(data);"""

    content = content.replace(block4, replace4)

    # Block 5: crm/index.jsx convert
    block5 = """    if (!insertError && newClientData && newClientData.length > 0) {
       const clientId = newClientData[0].id;
       localStorage.setItem(`client_${clientId}`, JSON.stringify({
          phone: convertLeadData.phone, email: convertLeadData.email, address: convertLeadData.address, company: convertLeadData.name, leadData: convertLeadData
       }));
       await supabase.from('leads').delete().eq('id', convertLeadData.id);"""
       
    replace5 = """    if (!insertError && newClientData && newClientData.length > 0) {
       await supabase.from('leads').delete().eq('id', convertLeadData.id);"""
       
    content = content.replace(block5, replace5)
    
    # Block 6: crm/LeadDetail.jsx convert
    block6 = """      if (!insertError && newClientData && newClientData.length > 0) {
         const clientId = newClientData[0].id;
         localStorage.setItem(`client_${clientId}`, JSON.stringify({
            phone: leadData.phone, email: leadData.email, address: leadData.address, company: leadData.name, leadData: leadData
         }));
         
         await supabase.from('leads').delete().eq('id', leadData.id);"""
         
    replace6 = """      if (!insertError && newClientData && newClientData.length > 0) {
         await supabase.from('clients').update({ leadData: leadData }).eq('id', newClientData[0].id);
         await supabase.from('leads').delete().eq('id', leadData.id);"""
         
    content = content.replace(block6, replace6)
    
    # Block 7: ClientDetail.jsx save
    block7 = """      // Optimistic update for UI speed
      const local = JSON.parse(localStorage.getItem(`client_${clientData.id}`) || "{}");
      local.work_types = finalWorkTypes;
      local.leadData = clientData.leadData;
      localStorage.setItem(`client_${clientData.id}`, JSON.stringify(local));"""
      
    replace7 = """      // Optimistic update for UI speed"""
    
    content = content.replace(block7, replace7)

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Purged localStorage from {filepath}")

for root, _, files in os.walk("crm/src"):
    for file in files:
        if file.endswith(".jsx"):
            clean_file(os.path.join(root, file))
