const fs = require('fs');

let sCode = fs.readFileSync('src/views/admin/services/index.jsx', 'utf8');

const regex = /<tbody>[\s\S]*?<\/tbody>/;

const newBody = `<tbody>
                  {(() => {
                     let filtered = services;
                     if (searchTerm) {
                        const lower = searchTerm.toLowerCase();
                        filtered = filtered.filter(s => (s.id && s.id.toLowerCase().includes(lower)) || (s.client?.name && s.client.name.toLowerCase().includes(lower)) || (s.title && s.title.toLowerCase().includes(lower)));
                     }
                     if (filterType) {
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
                     }

                     if (loading) return <tr><td colSpan="5" className="py-12 text-center text-[#64748B]">Loading...</td></tr>;
                     if (mapped.length === 0) return <tr><td colSpan="5" className="py-24 text-center">No service cases found.</td></tr>;
                     
                     return mapped.map(srv => (
                        <tr 
                           key={srv.id} 
                           onClick={() => setSelectedCase(srv)}
                           className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition cursor-pointer"
                        >
                           <td className="py-4 px-6">
                              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-bold">SRV-{srv.id.substring(0, 5).toUpperCase()}</span>
                           </td>
                           <td className="py-4 px-4 font-bold text-[#0F172A]">{srv.client?.name || "Unknown"}</td>
                           <td className="py-4 px-4 text-[#0F172A] font-medium">{srv.title}</td>
                           <td className="py-4 px-4">
                              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                 <div className="h-full bg-[#2563EB]" style={{width: \`\${srv.calcProgress}%\`}}></div>
                              </div>
                              <span className="text-[10px] font-bold text-[#64748B]">{srv.calcProgress}%</span>
                           </td>
                           <td className="py-4 px-6 text-right">
                              <button onClick={(e) => { e.stopPropagation(); handleDelete(e, srv.id); }} className="text-[#DC2626] hover:bg-red-50 p-2 rounded-lg transition" title="Delete Case">
                                 <MdDelete size={20} />
                              </button>
                           </td>
                        </tr>
                     ));
                  })()}
               </tbody>`;

sCode = sCode.replace(regex, newBody);
fs.writeFileSync('src/views/admin/services/index.jsx', sCode);
