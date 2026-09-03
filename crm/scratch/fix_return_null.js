const fs = require('fs');
let code = fs.readFileSync('src/views/admin/projects/ProjectDetail.jsx', 'utf8');
code = code.replace('  if (!projData) return null;\n', '');
code = code.replace('  return (\n    <div className="flex flex-col gap-6">', '  if (!projData) return null;\n  return (\n    <div className="flex flex-col gap-6">');
fs.writeFileSync('src/views/admin/projects/ProjectDetail.jsx', code);
