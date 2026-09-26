const fs = require('fs');
const lines = fs.readFileSync('crm/src/views/admin/services/index.jsx', 'utf8').split('\n');
console.log(lines.slice(280, 360).join('\n'));
