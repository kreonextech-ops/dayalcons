with open('crm/src/views/admin/tasks/index.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Add Filter States
idx_scope = c.find('const [taskScope, setTaskScope] = useState(isAdminOrMD ? "All Tasks" : "My Tasks");')
filter_states = """const [taskScope, setTaskScope] = useState(isAdminOrMD ? "All Tasks" : "My Tasks");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterModule, setFilterModule] = useState("All Modules");
  const [filterStatus, setFilterStatus] = useState("All Statuses");
  const [filterPriority, setFilterPriority] = useState("All Priorities");
  const [filterDept, setFilterDept] = useState("All Departments");"""
c = c.replace('const [taskScope, setTaskScope] = useState(isAdminOrMD ? "All Tasks" : "My Tasks");', filter_states)

# 2. Add Filter Logic to displayedTasks
old_displayed = """  const displayedTasks = allTasks.filter(t => {
     if (!loggedInUser) return true; // fallback
     if (taskScope === "All Tasks" && isAdminOrMD) return true;
     if (taskScope === "My Tasks") return t.assignee_id && t.assignee_id.includes(loggedInUser.id);
     if (taskScope === "Given Tasks") return t.creator_id === loggedInUser.id;
     return false;
  });"""
new_displayed = """  const uniqueModules = ["All Modules", ...new Set(allTasks.map(t => t.module).filter(Boolean))];
  const uniqueStatuses = ["All Statuses", "To Do", "In Progress", "Completed", "On Hold"];
  const uniquePriorities = ["All Priorities", "Low", "Medium", "High", "Urgent"];
  const uniqueDepts = ["All Departments", ...new Set(allTasks.map(t => t.department).filter(Boolean))];

  const displayedTasks = allTasks.filter(t => {
     // Role Scope Filtering
     let scopeMatch = false;
     if (!loggedInUser) scopeMatch = true; // fallback
     else if (taskScope === "All Tasks" && isAdminOrMD) scopeMatch = true;
     else if (taskScope === "My Tasks") scopeMatch = t.assignee_id && t.assignee_id.includes(loggedInUser.id);
     else if (taskScope === "Given Tasks") scopeMatch = t.creator_id === loggedInUser.id;
     
     if (!scopeMatch) return false;

     // Search Bar Filtering
     const term = searchTerm.toLowerCase();
     const matchesSearch = !term || (
            (t.title && t.title.toLowerCase().includes(term)) || 
            (t.description && t.description.toLowerCase().includes(term)) ||
            (t.assignee_name && t.assignee_name.toLowerCase().includes(term)) ||
            (t.client_name && t.client_name.toLowerCase().includes(term)) ||
            (t.project_name && t.project_name.toLowerCase().includes(term))
     );

     // Dropdown Filtering
     const matchesModule = filterModule === "All Modules" || t.module === filterModule;
     const matchesStatus = filterStatus === "All Statuses" || t.status === filterStatus;
     const matchesPriority = filterPriority === "All Priorities" || t.priority === filterPriority;
     const matchesDept = filterDept === "All Departments" || t.department === filterDept;

     return matchesSearch && matchesModule && matchesStatus && matchesPriority && matchesDept;
  });"""
c = c.replace(old_displayed, new_displayed)

# 3. Update the UI Block
old_ui = """           <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
              <div className="relative w-full sm:w-[250px]">
                <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#64748B] dark:text-gray-400 text-xl" />
                <input type="text" placeholder="Search task, client, employee..." className="w-full pl-10 pr-4 h-10 rounded-[10px] bg-gray-50 border border-transparent text-[13px] outline-none focus:bg-white dark:bg-navy-800 focus:border-[#2563EB] transition-colors" />
              </div>
              {["Module", "Department", "Employee", "Client", "Project", "Status"].map(f => (
                 <select key={f} className="h-10 px-3 rounded-[10px] border border-[#E2E8F0] dark:border-navy-700 text-[12px] font-medium text-[#475569] dark:text-gray-200 bg-white dark:bg-navy-800 outline-none hover:border-[#2563EB] cursor-pointer">
                    <option>{f}</option>
                 </select>
              ))}
              <div className="flex gap-2 ml-auto sm:ml-2">
                 <button className="text-[12px] font-bold text-[#64748B] dark:text-gray-400 hover:text-[#0F172A] dark:text-white">Reset</button>
                 <button className="text-[12px] font-bold text-[#2563EB] hover:underline">Save Filter</button>
              </div>
           </div>"""
new_ui = """           <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
              <div className="relative flex-1 min-w-[200px] max-w-[400px]">
                <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#64748B] dark:text-gray-400 text-xl" />
                <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search task, client, employee..." className="w-full pl-10 pr-4 h-10 rounded-[10px] bg-gray-50 border border-transparent text-[13px] outline-none focus:bg-white dark:bg-navy-800 focus:border-[#2563EB] transition-colors" />
              </div>
              
              <select value={filterModule} onChange={e => setFilterModule(e.target.value)} className="h-10 px-3 rounded-[10px] border border-[#E2E8F0] dark:border-navy-700 text-[12px] font-medium text-[#475569] dark:text-gray-200 bg-white dark:bg-navy-800 outline-none hover:border-[#2563EB] cursor-pointer">
                 {uniqueModules.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="h-10 px-3 rounded-[10px] border border-[#E2E8F0] dark:border-navy-700 text-[12px] font-medium text-[#475569] dark:text-gray-200 bg-white dark:bg-navy-800 outline-none hover:border-[#2563EB] cursor-pointer">
                 {uniqueStatuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              
              <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="h-10 px-3 rounded-[10px] border border-[#E2E8F0] dark:border-navy-700 text-[12px] font-medium text-[#475569] dark:text-gray-200 bg-white dark:bg-navy-800 outline-none hover:border-[#2563EB] cursor-pointer">
                 {uniquePriorities.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              
              <select value={filterDept} onChange={e => setFilterDept(e.target.value)} className="h-10 px-3 rounded-[10px] border border-[#E2E8F0] dark:border-navy-700 text-[12px] font-medium text-[#475569] dark:text-gray-200 bg-white dark:bg-navy-800 outline-none hover:border-[#2563EB] cursor-pointer">
                 {uniqueDepts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>

              <div className="flex gap-2 ml-auto sm:ml-2">
                 <button onClick={() => { setSearchTerm(""); setFilterModule("All Modules"); setFilterStatus("All Statuses"); setFilterPriority("All Priorities"); setFilterDept("All Departments"); }} className="text-[12px] font-bold text-[#64748B] dark:text-gray-400 hover:text-[#0F172A] dark:text-white">Reset</button>
              </div>
           </div>"""
c = c.replace(old_ui, new_ui)

with open('crm/src/views/admin/tasks/index.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
