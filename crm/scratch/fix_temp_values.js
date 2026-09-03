const fs = require('fs');
let code = fs.readFileSync('src/views/admin/crm/LeadDetail.jsx', 'utf8');

code = code.replace(/value=\{leadData\.lead_temperature \|\| 'Warm Lead'\}/g, "value={leadData.lead_temperature || 'Warm'}");
code = code.replace(/leadData\.lead_temperature === 'Hot Lead'/g, "leadData.lead_temperature === 'Hot'");
code = code.replace(/leadData\.lead_temperature === 'Cold Lead'/g, "leadData.lead_temperature === 'Cold'");
code = code.replace(/value="Hot Lead"/g, 'value="Hot"');
code = code.replace(/value="Warm Lead"/g, 'value="Warm"');
code = code.replace(/value="Cold Lead"/g, 'value="Cold"');

fs.writeFileSync('src/views/admin/crm/LeadDetail.jsx', code);
