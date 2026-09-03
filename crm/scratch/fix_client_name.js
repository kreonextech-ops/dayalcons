const fs = require('fs');
let code = fs.readFileSync('src/views/admin/tasks/TaskDetail.jsx', 'utf8');

code = code.replace(
   /await supabase\.from\('clients'\)\.select\('id, name, clientName'\)/g,
   "await supabase.from('clients').select('id, name')"
);

code = code.replace(
   /data\.name \|\| data\.clientName/g,
   "data.name"
);

fs.writeFileSync('src/views/admin/tasks/TaskDetail.jsx', code);
