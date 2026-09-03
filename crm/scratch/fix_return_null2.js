const fs = require('fs');
let code = fs.readFileSync('src/views/admin/projects/ProjectDetail.jsx', 'utf8');
code = code.replace('  if (!projData) return null;\n', ''); // remove old if exists
code = code.replace('  return (\n    <div className="relative min-h-screen bg-[#F8FAFC]', '  if (!projData) return null;\n  return (\n    <div className="relative min-h-screen bg-[#F8FAFC]');
fs.writeFileSync('src/views/admin/projects/ProjectDetail.jsx', code);
