const fs = require('fs');

let lCode = fs.readFileSync('src/views/admin/crm/index.jsx', 'utf8');
if (!lCode.includes('setSearchTerm(e.target.value)')) {
   lCode = lCode.replace(
      'const [showNewModal, setShowNewModal] = useState(false);',
      'const [showNewModal, setShowNewModal] = useState(false);\n  const [searchTerm, setSearchTerm] = useState("");'
   );
   
   lCode = lCode.replace(
      '<input type="text" placeholder="Search leads..." className="w-full pl-10 pr-4 h-10 rounded-full bg-white border-none text-[14px] outline-none shadow-sm text-gray-700 placeholder-gray-400" />',
      '<input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search leads..." className="w-full pl-10 pr-4 h-10 rounded-full bg-white border-none text-[14px] outline-none shadow-sm text-gray-700 placeholder-gray-400" />'
   );
   
   lCode = lCode.replace(
      /\{loading \? \([\s\S]*?\}\)\n               \)\}/,
      `{(() => {
         let filtered = leads;
         if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            filtered = filtered.filter(l => (l.name && l.name.toLowerCase().includes(lower)) || (l.email && l.email.toLowerCase().includes(lower)) || (l.phone && l.phone.toLowerCase().includes(lower)) || (l.company && l.company.toLowerCase().includes(lower)));
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
                              <MdDelete size={20} />
                           </button>
                        </td>
                     </tr>
         ));
      })()}`
   );
   fs.writeFileSync('src/views/admin/crm/index.jsx', lCode);
}
