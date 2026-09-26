const fs = require('fs');
const lines = fs.readFileSync('crm/src/views/admin/projects/index.jsx', 'utf8').split('\n');
console.log(lines.slice(240, 300).join('\n'));
