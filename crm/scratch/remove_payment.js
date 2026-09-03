const fs = require('fs');

let pCode = fs.readFileSync('src/views/admin/projects/index.jsx', 'utf8');
pCode = pCode.replace(/<th[^>]*>Payment<\/th>/, '');
fs.writeFileSync('src/views/admin/projects/index.jsx', pCode);

let sCode = fs.readFileSync('src/views/admin/services/index.jsx', 'utf8');
sCode = sCode.replace(/<th[^>]*>Payment<\/th>/, '');
fs.writeFileSync('src/views/admin/services/index.jsx', sCode);
