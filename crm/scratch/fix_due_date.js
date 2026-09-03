const fs = require('fs');

let code = fs.readFileSync('src/views/admin/projects/ProjectDetail.jsx', 'utf8');
code = code.replace(
  '{new Date(nextTask.due_date).toLocaleString()}',
  '{nextTask.due_date ? new Date(nextTask.due_date).toLocaleString() : "No Due Date"}'
);

// We should also make sure it only fetches project tasks!
code = code.replace(
  /const fetchNextTask = async \(\) => \{[\s\S]*?limit\(1\);/g,
  `const fetchNextTask = async () => {
    if (!projData?.client_id) return;
    const { data } = await supabase.from('tasks').select('*').eq('client_id', projData.client_id).eq('project_id', projData.id).neq('status', 'Completed').order('due_date', { ascending: true }).limit(1);`
);

fs.writeFileSync('src/views/admin/projects/ProjectDetail.jsx', code);


let code2 = fs.readFileSync('src/views/admin/services/ServiceDetail.jsx', 'utf8');
code2 = code2.replace(
  '{new Date(nextTask.due_date).toLocaleString()}',
  '{nextTask.due_date ? new Date(nextTask.due_date).toLocaleString() : "No Due Date"}'
);

code2 = code2.replace(
  /const fetchNextTask = async \(\) => \{[\s\S]*?limit\(1\);/g,
  `const fetchNextTask = async () => {
    if (!serviceCase?.client_id) return;
    const { data } = await supabase.from('tasks').select('*').eq('client_id', serviceCase.client_id).eq('service_id', serviceCase.id).neq('status', 'Completed').order('due_date', { ascending: true }).limit(1);`
);

fs.writeFileSync('src/views/admin/services/ServiceDetail.jsx', code2);
