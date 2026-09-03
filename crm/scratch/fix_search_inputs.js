const fs = require('fs');

function addFiltersAndInput(filePath, entity) {
    let code = fs.readFileSync(filePath, 'utf8');

    // Add state variables
    if (!code.includes('const [filterStatus')) {
        code = code.replace(
            /const \[searchTerm, setSearchTerm\] = useState\(""\);/,
            'const [searchTerm, setSearchTerm] = useState("");\n  const [filterStatus, setFilterStatus] = useState("");\n  const [sortOrder, setSortOrder] = useState("newest");'
        );
    }

    // Replace the Toolbar Card completely
    const cardRegex = /<Card extra="p-4 border border-\[\#E2E8F0\] mb-6 shadow-sm">[\s\S]*?<\/Card>/;
    
    let statuses = [];
    if (entity === 'leads') {
        statuses = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'];
    } else {
        statuses = ['Active', 'Inactive', 'Converted'];
    }

    const newToolbar = `<Card extra="p-4 border border-[#E2E8F0] mb-6 shadow-sm">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
              <div className="relative w-full lg:w-[350px]">
                <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#64748B] text-xl" />
                <input 
                  type="text" 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  placeholder="Search name, phone, address..." 
                  className="w-full pl-10 pr-4 h-10 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none focus:border-[#2563EB] transition-colors" 
                />
              </div>
              <div className="flex gap-3 w-full lg:w-auto">
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="h-10 px-4 rounded-[10px] border border-[#E2E8F0] text-[14px] text-[#475569] outline-none focus:border-[#2563EB] bg-white cursor-pointer"
                >
                  <option value="">All Statuses</option>
                  ${statuses.map(s => `<option value="${s}">${s}</option>`).join('\n                  ')}
                </select>
                <select 
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="h-10 px-4 rounded-[10px] border border-[#E2E8F0] text-[14px] text-[#475569] outline-none focus:border-[#2563EB] bg-white cursor-pointer"
                >
                  <option value="newest">Sort: Newest First</option>
                  <option value="oldest">Sort: Oldest First</option>
                </select>
              </div>
            </div>
          </Card>`;

    code = code.replace(cardRegex, newToolbar);
    
    // Inject logic into tbody
    const tbodyRegex = /let filtered = (?:leads|clients);[\s\S]*?if \(searchTerm\)/;
    code = code.replace(tbodyRegex, `let filtered = ${entity === 'leads' ? 'leads' : 'clients'};
                     if (filterStatus) {
                        filtered = filtered.filter(x => x.status === filterStatus);
                     }
                     if (sortOrder === "oldest") {
                        filtered.sort((a,b) => new Date(a.created_at) - new Date(b.created_at));
                     } else {
                        filtered.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
                     }
                     if (searchTerm)`);

    fs.writeFileSync(filePath, code);
}

addFiltersAndInput('src/views/admin/crm/index.jsx', 'leads');
addFiltersAndInput('src/views/admin/clients/index.jsx', 'clients');
