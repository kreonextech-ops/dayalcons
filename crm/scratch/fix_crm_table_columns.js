const fs = require('fs');
let code = fs.readFileSync('src/views/admin/crm/index.jsx', 'utf8');

const regex = /<tr key=\{lead\.id\}[\s\S]*?<\/tr>/;
const newRow = `<tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedLead(lead)}>
                           <td className="py-4 px-6" onClick={(e) => e.stopPropagation()}>
                              <input type="checkbox" className="w-4 h-4 rounded text-[#2563EB] border-[#E2E8F0] cursor-pointer" />
                           </td>
                           <td className="py-4 px-4">
                              <p className="text-sm text-gray-800 font-bold">{lead.name}</p>
                              {lead.email && <p className="text-[12px] text-gray-500">{lead.email}</p>}
                           </td>
                           <td className="py-4 px-4 text-sm text-gray-600">{lead.source || lead.phone || "-"}</td>
                           <td className="py-4 px-4 text-sm text-gray-600">{lead.service_type || "-"}</td>
                           <td className="py-4 px-4 text-sm">
                              <span className={\`px-3 py-1 rounded-full text-xs font-bold \${lead.status === 'New' ? 'bg-blue-100 text-blue-700' : lead.status === 'Contacted' ? 'bg-yellow-100 text-yellow-700' : lead.status === 'Converted' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}\`}>
                                 {lead.status}
                              </span>
                           </td>
                           <td className="py-4 px-4 text-sm text-gray-600 font-medium">
                              {lead.lead_temperature === 'Hot' ? <span className="text-red-500 flex items-center gap-1"><MdLocalFireDepartment /> Hot</span> : 
                               lead.lead_temperature === 'Warm' ? <span className="text-orange-500">Warm</span> : 
                               lead.lead_temperature === 'Cold' ? <span className="text-blue-500">Cold</span> : "-"}
                           </td>
                           <td className="py-4 px-4 text-sm text-gray-600">{lead.created_at ? new Date(lead.created_at).toLocaleDateString() : "-"}</td>
                           <td className="py-4 px-4 text-sm font-medium text-gray-800">
                              {lead.assigned_to ? (lead.assigned_to.includes("-") ? \`EMP-\${lead.assigned_to.substring(0, 5).toUpperCase()}\` : lead.assigned_to) : "Unassigned"}
                           </td>
                           <td className="py-4 px-6 text-right">
                              <button onClick={(e) => { e.stopPropagation(); handleDeleteLead(lead.id); }} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition" title="Delete Lead">
                                 <MdDeleteOutline size={20} />
                              </button>
                           </td>
                        </tr>`;

code = code.replace(regex, newRow);
fs.writeFileSync('src/views/admin/crm/index.jsx', code);
