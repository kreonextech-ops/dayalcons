const fs = require('fs');

function computeProgressStr() {
    return `
                     let prog = 0;
                     try {
                        const meta = JSON.parse(srv.description || "{}");
                        if (meta.steps && meta.steps.length > 0) {
                           const comp = meta.steps.filter(s => s.completed).length;
                           prog = Math.round((comp / meta.steps.length) * 100);
                        }
                     } catch(e) {}
    `;
}

// 1. services/index.jsx
let sCode = fs.readFileSync('src/views/admin/services/index.jsx', 'utf8');

// Add more states
sCode = sCode.replace(
  'const [filterType, setFilterType] = useState("");',
  'const [filterType, setFilterType] = useState("");\n  const [filterStatus, setFilterStatus] = useState("");\n  const [filterProg, setFilterProg] = useState("");\n  const [sortOrder, setSortOrder] = useState("");'
);

// Add the other select dropdowns next to filterType
const newSelectS = `<select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="h-10 px-4 rounded-[10px] border border-[#E2E8F0] text-[13px] font-medium text-[#475569] bg-white outline-none hover:border-[#2563EB] cursor-pointer">
                <option value="">All Services</option>
                {DESIGN_SERVICES.map(ds => <option key={ds.id} value={ds.id}>{ds.id}</option>)}
              </select>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="h-10 px-4 rounded-[10px] border border-[#E2E8F0] text-[13px] font-medium text-[#475569] bg-white outline-none hover:border-[#2563EB] cursor-pointer">
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <select value={filterProg} onChange={(e) => setFilterProg(e.target.value)} className="h-10 px-4 rounded-[10px] border border-[#E2E8F0] text-[13px] font-medium text-[#475569] bg-white outline-none hover:border-[#2563EB] cursor-pointer">
                <option value="">All Progress</option>
                <option value="0-25">0% - 25%</option>
                <option value="26-75">26% - 75%</option>
                <option value="76-99">76% - 99%</option>
                <option value="100">100% Completed</option>
              </select>
              <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="h-10 px-4 rounded-[10px] border border-[#E2E8F0] text-[13px] font-medium text-[#475569] bg-white outline-none hover:border-[#2563EB] cursor-pointer">
                <option value="">Sort: Newest First</option>
                <option value="oldest">Sort: Oldest First</option>
              </select>`;
sCode = sCode.replace(/<select value=\{filterType\}[\s\S]*?<\/select>/, newSelectS);

// Fix filtering and progress calculation
sCode = sCode.replace(
  /if \(filterType\) \{[\s\S]*?\}/,
  `if (filterType) {
                        filtered = filtered.filter(s => s.title && s.title.includes(filterType));
                     }
                     if (filterStatus) {
                        filtered = filtered.filter(s => s.status === filterStatus);
                     }
                     
                     let mapped = filtered.map(srv => {
                        let prog = 0;
                        try {
                           const meta = JSON.parse(srv.description || "{}");
                           if (meta.steps && meta.steps.length > 0) {
                              const comp = meta.steps.filter(st => st.completed).length;
                              prog = Math.round((comp / meta.steps.length) * 100);
                           }
                        } catch(e) {}
                        return { ...srv, calcProgress: prog };
                     });
                     
                     if (filterProg) {
                        mapped = mapped.filter(s => {
                           if (filterProg === "0-25") return s.calcProgress >= 0 && s.calcProgress <= 25;
                           if (filterProg === "26-75") return s.calcProgress > 25 && s.calcProgress <= 75;
                           if (filterProg === "76-99") return s.calcProgress > 75 && s.calcProgress < 100;
                           if (filterProg === "100") return s.calcProgress === 100;
                           return true;
                        });
                     }
                     
                     if (sortOrder === "oldest") {
                        mapped.sort((a,b) => new Date(a.created_at) - new Date(b.created_at));
                     } else {
                        mapped.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
                     }`
);
sCode = sCode.replace('return filtered.map(srv => (', 'return mapped.map(srv => (');

sCode = sCode.replace(
  /<div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">\s*<div className="h-full bg-\[\#2563EB\]" style=\{\{width: `0%`\}\}><\/div>\s*<\/div>\s*<span className="text-\[10px\] font-bold text-\[\#64748B\]">0%<\/span>/g,
  `<div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                 <div className="h-full bg-[#2563EB]" style={{width: \`\${srv.calcProgress}%\`}}></div>
                              </div>
                              <span className="text-[10px] font-bold text-[#64748B]">{srv.calcProgress}%</span>`
);

fs.writeFileSync('src/views/admin/services/index.jsx', sCode);


// 2. projects/index.jsx
let pCode = fs.readFileSync('src/views/admin/projects/index.jsx', 'utf8');

// Add more states
pCode = pCode.replace(
  'const [filterType, setFilterType] = useState("");',
  'const [filterType, setFilterType] = useState("");\n  const [filterStatus, setFilterStatus] = useState("");\n  const [filterProg, setFilterProg] = useState("");\n  const [sortOrder, setSortOrder] = useState("");'
);

const newSelectP = `<select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="h-10 px-4 rounded-[10px] border border-[#E2E8F0] text-[13px] font-medium text-[#475569] bg-white outline-none hover:border-[#2563EB] cursor-pointer">
                <option value="">All Projects</option>
                {EXECUTION_PROJECTS.map(ds => <option key={ds.id} value={ds.id}>{ds.id}</option>)}
              </select>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="h-10 px-4 rounded-[10px] border border-[#E2E8F0] text-[13px] font-medium text-[#475569] bg-white outline-none hover:border-[#2563EB] cursor-pointer">
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <select value={filterProg} onChange={(e) => setFilterProg(e.target.value)} className="h-10 px-4 rounded-[10px] border border-[#E2E8F0] text-[13px] font-medium text-[#475569] bg-white outline-none hover:border-[#2563EB] cursor-pointer">
                <option value="">All Progress</option>
                <option value="0-25">0% - 25%</option>
                <option value="26-75">26% - 75%</option>
                <option value="76-99">76% - 99%</option>
                <option value="100">100% Completed</option>
              </select>
              <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="h-10 px-4 rounded-[10px] border border-[#E2E8F0] text-[13px] font-medium text-[#475569] bg-white outline-none hover:border-[#2563EB] cursor-pointer">
                <option value="">Sort: Newest First</option>
                <option value="oldest">Sort: Oldest First</option>
              </select>`;
pCode = pCode.replace(/<select value=\{filterType\}[\s\S]*?<\/select>/, newSelectP);

pCode = pCode.replace(
  /if \(filterType\) \{[\s\S]*?\}/,
  `if (filterType) {
                        filtered = filtered.filter(s => s.name && s.name.includes(filterType));
                     }
                     if (filterStatus) {
                        filtered = filtered.filter(s => s.status === filterStatus);
                     }
                     
                     let mapped = filtered.map(srv => {
                        let prog = 0;
                        try {
                           const meta = JSON.parse(srv.description || "{}");
                           if (meta.steps && meta.steps.length > 0) {
                              const comp = meta.steps.filter(st => st.completed).length;
                              prog = Math.round((comp / meta.steps.length) * 100);
                           }
                        } catch(e) {}
                        return { ...srv, calcProgress: prog };
                     });
                     
                     if (filterProg) {
                        mapped = mapped.filter(s => {
                           if (filterProg === "0-25") return s.calcProgress >= 0 && s.calcProgress <= 25;
                           if (filterProg === "26-75") return s.calcProgress > 25 && s.calcProgress <= 75;
                           if (filterProg === "76-99") return s.calcProgress > 75 && s.calcProgress < 100;
                           if (filterProg === "100") return s.calcProgress === 100;
                           return true;
                        });
                     }
                     
                     if (sortOrder === "oldest") {
                        mapped.sort((a,b) => new Date(a.created_at) - new Date(b.created_at));
                     } else {
                        mapped.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
                     }`
);
pCode = pCode.replace('return filtered.map(srv => (', 'return mapped.map(srv => (');

pCode = pCode.replace(
  /<div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">\s*<div className="h-full bg-\[\#2563EB\]" style=\{\{width: `0%`\}\}><\/div>\s*<\/div>\s*<span className="text-\[10px\] font-bold text-\[\#64748B\]">0%<\/span>/g,
  `<div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                 <div className="h-full bg-[#2563EB]" style={{width: \`\${srv.calcProgress}%\`}}></div>
                              </div>
                              <span className="text-[10px] font-bold text-[#64748B]">{srv.calcProgress}%</span>`
);

fs.writeFileSync('src/views/admin/projects/index.jsx', pCode);
