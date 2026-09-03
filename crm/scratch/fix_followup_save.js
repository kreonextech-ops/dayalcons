const fs = require('fs');

let code = fs.readFileSync('src/views/admin/projects/ProjectDetail.jsx', 'utf8');
code = code.replace(
  "client_id: projData.client_id,",
  "client_id: projData.client_id,\n                  project_id: projData.id,"
);
fs.writeFileSync('src/views/admin/projects/ProjectDetail.jsx', code);

let code2 = fs.readFileSync('src/views/admin/services/ServiceDetail.jsx', 'utf8');
code2 = code2.replace(
  "client_id: serviceCase.client_id,",
  "client_id: serviceCase.client_id,\n                  service_id: serviceCase.id,"
);
fs.writeFileSync('src/views/admin/services/ServiceDetail.jsx', code2);
