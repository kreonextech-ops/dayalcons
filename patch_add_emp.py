with open('crm/src/views/admin/employees/index.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Add availableRoles state
idx_state = c.find('const [availableDesigs, setAvailableDesigs] = useState([]);')
c = c[:idx_state] + 'const [availableDesigs, setAvailableDesigs] = useState([]);\n  const [availableRoles, setAvailableRoles] = useState([]);\n' + c[idx_state + len('const [availableDesigs, setAvailableDesigs] = useState([]);'):]

# Fix useEffect
old_effect = """  useEffect(() => {
     const depts = localStorage.getItem("dayal_departments");
     if (depts) setAvailableDepts(JSON.parse(depts));
     const desigs = localStorage.getItem("dayal_designations");
     if (desigs) setAvailableDesigs(JSON.parse(desigs));
  }, [showNewModal]);"""
new_effect = """  useEffect(() => {
     if (showNewModal) {
         supabase.from('departments').select('name').then(({data}) => { if (data) setAvailableDepts(data); });
         supabase.from('designations').select('title').then(({data}) => { if (data) setAvailableDesigs(data); });
         supabase.from('roles').select('name').then(({data}) => { if (data) setAvailableRoles(data); });
     }
  }, [showNewModal]);"""
c = c.replace(old_effect, new_effect)

# Update Step 2 JSX to include Role
old_step2 = """                           <div>
                              <label className="block text-[11px] font-bold text-[#475569] mb-1.5 uppercase">Employment Type</label>
                              <select value={newEmp.empType} onChange={(e) => setNewEmp({...newEmp, empType: e.target.value})} className="w-full h-11 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none bg-white focus:border-[#2563EB]">
                                 <option value="">Select Type</option>
                                 <option value="Full-time">Full-time</option>
                                 <option value="Part-time">Part-time</option>
                                 <option value="Contract">Contract</option>
                              </select>
                           </div>"""
new_step2 = """                           <div>
                              <label className="block text-[11px] font-bold text-[#475569] mb-1.5 uppercase">System Role</label>
                              <select value={newEmp.role} onChange={(e) => setNewEmp({...newEmp, role: e.target.value})} className="w-full h-11 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none bg-white focus:border-[#2563EB]">
                                 <option value="">Select Role</option>
                                 {availableRoles.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
                              </select>
                           </div>
                           <div>
                              <label className="block text-[11px] font-bold text-[#475569] mb-1.5 uppercase">Employment Type</label>
                              <select value={newEmp.empType} onChange={(e) => setNewEmp({...newEmp, empType: e.target.value})} className="w-full h-11 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none bg-white focus:border-[#2563EB]">
                                 <option value="">Select Type</option>
                                 <option value="Full-time">Full-time</option>
                                 <option value="Part-time">Part-time</option>
                                 <option value="Contract">Contract</option>
                              </select>
                           </div>"""
c = c.replace(old_step2, new_step2)

with open('crm/src/views/admin/employees/index.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
