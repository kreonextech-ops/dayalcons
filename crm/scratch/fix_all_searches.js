const fs = require('fs');

function injectState(code, stateVarsStr) {
   if (!code.includes('searchTerm')) {
       // inject after the first useState
       code = code.replace(/(const \[.*?\] = useState\(.*?\);)/, `$1\n  ${stateVarsStr}`);
   }
   return code;
}

function replaceInput(code, placeholder, newPlaceholder) {
   // find the input with placeholder
   const regex = new RegExp(`<input type="text" placeholder="${placeholder}"[^>]*>`);
   const match = code.match(regex);
   if (match) {
       // if it already has value={searchTerm}, skip
       if (match[0].includes('value={searchTerm}')) return code;
       const replaced = match[0].replace('placeholder="', `value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="`);
       code = code.replace(match[0], replaced);
   } else {
       // try a more generic replacement if exact placeholder not found
       const genericRegex = new RegExp(`<input type="text"(?: value=\\{searchTerm\\} onChange=\\{.*?\\})? placeholder="${newPlaceholder || placeholder}"[^>]*>`);
       const genericMatch = code.match(genericRegex);
       if(genericMatch && !genericMatch[0].includes('value={searchTerm}')) {
          const replaced = genericMatch[0].replace('placeholder="', `value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="`);
          code = code.replace(genericMatch[0], replaced);
       }
   }
   return code;
}

// 1. Leads (crm/index.jsx)
let lCode = fs.readFileSync('src/views/admin/crm/index.jsx', 'utf8');
lCode = injectState(lCode, 'const [searchTerm, setSearchTerm] = useState("");');
lCode = replaceInput(lCode, 'Search leads...');
// Replace tbody for leads
const lRegex = /<tbody>[\s\S]*?<\/tbody>/;
const lNewBody = `<tbody>
                  {(() => {
                     let filtered = leads;
                     if (searchTerm) {
                        const lower = searchTerm.toLowerCase();
                        filtered = filtered.filter(l => 
                           (l.name && l.name.toLowerCase().includes(lower)) || 
                           (l.email && l.email.toLowerCase().includes(lower)) || 
                           (l.phone && l.phone.toLowerCase().includes(lower)) || 
                           (l.company && l.company.toLowerCase().includes(lower)) ||
                           (l.address && l.address.toLowerCase().includes(lower)) ||
                           (l.source && l.source.toLowerCase().includes(lower))
                        );
                     }
                     if (loading) return <tr><td colSpan="7" className="py-12 text-center text-gray-500">Loading leads...</td></tr>;
                     if (filtered.length === 0) return <tr><td colSpan="7" className="py-12 text-center text-gray-500">No leads found.</td></tr>;
                     return filtered.map(lead => (
                        <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedLead(lead)}>
                           <td className="py-4 px-6 text-sm text-gray-800 font-bold">{lead.name}</td>
                           <td className="py-4 px-6 text-sm text-gray-600">{lead.email}</td>
                           <td className="py-4 px-6 text-sm text-gray-600">{lead.phone}</td>
                           <td className="py-4 px-6 text-sm text-gray-600">{lead.company}</td>
                           <td className="py-4 px-6 text-sm">
                              <span className={\`px-3 py-1 rounded-full text-xs font-bold \${lead.status === 'New' ? 'bg-blue-100 text-blue-700' : lead.status === 'Contacted' ? 'bg-yellow-100 text-yellow-700' : lead.status === 'Converted' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}\`}>
                                 {lead.status}
                              </span>
                           </td>
                           <td className="py-4 px-6 text-sm font-medium text-gray-800">{lead.assigned_to || "Unassigned"}</td>
                           <td className="py-4 px-6 text-right">
                              <button onClick={(e) => { e.stopPropagation(); handleDeleteLead(lead.id); }} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition" title="Delete Lead">
                                 <MdDeleteOutline size={20} />
                              </button>
                           </td>
                        </tr>
                     ));
                  })()}
               </tbody>`;
lCode = lCode.replace(lRegex, lNewBody);
fs.writeFileSync('src/views/admin/crm/index.jsx', lCode);


// 2. Clients (clients/index.jsx)
let cCode = fs.readFileSync('src/views/admin/clients/index.jsx', 'utf8');
cCode = injectState(cCode, 'const [searchTerm, setSearchTerm] = useState("");');
cCode = replaceInput(cCode, 'Search clients...');
const cRegex = /<tbody>[\s\S]*?<\/tbody>/;
const cNewBody = `<tbody>
                  {(() => {
                     let filtered = clients;
                     if (searchTerm) {
                        const lower = searchTerm.toLowerCase();
                        filtered = filtered.filter(c => 
                           (c.name && c.name.toLowerCase().includes(lower)) || 
                           (c.email && c.email.toLowerCase().includes(lower)) || 
                           (c.phone && c.phone.toLowerCase().includes(lower)) || 
                           (c.company && c.company.toLowerCase().includes(lower)) ||
                           (c.address && c.address.toLowerCase().includes(lower))
                        );
                     }
                     if (loading) return <tr><td colSpan="6" className="py-12 text-center text-gray-500">Loading clients...</td></tr>;
                     if (filtered.length === 0) return <tr><td colSpan="6" className="py-12 text-center text-gray-500">No clients found.</td></tr>;
                     return filtered.map(client => (
                        <tr key={client.id} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedClient(client)}>
                           <td className="py-4 px-6 text-sm text-gray-800 font-bold">{client.name}</td>
                           <td className="py-4 px-6 text-sm text-gray-600">{client.email}</td>
                           <td className="py-4 px-6 text-sm text-gray-600">{client.phone}</td>
                           <td className="py-4 px-6 text-sm text-gray-600">{client.company}</td>
                           <td className="py-4 px-6 text-sm">
                              <span className={\`px-3 py-1 rounded-full text-xs font-bold \${client.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}\`}>
                                 {client.status}
                              </span>
                           </td>
                           <td className="py-4 px-6 text-right">
                              <button onClick={(e) => { e.stopPropagation(); handleDeleteClient(client.id); }} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition" title="Delete Client">
                                 <MdDelete size={20} />
                              </button>
                           </td>
                        </tr>
                     ));
                  })()}
               </tbody>`;
cCode = cCode.replace(cRegex, cNewBody);
fs.writeFileSync('src/views/admin/clients/index.jsx', cCode);

// 3. Projects (projects/index.jsx)
let pCode = fs.readFileSync('src/views/admin/projects/index.jsx', 'utf8');
pCode = injectState(pCode, 'const [searchTerm, setSearchTerm] = useState("");');
pCode = replaceInput(pCode, 'Search client, project ID, execution...');
// It already has tbody logic, but let's enhance the filter logic
pCode = pCode.replace(
   /filtered = filtered\.filter\(p => \(p\.id && p\.id\.toLowerCase\(\)\.includes\(lower\)\) \|\| \(p\.client\?\.name && p\.client\.name\.toLowerCase\(\)\.includes\(lower\)\) \|\| \(p\.name && p\.name\.toLowerCase\(\)\.includes\(lower\)\)\);/,
   `filtered = filtered.filter(p => (p.id && p.id.toLowerCase().includes(lower)) || (p.client?.name && p.client.name.toLowerCase().includes(lower)) || (p.client?.phone && p.client.phone.toLowerCase().includes(lower)) || (p.client?.address && p.client.address.toLowerCase().includes(lower)) || (p.name && p.name.toLowerCase().includes(lower)));`
);
fs.writeFileSync('src/views/admin/projects/index.jsx', pCode);

// 4. Services (services/index.jsx)
let sCode = fs.readFileSync('src/views/admin/services/index.jsx', 'utf8');
sCode = injectState(sCode, 'const [searchTerm, setSearchTerm] = useState("");');
sCode = replaceInput(sCode, 'Search client, case ID, service...');
sCode = sCode.replace(
   /filtered = filtered\.filter\(s => \(s\.id && s\.id\.toLowerCase\(\)\.includes\(lower\)\) \|\| \(s\.client\?\.name && s\.client\.name\.toLowerCase\(\)\.includes\(lower\)\) \|\| \(s\.title && s\.title\.toLowerCase\(\)\.includes\(lower\)\)\);/,
   `filtered = filtered.filter(s => (s.id && s.id.toLowerCase().includes(lower)) || (s.client?.name && s.client.name.toLowerCase().includes(lower)) || (s.client?.phone && s.client.phone.toLowerCase().includes(lower)) || (s.client?.address && s.client.address.toLowerCase().includes(lower)) || (s.title && s.title.toLowerCase().includes(lower)));`
);
fs.writeFileSync('src/views/admin/services/index.jsx', sCode);
