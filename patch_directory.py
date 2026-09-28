with open('crm/src/views/admin/employees/components/TabDirectory.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Add search term state
idx_state = c.find('const [employees, setEmployees] = useState([]);')
c = c[:idx_state] + 'const [employees, setEmployees] = useState([]);\n  const [searchTerm, setSearchTerm] = useState("");\n' + c[idx_state + len('const [employees, setEmployees] = useState([]);'):]

# Add filtering logic
idx_return = c.find('return (')
c = c[:idx_return] + """
  const filteredEmployees = employees.filter(e => {
     const term = searchTerm.toLowerCase();
     return (e.name && e.name.toLowerCase().includes(term)) || 
            (e.email && e.email.toLowerCase().includes(term)) ||
            (e.designation && e.designation.toLowerCase().includes(term)) ||
            (e.phone && e.phone.toLowerCase().includes(term));
  });

""" + c[idx_return:]

# Fix input field
old_input = '<input type="text" placeholder="Search employee, designation, phone..." className="w-full pl-10 pr-4 h-10 rounded-[10px] border border-[#E2E8F0] text-[13px] outline-none focus:border-[#2563EB] transition-colors" />'
new_input = '<input type="text" placeholder="Search employee, designation, phone..." className="w-full pl-10 pr-4 h-10 rounded-[10px] border border-[#E2E8F0] text-[13px] outline-none focus:border-[#2563EB] transition-colors" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />'
c = c.replace(old_input, new_input)

# Remove the shit fake dropdowns
old_dropdowns = """<div className="flex flex-wrap gap-2 w-full lg:w-auto">
              {["Department", "Designation", "Reporting Manager", "Employment Type", "Status", "Role"].map(f => (
                 <select key={f} className="h-10 px-3 rounded-full border border-[#E2E8F0] text-[12px] bg-[#F8FAFC] text-[#64748B] outline-none">
                    <option>{f}</option>
                 </select>
              ))}
            </div>"""
c = c.replace(old_dropdowns, '')

# Add Email and Password to table header
c = c.replace('<th className="py-4 px-4 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Designation</th>', '<th className="py-4 px-4 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Designation</th>\n                   <th className="py-4 px-4 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Login Details</th>')

# Add Email and Password to table body
old_tds = """<td className="py-4 px-4">
                           <p className="text-[13px] font-bold text-[#0F172A]">{emp.designation || "-"}</p>
                           <p className="text-[12px] text-[#64748B]">{emp.role || "Employee"}</p>
                        </td>"""
new_tds = """<td className="py-4 px-4">
                           <p className="text-[13px] font-bold text-[#0F172A]">{emp.designation || "-"}</p>
                           <p className="text-[12px] text-[#64748B]">{emp.role || "Employee"}</p>
                        </td>
                        <td className="py-4 px-4">
                           <p className="text-[12px] text-[#0F172A] break-all">{emp.email}</p>
                           <p className="text-[12px] text-gray-500 font-mono">{emp.password}</p>
                        </td>"""
c = c.replace(old_tds, new_tds)

# Change map to filteredEmployees
c = c.replace('{employees.length === 0 ?', '{filteredEmployees.length === 0 ?')
c = c.replace('{employees.map((emp) => (', '{filteredEmployees.map((emp) => (')

with open('crm/src/views/admin/employees/components/TabDirectory.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
