const fs = require('fs');

// 1. Process services/index.jsx
let sCode = fs.readFileSync('src/views/admin/services/index.jsx', 'utf8');

// Remove Payment column
sCode = sCode.replace('<th className="py-4 px-4 text-[12px] font-medium text-[#64748B] uppercase tracking-wider">Payment</th>\n', '');
sCode = sCode.replace('<td className="py-4 px-4"><span className="text-orange-500 font-bold text-[13px]">Unpaid</span></td>\n', '');

// Add state for search & filter
sCode = sCode.replace(
  'const [selectedCase, setSelectedCase] = useState(null);',
  'const [selectedCase, setSelectedCase] = useState(null);\n  const [searchTerm, setSearchTerm] = useState("");\n  const [filterType, setFilterType] = useState("");'
);

// Add input value and onChange
sCode = sCode.replace(
  '<input type="text" placeholder="Search client, case ID, service..." className="w-full pl-10 pr-4 h-10 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none focus:border-[#2563EB] transition-colors" />',
  '<input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search client, case ID, service..." className="w-full pl-10 pr-4 h-10 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none focus:border-[#2563EB] transition-colors" />'
);

// Replace the dummy <select> with a real one
const oldSelectS = '<select className="h-10 px-4 rounded-full border border-[#E2E8F0] text-[13px] font-medium text-[#475569] bg-white outline-none hover:border-[#2563EB] cursor-pointer"><option>Status</option></select>';
const newSelectS = `<select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="h-10 px-4 rounded-[10px] border border-[#E2E8F0] text-[13px] font-medium text-[#475569] bg-white outline-none hover:border-[#2563EB] cursor-pointer">
                <option value="">All Services</option>
                {DESIGN_SERVICES.map(ds => <option key={ds.id} value={ds.id}>{ds.id}</option>)}
              </select>`;
sCode = sCode.replace(oldSelectS, newSelectS);

// Add filtering logic to the map function
const oldMapS = '{loading ? (';
const filterLogicS = `
                  {(() => {
                     let filtered = services;
                     if (searchTerm) {
                        const lower = searchTerm.toLowerCase();
                        filtered = filtered.filter(s => (s.id && s.id.toLowerCase().includes(lower)) || (s.client?.name && s.client.name.toLowerCase().includes(lower)) || (s.title && s.title.toLowerCase().includes(lower)));
                     }
                     if (filterType) {
                        filtered = filtered.filter(s => s.title && s.title.includes(filterType));
                     }
                     if (loading) return <tr><td colSpan="5" className="py-12 text-center text-[#64748B]">Loading...</td></tr>;
                     if (filtered.length === 0) return <tr><td colSpan="5" className="py-24 text-center">No cases found.</td></tr>;
                     return filtered.map(srv => (
`;
// Replace the whole map block... wait, regex is safer.
sCode = sCode.replace(/\{loading \? \([\s\S]*?\}\)\n                  \)\}/, filterLogicS + `
                        <tr key={srv.id} className="border-b border-[#E2E8F0] hover:bg-gray-50 transition cursor-pointer" onClick={() => setSelectedCase(srv)}>
                           <td className="py-4 px-6 text-[#64748B] font-medium text-[13px]">#{srv.id?.substring(0,8)}</td>
                           <td className="py-4 px-4 font-bold text-[#0F172A]">{srv.client?.name || "Unknown"}</td>
                           <td className="py-4 px-4 text-[#0F172A] font-medium">{srv.title}</td>
                           <td className="py-4 px-4">
                              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                 <div className="h-full bg-[#2563EB]" style={{width: \`0%\`}}></div>
                              </div>
                              <span className="text-[10px] font-bold text-[#64748B]">0%</span>
                           </td>
                           <td className="py-4 px-6 text-right">
                              <button onClick={(e) => { e.stopPropagation(); handleDelete(e, srv.id); }} className="text-[#DC2626] hover:bg-red-50 p-2 rounded-lg transition" title="Delete Case">
                                 <MdDelete size={20} />
                              </button>
                           </td>
                        </tr>
                     ));
                  })()}
`);
sCode = sCode.replace('colSpan="6"', 'colSpan="5"');
sCode = sCode.replace('colSpan="6"', 'colSpan="5"');

fs.writeFileSync('src/views/admin/services/index.jsx', sCode);


// 2. Process projects/index.jsx
let pCode = fs.readFileSync('src/views/admin/projects/index.jsx', 'utf8');

pCode = pCode.replace('<th className="py-4 px-4 text-[12px] font-medium text-[#64748B] uppercase tracking-wider">Payment</th>\n', '');
pCode = pCode.replace('<td className="py-4 px-4"><span className="text-orange-500 font-bold text-[13px]">Unpaid</span></td>\n', '');

// Add state for search & filter
pCode = pCode.replace(
  'const [selectedCase, setSelectedCase] = useState(null);',
  'const [selectedCase, setSelectedCase] = useState(null);\n  const [searchTerm, setSearchTerm] = useState("");\n  const [filterType, setFilterType] = useState("");'
);

pCode = pCode.replace(
  '<input type="text" placeholder="Search client, project ID, execution..." className="w-full pl-10 pr-4 h-10 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none focus:border-[#2563EB] transition-colors" />',
  '<input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search client, project ID, execution..." className="w-full pl-10 pr-4 h-10 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none focus:border-[#2563EB] transition-colors" />'
);

const oldSelectP = '<select className="h-10 px-4 rounded-full border border-[#E2E8F0] text-[13px] font-medium text-[#475569] bg-white outline-none hover:border-[#2563EB] cursor-pointer"><option>Status</option></select>';
const newSelectP = `<select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="h-10 px-4 rounded-[10px] border border-[#E2E8F0] text-[13px] font-medium text-[#475569] bg-white outline-none hover:border-[#2563EB] cursor-pointer">
                <option value="">All Projects</option>
                {EXECUTION_PROJECTS.map(ds => <option key={ds.id} value={ds.id}>{ds.id}</option>)}
              </select>`;
pCode = pCode.replace(oldSelectP, newSelectP);

// Add filtering logic to the map function
pCode = pCode.replace(/\{loading \? \([\s\S]*?\}\)\n                  \)\}/, `
                  {(() => {
                     let filtered = projects;
                     if (searchTerm) {
                        const lower = searchTerm.toLowerCase();
                        filtered = filtered.filter(s => (s.id && s.id.toLowerCase().includes(lower)) || (s.client?.name && s.client.name.toLowerCase().includes(lower)) || (s.name && s.name.toLowerCase().includes(lower)));
                     }
                     if (filterType) {
                        filtered = filtered.filter(s => s.name && s.name.includes(filterType));
                     }
                     if (loading) return <tr><td colSpan="5" className="py-12 text-center text-[#64748B]">Loading...</td></tr>;
                     if (filtered.length === 0) return <tr><td colSpan="5" className="py-24 text-center">No projects found.</td></tr>;
                     return filtered.map(srv => (
                        <tr key={srv.id} className="border-b border-[#E2E8F0] hover:bg-gray-50 transition cursor-pointer" onClick={() => setSelectedCase(srv)}>
                           <td className="py-4 px-6 text-[#64748B] font-medium text-[13px]">#{srv.id?.substring(0,8)}</td>
                           <td className="py-4 px-4 font-bold text-[#0F172A]">{srv.client?.name || "Unknown"}</td>
                           <td className="py-4 px-4 text-[#0F172A] font-medium">{srv.name}</td>
                           <td className="py-4 px-4">
                              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                 <div className="h-full bg-[#2563EB]" style={{width: \`0%\`}}></div>
                              </div>
                              <span className="text-[10px] font-bold text-[#64748B]">0%</span>
                           </td>
                           <td className="py-4 px-6 text-right">
                              <button onClick={(e) => { e.stopPropagation(); handleDelete(e, srv.id); }} className="text-[#DC2626] hover:bg-red-50 p-2 rounded-lg transition" title="Delete Project">
                                 <MdDelete size={20} />
                              </button>
                           </td>
                        </tr>
                     ));
                  })()}
`);
pCode = pCode.replace('colSpan="6"', 'colSpan="5"');
pCode = pCode.replace('colSpan="6"', 'colSpan="5"');

fs.writeFileSync('src/views/admin/projects/index.jsx', pCode);
