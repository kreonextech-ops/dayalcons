const fs = require('fs');
let code = fs.readFileSync('src/views/admin/crm/index.jsx', 'utf8');

// 1. Add state
code = code.replace(
  'const [sortOrder, setSortOrder] = useState("newest");',
  'const [sortOrder, setSortOrder] = useState("newest");\n  const [filterTemp, setFilterTemp] = useState("");'
);

// 2. Add Dropdown UI
const statusDropdown = `<select 
                  value={filterStatus}`;
const newDropdown = `<select 
                  value={filterTemp}
                  onChange={(e) => setFilterTemp(e.target.value)}
                  className="h-10 px-4 rounded-[10px] border border-[#E2E8F0] text-[14px] text-[#475569] outline-none focus:border-[#2563EB] bg-white cursor-pointer"
                >
                  <option value="">All Temperatures</option>
                  <option value="Hot">Hot</option>
                  <option value="Warm">Warm</option>
                  <option value="Cold">Cold</option>
                </select>
                <select 
                  value={filterStatus}`;
code = code.replace(statusDropdown, newDropdown);

// 3. Add filtering logic
const filterLogic = `if (filterStatus) {
                        filtered = filtered.filter(x => x.status === filterStatus);
                     }`;
const newFilterLogic = `if (filterStatus) {
                        filtered = filtered.filter(x => x.status === filterStatus);
                     }
                     if (filterTemp) {
                        filtered = filtered.filter(x => x.lead_temperature === filterTemp);
                     }`;
code = code.replace(filterLogic, newFilterLogic);

fs.writeFileSync('src/views/admin/crm/index.jsx', code);
