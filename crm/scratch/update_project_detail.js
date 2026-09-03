const fs = require('fs');
let code = fs.readFileSync('src/views/admin/projects/ProjectDetail.jsx', 'utf8');
code = code.replace(
  '<TabTasks leadData={{ id: projData.client_id, name: clientName }} isClient={true} />',
  '<TabTasks leadData={{ id: projData.client_id, name: clientName }} isClient={true} entityType="project" entityId={projData.id} />'
);
fs.writeFileSync('src/views/admin/projects/ProjectDetail.jsx', code);
