with open('crm/src/views/admin/employees/components/TabDirectory.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Add states
import re
c = c.replace(
    'const [searchTerm, setSearchTerm] = useState("");',
    'const [searchTerm, setSearchTerm] = useState("");\n  const [filterDept, setFilterDept] = useState("All Departments");\n  const [filterDesig, setFilterDesig] = useState("All Designations");\n  const [filterStatus, setFilterStatus] = useState("All Statuses");'
)

# 2. Update filtering logic
old_filter = """  const filteredEmployees = employees.filter(e => {
     const term = searchTerm.toLowerCase();
     return (e.name && e.name.toLowerCase().includes(term)) || 
            (e.email && e.email.toLowerCase().includes(term)) ||
            (e.designation && e.designation.toLowerCase().includes(term)) ||
            (e.phone && e.phone.toLowerCase().includes(term));
  });"""

new_filter = """  const uniqueDepts = ["All Departments", ...new Set(employees.map(e => e.department).filter(Boolean))];
  const uniqueDesigs = ["All Designations", ...new Set(employees.map(e => e.designation).filter(Boolean))];
  const uniqueStatuses = ["All Statuses", "Available", "Busy", "Inactive"];

  const filteredEmployees = employees.filter(e => {
     const term = searchTerm.toLowerCase();
     const matchesSearch = !term || (
            (e.name && e.name.toLowerCase().includes(term)) || 
            (e.email && e.email.toLowerCase().includes(term)) ||
            (e.designation && e.designation.toLowerCase().includes(term)) ||
            (e.phone && e.phone.toLowerCase().includes(term))
     );
     
     const matchesDept = filterDept === "All Departments" || e.department === filterDept;
     const matchesDesig = filterDesig === "All Designations" || e.designation === filterDesig;
     const matchesStatus = filterStatus === "All Statuses" || (e.status && e.status === filterStatus);
     
     return matchesSearch && matchesDept && matchesDesig && matchesStatus;
  });"""
c = c.replace(old_filter, new_filter)

# 3. Update the UI block
old_ui = """            <div className="flex flex-wrap gap-2 w-full lg:w-auto">
              {["Department", "Designation", "Reporting Manager", "Employment Type", "Status", "Role"].map(f => (
                 <select key={f} className="h-10 px-3 rounded-full border border-[#E2E8F0] text-[12px] font-medium text-[#475569] bg-white outline-none hover:border-[#2563EB] cursor-pointer">
                    <option>{f}</option>
                 </select>
              ))}
            </div>"""
new_ui = """            <div className="flex flex-wrap gap-2 w-full lg:w-auto">
              <select value={filterDept} onChange={e => setFilterDept(e.target.value)} className="h-10 px-3 rounded-full border border-[#E2E8F0] text-[12px] font-medium text-[#475569] bg-white outline-none hover:border-[#2563EB] cursor-pointer">
                 {uniqueDepts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <select value={filterDesig} onChange={e => setFilterDesig(e.target.value)} className="h-10 px-3 rounded-full border border-[#E2E8F0] text-[12px] font-medium text-[#475569] bg-white outline-none hover:border-[#2563EB] cursor-pointer">
                 {uniqueDesigs.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="h-10 px-3 rounded-full border border-[#E2E8F0] text-[12px] font-medium text-[#475569] bg-white outline-none hover:border-[#2563EB] cursor-pointer">
                 {uniqueStatuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>"""
c = c.replace(old_ui, new_ui)

with open('crm/src/views/admin/employees/components/TabDirectory.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
