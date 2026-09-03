const fs = require('fs');
let code = fs.readFileSync('src/views/admin/crm/components/TabTasks.jsx', 'utf8');

code = code.replace(
  'const TabTasks = ({ leadData, isClient }) => {',
  'const TabTasks = ({ leadData, isClient, entityType, entityId }) => {'
);

const fetchTasksRegex = /const fetchTasks = async \(\) => \{\s*setLoading\(true\);\s*const \{ data \} = await supabase\.from\('tasks'\)\.select\('\*'\)\.eq\(isClient \? 'client_id' : 'lead_id', leadData\.id\)\.order\('created_at', \{ ascending: false \}\);\s*if \(data\) setTasks\(data\);\s*setLoading\(false\);\s*\};/;

const newFetchTasks = `const fetchTasks = async () => {
    setLoading(true);
    let query = supabase.from('tasks').select('*');
    if (entityType === 'service' && entityId) { query = query.eq('service_id', entityId); }
    else if (entityType === 'project' && entityId) { query = query.eq('project_id', entityId); }
    else { query = query.eq(isClient ? 'client_id' : 'lead_id', leadData.id); }
    
    const { data } = await query.order('created_at', { ascending: false });
    if (data) setTasks(data);
    setLoading(false);
  };`;

code = code.replace(fetchTasksRegex, newFetchTasks);

const insertRegex = /const \{ error \} = await supabase\.from\('tasks'\)\.insert\(\[\{\s*name,\s*due_date: due_date \|\| null,\s*priority,\s*status,\s*assignee_id: assignee_id \|\| null,\s*lead_id: isClient \? null : leadData\.id,\s*client_id: isClient \? leadData\.id : null,\s*creator_id: loggedInUser\?\.id,\s*category: 'General'\s*\}\]\);/;

const newInsert = `const { error } = await supabase.from('tasks').insert([{
      name,
      due_date: due_date || null,
      priority,
      status,
      assignee_id: assignee_id || null,
      lead_id: isClient ? null : leadData.id,
      client_id: isClient ? leadData.id : null,
      service_id: entityType === 'service' ? entityId : null,
      project_id: entityType === 'project' ? entityId : null,
      creator_id: loggedInUser?.id,
      category: 'General'
    }]);`;

code = code.replace(insertRegex, newInsert);

fs.writeFileSync('src/views/admin/crm/components/TabTasks.jsx', code);
