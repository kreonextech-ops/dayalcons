const fs = require('fs');
let code = fs.readFileSync('src/views/admin/crm/index.jsx', 'utf8');

code = code.replace(
  /\{lead\.assigned_to \|\| "Unassigned"\}/g,
  '{lead.assigned_to ? (lead.assigned_to.includes("-") ? `EMP-${lead.assigned_to.substring(0, 5).toUpperCase()}` : lead.assigned_to) : "Unassigned"}'
);

fs.writeFileSync('src/views/admin/crm/index.jsx', code);
