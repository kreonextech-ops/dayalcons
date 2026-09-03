const fs = require('fs');

// ProjectDetail.jsx
let pCode = fs.readFileSync('src/views/admin/projects/ProjectDetail.jsx', 'utf8');
pCode = pCode.replace(
  '<TabCommunication leadData={{ id: projData.client_id, name: clientName }} isClient={true} action={communicationAction} setAction={setCommunicationAction} />',
  '<TabCommunication leadData={{ id: projData.client_id, name: clientName }} isClient={true} action={communicationAction} setAction={setCommunicationAction} entityType="project" entityId={projData.id} />'
);
pCode = pCode.replace(
  '<TabTimeline leadData={{ id: projData.client_id, name: clientName }} isClient={true} />',
  '<TabTimeline leadData={{ id: projData.client_id, name: clientName }} isClient={true} entityType="project" entityId={projData.id} />'
);
fs.writeFileSync('src/views/admin/projects/ProjectDetail.jsx', pCode);

// ServiceDetail.jsx
let sCode = fs.readFileSync('src/views/admin/services/ServiceDetail.jsx', 'utf8');
sCode = sCode.replace(
  '<TabCommunication leadData={{ id: serviceCase.client_id, name: clientName }} isClient={true} action={communicationAction} setAction={setCommunicationAction} />',
  '<TabCommunication leadData={{ id: serviceCase.client_id, name: clientName }} isClient={true} action={communicationAction} setAction={setCommunicationAction} entityType="service" entityId={serviceCase.id} />'
);
sCode = sCode.replace(
  '<TabTimeline leadData={{ id: serviceCase.client_id, name: clientName }} isClient={true} />',
  '<TabTimeline leadData={{ id: serviceCase.client_id, name: clientName }} isClient={true} entityType="service" entityId={serviceCase.id} />'
);
fs.writeFileSync('src/views/admin/services/ServiceDetail.jsx', sCode);
