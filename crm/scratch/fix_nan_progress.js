const fs = require('fs');

let pCode = fs.readFileSync('src/views/admin/projects/index.jsx', 'utf8');
pCode = pCode.replace(
  /<div className="h-full bg-\[\#2563EB\]" style=\{\{width: `\$\{proj\.calcProgress\}%`\}\}><\/div>/g,
  '<div className="h-full bg-[#2563EB]" style={{width: `${proj.calcProgress || 0}%`}}></div>'
);
pCode = pCode.replace(
  /<span className="text-\[10px\] font-bold text-\[\#64748B\]">\{proj\.calcProgress\}%<\/span>/g,
  '<span className="text-[10px] font-bold text-[#64748B]">{proj.calcProgress || 0}%</span>'
);
fs.writeFileSync('src/views/admin/projects/index.jsx', pCode);

let sCode = fs.readFileSync('src/views/admin/services/index.jsx', 'utf8');
sCode = sCode.replace(
  /<div className="h-full bg-\[\#2563EB\]" style=\{\{width: `\$\{srv\.calcProgress\}%`\}\}><\/div>/g,
  '<div className="h-full bg-[#2563EB]" style={{width: `${srv.calcProgress || 0}%`}}></div>'
);
sCode = sCode.replace(
  /<span className="text-\[10px\] font-bold text-\[\#64748B\]">\{srv\.calcProgress\}%<\/span>/g,
  '<span className="text-[10px] font-bold text-[#64748B]">{srv.calcProgress || 0}%</span>'
);
fs.writeFileSync('src/views/admin/services/index.jsx', sCode);
