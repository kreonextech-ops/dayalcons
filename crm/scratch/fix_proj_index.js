const fs = require('fs');

let pCode = fs.readFileSync('src/views/admin/projects/index.jsx', 'utf8');

const regex = /<tbody>[\s\S]*?<\/tbody>/;

const newBody = `<tbody>
                  {(() => {
                     let filtered = projects;
                     if (searchTerm) {
                        const lower = searchTerm.toLowerCase();
                        filtered = filtered.filter(p => (p.id && p.id.toLowerCase().includes(lower)) || (p.client?.name && p.client.name.toLowerCase().includes(lower)) || (p.name && p.name.toLowerCase().includes(lower)));
                     }
                     if (filterType) {
                        filtered = filtered.filter(p => p.description && p.description.includes(filterType));
                     }
                     if (filterStatus) {
                        filtered = filtered.filter(p => p.status === filterStatus);
                     }
                     
                     let mapped = filtered.map(proj => {
                        let prog = 0;
                        try {
                           const meta = JSON.parse(proj.description || "{}");
                           if (meta.steps && meta.steps.length > 0) {
                              const comp = meta.steps.filter(st => st.completed).length;
                              prog = Math.round((comp / meta.steps.length) * 100);
                           }
                        } catch(e) {}
                        return { ...proj, calcProgress: prog };
                     });
                     
                     if (filterProg) {
                        mapped = mapped.filter(p => {
                           if (filterProg === "0-25") return p.calcProgress >= 0 && p.calcProgress <= 25;
                           if (filterProg === "26-75") return p.calcProgress > 25 && p.calcProgress <= 75;
                           if (filterProg === "76-99") return p.calcProgress > 75 && p.calcProgress < 100;
                           if (filterProg === "100") return p.calcProgress === 100;
                           return true;
                        });
                     }
                     
                     if (sortOrder === "oldest") {
                        mapped.sort((a,b) => new Date(a.created_at) - new Date(b.created_at));
                     } else {
                        mapped.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
                     }

                     if (loading) return <tr><td colSpan="5" className="py-12 text-center text-[#64748B]">Loading...</td></tr>;
                     if (mapped.length === 0) return <tr><td colSpan="5" className="py-24 text-center">No projects found.</td></tr>;
                     
                     return mapped.map(proj => (
                        <tr 
                           key={proj.id} 
                           onClick={() => setSelectedCase(proj)}
                           className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition cursor-pointer"
                        >
                           <td className="py-4 px-6">
                              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-bold">PRJ-{proj.id.substring(0, 5).toUpperCase()}</span>
                           </td>
                           <td className="py-4 px-4 font-bold text-[#0F172A]">{proj.client?.name || "Unknown"}</td>
                           <td className="py-4 px-4 text-[#0F172A] font-medium">{(proj?.name || proj?.title)}</td>
                           <td className="py-4 px-4">
                              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                 <div className="h-full bg-[#2563EB]" style={{width: \`\${proj.calcProgress}%\`}}></div>
                              </div>
                              <span className="text-[10px] font-bold text-[#64748B]">{proj.calcProgress}%</span>
                           </td>
                           <td className="py-4 px-6 text-right">
                              <button onClick={(e) => { e.stopPropagation(); handleDelete(e, proj.id); }} className="text-[#DC2626] hover:bg-red-50 p-2 rounded-lg transition" title="Delete Project">
                                 <MdDelete size={20} />
                              </button>
                           </td>
                        </tr>
                     ));
                  })()}
               </tbody>`;

pCode = pCode.replace(regex, newBody);
fs.writeFileSync('src/views/admin/projects/index.jsx', pCode);
