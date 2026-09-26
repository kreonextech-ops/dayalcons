const fs = require('fs');
const lines = fs.readFileSync('crm/src/views/admin/services/index.jsx', 'utf8').split('\n');
console.log(lines.slice(220, 270).join('\n'));
