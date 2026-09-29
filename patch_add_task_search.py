import re

with open('crm/src/views/admin/tasks/index.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Add state variables for search terms in the modal
state_injection = """  const [newTask, setNewTask] = useState(initialTaskState);

  const [recordSearchTerm, setRecordSearchTerm] = useState("");
  const [empSearchTerm, setEmpSearchTerm] = useState("");"""
c = c.replace('  const [newTask, setNewTask] = useState(initialTaskState);', state_injection)

# 2. Reset search terms when modal closes
c = c.replace(
    'setNewTask(initialTaskState); setShowNewModal(false);',
    'setNewTask(initialTaskState); setRecordSearchTerm(""); setEmpSearchTerm(""); setShowNewModal(false);'
)
c = c.replace(
    'setNewTask(initialTaskState);\n     setModalStep(1);\n     setShowNewModal(false);',
    'setNewTask(initialTaskState);\n     setRecordSearchTerm("");\n     setEmpSearchTerm("");\n     setModalStep(1);\n     setShowNewModal(false);'
)

# 3. Patch Step 2 (Record Search)
old_step2_search = """                                 <input 
                                    type="text" 
                                    onChange={(e) => {
                                       const val = e.target.value.toLowerCase();
                                       const filtered = (availableRecords || []).filter(r => (r.name || r.projectName || r.clientName || r.leadName || r.title || "").toLowerCase().includes(val));
                                       // We can use a local state or just inline it, but since we don't have local state, let's use DOM tricks or add state.
                                       // Actually, let's just use a local state in the component. Wait, I can't easily add state hook inside the JSX. 
                                    }}
                                    placeholder={`Search existing ${newTask.module}s in database...`} 
                                    className="w-full h-14 pl-12 pr-4 rounded-xl border-2 border-[#E2E8F0] dark:border-navy-700 text-[15px] outline-none focus:border-[#2563EB] transition shadow-sm" 
                                    title={`You MUST select an existing ${newTask.module} from the database.`}
                                 />"""
new_step2_search = """                                 <input 
                                    type="text" 
                                    value={recordSearchTerm}
                                    onChange={(e) => setRecordSearchTerm(e.target.value)}
                                    placeholder={`Search existing ${newTask.module}s in database...`} 
                                    className="w-full h-14 pl-12 pr-4 rounded-xl border-2 border-[#E2E8F0] dark:border-navy-700 text-[15px] outline-none focus:border-[#2563EB] transition shadow-sm" 
                                    title={`You MUST select an existing ${newTask.module} from the database.`}
                                 />"""
c = c.replace(old_step2_search, new_step2_search)

old_step2_map = """                                    availableRecords.map(rec => ("""
new_step2_map = """                                    availableRecords.filter(r => {
                                        if(!recordSearchTerm) return true;
                                        const val = recordSearchTerm.toLowerCase();
                                        return (r.name || r.projectName || r.clientName || r.leadName || r.title || "").toLowerCase().includes(val);
                                    }).map(rec => ("""
c = c.replace(old_step2_map, new_step2_map)

# 4. Patch Step 3 (Employee Search)
old_step3_search = """<input type="text" placeholder="Search employee..." className="w-full h-14 pl-12 pr-4 rounded-xl border-2 border-[#E2E8F0] dark:border-navy-700 text-[15px] outline-none focus:border-[#2563EB] transition shadow-sm" />"""
new_step3_search = """<input type="text" value={empSearchTerm} onChange={(e) => setEmpSearchTerm(e.target.value)} placeholder="Search employee..." className="w-full h-14 pl-12 pr-4 rounded-xl border-2 border-[#E2E8F0] dark:border-navy-700 text-[15px] outline-none focus:border-[#2563EB] transition shadow-sm" />"""
c = c.replace(old_step3_search, new_step3_search)

old_step3_map = """                                   if (isStandard) {
                                      validEmps = validEmps.filter(e => e.id === currentUser.id);
                                   }

                                   return validEmps.map(emp => ("""
new_step3_map = """                                   if (isStandard) {
                                      validEmps = validEmps.filter(e => e.id === currentUser.id);
                                   }
                                   if (empSearchTerm) {
                                      const term = empSearchTerm.toLowerCase();
                                      validEmps = validEmps.filter(e => 
                                         (e.name && e.name.toLowerCase().includes(term)) || 
                                         (e.designation && e.designation.toLowerCase().includes(term)) || 
                                         (e.department && e.department.toLowerCase().includes(term))
                                      );
                                   }

                                   return validEmps.map(emp => ("""
c = c.replace(old_step3_map, new_step3_map)

with open('crm/src/views/admin/tasks/index.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
