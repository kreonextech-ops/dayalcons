const fs = require('fs');
let code = fs.readFileSync('src/views/admin/services/ServiceDetail.jsx', 'utf8');
code = code.replace(
  '<TabTasks leadData={{ id: serviceCase.client_id, name: clientName }} isClient={true} />',
  '<TabTasks leadData={{ id: serviceCase.client_id, name: clientName }} isClient={true} entityType="service" entityId={serviceCase.id} />'
);
fs.writeFileSync('src/views/admin/services/ServiceDetail.jsx', code);
