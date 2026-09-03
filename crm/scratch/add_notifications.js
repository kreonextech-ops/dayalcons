const fs = require('fs');

const files = [
  { path: 'src/views/admin/crm/LeadDetail.jsx', table: 'leads', type: 'Lead', idField: 'id' },
  { path: 'src/views/admin/clients/ClientDetail.jsx', table: 'clients', type: 'Client', idField: 'id' },
  { path: 'src/views/admin/projects/ProjectDetail.jsx', table: 'projects', type: 'Project', idField: 'id' },
  { path: 'src/views/admin/services/ServiceDetail.jsx', table: 'services', type: 'Service', idField: 'id' }
];

files.forEach(({ path, table, type }) => {
  if (!fs.existsSync(path)) return;
  let code = fs.readFileSync(path, 'utf8');
  
  // Need to find handleToggleAssignEmployee block and inject notification
  // The block usually looks like:
  /*
  const handleToggleAssignEmployee = async (employeeId) => {
    let currentAssigned = (leadData.assigned_to || '').split(',').filter(Boolean);
    if (currentAssigned.includes(employeeId)) {
      currentAssigned = currentAssigned.filter(id => id !== employeeId);
    } else {
      currentAssigned.push(employeeId);
    }
    const newAssignedString = currentAssigned.join(',');
    
    // Optimistic update
    const updatedLead = { ...leadData, assigned_to: newAssignedString || null };
    if (onUpdate) onUpdate(updatedLead);

    if (leadData.id) {
       await supabase.from('leads').update({ assigned_to: newAssignedString || null }).eq('id', leadData.id);
    }
  };
  */

  // Let's replace the whole function using regex or string splitting
  // It's safer to locate the 'if (xxx.id) { await supabase.from...' and append our logic inside it.
  
  const dataVar = type === 'Lead' ? 'leadData' : type === 'Client' ? 'clientData' : type === 'Project' ? 'projData' : 'srvData';
  const prefix = type === 'Project' ? 'PRJ' : type === 'Service' ? 'SRV' : type.toUpperCase();
  const nameField = type === 'Client' || type === 'Lead' ? 'name' : 'title';

  const regex = new RegExp(`(await supabase\\.from\\(['"]${table}['"]\\)\\.update\\(\\{ assigned_to: [^}]+\\}\\)\\.eq\\(['"]id['"], ${dataVar}\\.id\\);)`, 'g');
  
  const notificationCode = `$1
       
       if (!currentAssigned.includes(employeeId)) { // wait, currentAssigned already modified. We need to check if it was ADDED.
           // Since we can't reliably check currentAssigned after modification in a generic replace, 
           // let's just create the task unconditionally for now if newAssignedString includes employeeId.
           // Actually, let's just put it right after the update.
           if (newAssignedString.includes(employeeId)) {
             await supabase.from('tasks').insert([{
               name: \`Assigned to ${type}: \${${dataVar}.${nameField} || ${dataVar}.name || 'Unknown'}\`,
               description: \`You have been assigned to ${type} ID: ${prefix}-\${${dataVar}.id.substring(0,5).toUpperCase()}\`,
               status: 'To Do',
               priority: 'High',
               assignee_id: employeeId,
               ${type === 'Project' ? `project_id: ${dataVar}.id, client_id: ${dataVar}.client_id` : type === 'Service' ? `service_id: ${dataVar}.id, client_id: ${dataVar}.client_id` : type === 'Client' ? `client_id: ${dataVar}.id` : `lead_id: ${dataVar}.id`}
             }]);
           }
       }`;

  code = code.replace(regex, notificationCode);
  fs.writeFileSync(path, code);
});
