import re

filepath = 'crm/src/views/admin/clients/index.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. ADD STATES
if 'const [filterEmployee, setFilterEmployee] = useState("");' not in content:
    content = content.replace(
        'const [sortOrder, setSortOrder] = useState("newest");',
        'const [sortOrder, setSortOrder] = useState("newest");\n  const [filterEmployee, setFilterEmployee] = useState("");\n  const [filterService, setFilterService] = useState("");\n  const [employeesMap, setEmployeesMap] = useState({});'
    )

# 2. FETCH EMPLOYEES
old_fetch = 'const { data, error } = await query;'
new_fetch = """const { data, error } = await query;
      const { data: empDataFetch } = await supabase.from("employees").select("id, name");
      const eMap = {};
      if (empDataFetch) { empDataFetch.forEach(e => eMap[e.id] = e.name); }
      setEmployeesMap(eMap);"""
if 'setEmployeesMap(eMap)' not in content:
    content = content.replace(old_fetch, new_fetch)

# 3. FILTER LOGIC
old_filter_logic = """                     if (sortOrder === "oldest") {
                        filtered.sort((a,b) => new Date(a.created_at) - new Date(b.created_at));
                     } else if (sortOrder === "name_asc") {"""
new_filter_logic = """
                     if (filterEmployee) {
                        filtered = filtered.filter(x => x.assigned_to && x.assigned_to.includes(filterEmployee));
                     }
                     if (filterService) {
                        filtered = filtered.filter(x => x.work_types && x.work_types.includes(filterService));
                     }
                     if (sortOrder === "oldest") {
                        filtered.sort((a,b) => new Date(a.created_at) - new Date(b.created_at));
                     } else if (sortOrder === "name_asc") {"""
if 'if (filterEmployee)' not in content:
    content = content.replace(old_filter_logic, new_filter_logic)

# 4. UI DROPDOWNS
old_ui = """                      <select 
                        value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                      className="h-10 px-4 rounded-[10px] border border-[#E2E8F0] dark:border-navy-700 text-[14px] text-[#475569] dark:text-gray-200 dark:text-white outline-none focus:border-[#2563EB] bg-transparent dark:bg-navy-900 cursor-pointer"
                    >
                      <option value="newest">Sort: Newest First</option>
                      <option value="oldest">Sort: Oldest First</option>
                      <option value="name_asc">Sort: Name (A-Z)</option>
                      <option value="name_desc">Sort: Name (Z-A)</option>
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
                        </optgroup>
                      </select>"""

if 'value={filterEmployee}' not in content:
    content = content.replace(old_ui, new_ui)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Clients patched successfully")
