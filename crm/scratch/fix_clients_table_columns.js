const fs = require('fs');
let code = fs.readFileSync('src/views/admin/clients/index.jsx', 'utf8');

const regex = /<tr key=\{client\.id\}[\s\S]*?<\/tr>/;
const newRow = `<tr key={client.id} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedClient(client)}>
                           <td className="py-4 px-6" onClick={(e) => e.stopPropagation()}>
                              <input type="checkbox" className="w-4 h-4 rounded text-[#2563EB] border-[#E2E8F0] cursor-pointer" />
                           </td>
                           <td className="py-4 px-4">
                              <p className="text-sm text-gray-800 font-bold">{client.name}</p>
                              {client.company && <p className="text-[12px] text-gray-500">{client.company}</p>}
                           </td>
                           <td className="py-4 px-4">
                              {client.email && <p className="text-sm text-gray-600">{client.email}</p>}
                              {client.phone && <p className="text-[12px] text-gray-500">{client.phone}</p>}
                           </td>
                           <td className="py-4 px-4 text-sm text-gray-600">
                              0
                           </td>
                           <td className="py-4 px-4 text-sm text-gray-600 font-bold text-green-600">
                              ₹0
                           </td>
                           <td className="py-4 px-6 text-right">
                              <button onClick={(e) => { e.stopPropagation(); handleDeleteClient(client.id); }} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition" title="Delete Client">
                                 <MdDeleteOutline size={20} />
                              </button>
                           </td>
                        </tr>`;

code = code.replace(regex, newRow);
fs.writeFileSync('src/views/admin/clients/index.jsx', code);
