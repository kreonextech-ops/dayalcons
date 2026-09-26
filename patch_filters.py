import re

filepath = 'crm/src/views/admin/crm/index.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. ADD STATES
if 'const [filterEmployee, setFilterEmployee] = useState("");' not in content:
    content = content.replace(
        'const [sortOrder, setSortOrder] = useState("newest");',
        'const [sortOrder, setSortOrder] = useState("newest");\n  const [filterEmployee, setFilterEmployee] = useState("");\n  const [filterService, setFilterService] = useState("");'
    )

# 2. UPDATE FILTER LOGIC
old_filter_logic = """                     if (sortOrder === "oldest") {
                        filtered.sort((a,b) => new Date(a.created_at) - new Date(b.created_at));
                     } else if (sortOrder === "name_asc") {"""

new_filter_logic = """
                     if (filterEmployee) {
                        filtered = filtered.filter(x => x.assigned_to && x.assigned_to.includes(filterEmployee));
                     }
                     if (filterService) {
                        filtered = filtered.filter(x => x.service_type && x.service_type.includes(filterService));
                     }

                     if (sortOrder === "status_ongoing") {
                        filtered = filtered.filter(x => x.status !== "Won" && x.status !== "Lost");
                     } else if (sortOrder === "status_success") {
                        filtered = filtered.filter(x => x.status === "Won");
                     } else if (sortOrder === "temp_hot") {
                        filtered = filtered.filter(x => x.lead_temperature === "Hot");
                     } else if (sortOrder === "temp_warm") {
                        filtered = filtered.filter(x => x.lead_temperature === "Warm");
                     } else if (sortOrder === "temp_cold") {
                        filtered = filtered.filter(x => x.lead_temperature === "Cold");
                     }
                     
                     if (sortOrder === "oldest") {
                        filtered.sort((a,b) => new Date(a.created_at) - new Date(b.created_at));
                     } else if (sortOrder === "name_asc") {"""

if 'if (filterEmployee)' not in content:
    content = content.replace(old_filter_logic, new_filter_logic)

# 3. UPDATE UI
old_ui = """                      <select 
                        value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                      className="h-10 px-4 rounded-[10px] border border-[#E2E8F0] dark:border-navy-700 text-[14px] text-[#475569] dark:text-gray-200 dark:text-white outline-none focus:border-[#2563EB] bg-transparent dark:bg-navy-900 cursor-pointer"
                    >
                      <option value="newest">Sort: Newest First</option>
                      <option value="oldest">Sort: Oldest First</option>
                      <option value="name_asc">Sort: Name (A-Z)</option>
                      <option value="name_desc">Sort: Name (Z-A)</option>
                      <option value="status">Sort: Status</option>
                    </select>"""

new_ui = """                      <select 
                        value={filterEmployee}
                        onChange={(e) => setFilterEmployee(e.target.value)}
                        className="h-10 px-4 rounded-[10px] border border-[#E2E8F0] dark:border-navy-700 text-[14px] text-[#475569] dark:text-gray-200 dark:text-white outline-none focus:border-[#2563EB] bg-transparent dark:bg-navy-900 cursor-pointer w-[160px] truncate"
                        title="Filter by Employee"
                      >
                        <option value="">All Employees</option>
                        {Object.entries(employeesMap).map(([id, name]) => (
                           <option key={id} value={id}>{name}</option>
                        ))}
                      </select>

                      <select 
                        value={filterService}
                        onChange={(e) => setFilterService(e.target.value)}
                        className="h-10 px-4 rounded-[10px] border border-[#E2E8F0] dark:border-navy-700 text-[14px] text-[#475569] dark:text-gray-200 dark:text-white outline-none focus:border-[#2563EB] bg-transparent dark:bg-navy-900 cursor-pointer w-[160px] truncate"
                        title="Filter by Service"
                      >
                        <option value="">All Services</option>
                        <optgroup label="Design Services">
                           {DESIGN_SERVICES.map(s => <option key={s.id} value={s.id}>{s.id}</option>)}
                        </optgroup>
                        <optgroup label="Execution Projects">
                           {EXECUTION_PROJECTS.map(s => <option key={s.id} value={s.id}>{s.id}</option>)}
                        </optgroup>
                      </select>

                      <select 
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="h-10 px-4 rounded-[10px] border border-[#E2E8F0] dark:border-navy-700 text-[14px] text-[#475569] dark:text-gray-200 dark:text-white outline-none focus:border-[#2563EB] bg-transparent dark:bg-navy-900 cursor-pointer min-w-[140px]"
                      >
                        <optgroup label="Sort By">
                           <option value="newest">Newest First</option>
                           <option value="oldest">Oldest First</option>
                           <option value="name_asc">Name (A-Z)</option>
                           <option value="name_desc">Name (Z-A)</option>
                           <option value="status">Status (A-Z)</option>
                        </optgroup>
                        <optgroup label="Filter Status">
                           <option value="status_ongoing">Ongoing Leads</option>
                           <option value="status_success">Success Closed (Won)</option>
                        </optgroup>
                        <optgroup label="Filter Temp">
                           <option value="temp_hot">Hot Leads</option>
                           <option value="temp_warm">Warm Leads</option>
                           <option value="temp_cold">Cold Leads</option>
                        </optgroup>
                      </select>"""

if 'value={filterEmployee}' not in content:
    content = content.replace(old_ui, new_ui)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Filters patched successfully")
