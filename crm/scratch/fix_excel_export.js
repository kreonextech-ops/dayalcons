const fs = require('fs');
let code = fs.readFileSync('src/views/admin/crm/index.jsx', 'utf8');

code = code.replace(
   /"LEAD ARRIVING DATE": new Date\(l\.created_at\)\.toLocaleDateString\(\),/g,
   '"LEAD ARRIVING DATE": l.created_at ? new Date(l.created_at).toLocaleDateString() : "",'
);

fs.writeFileSync('src/views/admin/crm/index.jsx', code);
