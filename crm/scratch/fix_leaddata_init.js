const fs = require('fs');
let code = fs.readFileSync('src/views/admin/crm/LeadDetail.jsx', 'utf8');

code = code.replace(
  'service_type: lead?.service_type || "",',
  'service_type: lead?.service_type || "",\n    lead_temperature: lead?.lead_temperature || "",\n    assigned_to: lead?.assigned_to || "",\n    notes: lead?.notes || "",'
);

fs.writeFileSync('src/views/admin/crm/LeadDetail.jsx', code);
