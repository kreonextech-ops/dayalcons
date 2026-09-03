const fs = require('fs');

let cCode = fs.readFileSync('src/views/admin/clients/index.jsx', 'utf8');
if (!cCode.includes('setSearchTerm(e.target.value)')) {
   cCode = cCode.replace(
      'const [showNewModal, setShowNewModal] = useState(false);',
      'const [showNewModal, setShowNewModal] = useState(false);\n  const [searchTerm, setSearchTerm] = useState("");'
   );
   
   cCode = cCode.replace(
      '<input type="text" placeholder="Search clients..." className="w-full pl-10 pr-4 h-10 rounded-full bg-white border-none text-[14px] outline-none shadow-sm text-gray-700 placeholder-gray-400" />',
      '<input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search clients..." className="w-full pl-10 pr-4 h-10 rounded-full bg-white border-none text-[14px] outline-none shadow-sm text-gray-700 placeholder-gray-400" />'
   );
   
   cCode = cCode.replace(
      /\{loading \? \([\s\S]*?\}\)\n               \)\}/,
      `{(() => {
         let filtered = clients;
         if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            filtered = filtered.filter(c => (c.name && c.name.toLowerCase().includes(lower)) || (c.email && c.email.toLowerCase().includes(lower)) || (c.phone && c.phone.toLowerCase().includes(lower)));
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
      })()}`
   );
   fs.writeFileSync('src/views/admin/clients/index.jsx', cCode);
}
