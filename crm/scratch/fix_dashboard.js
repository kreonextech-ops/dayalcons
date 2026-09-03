const fs = require('fs');
let code = fs.readFileSync('src/views/admin/default/index.jsx', 'utf8');

code = code.replace(
   /\{new Date\(project\.created_at\)\.toLocaleDateString\(\)\}/g,
   "{project.created_at ? new Date(project.created_at).toLocaleDateString() : ''}"
);

fs.writeFileSync('src/views/admin/default/index.jsx', code);
