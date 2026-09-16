import sys
import re

with open('crm/src/views/admin/clients/index.jsx', 'r') as f:
    content = f.read()

services_block = """                  <div>
                    <label className="block text-[12px] font-bold text-[#475569] dark:text-gray-200 dark:text-white mb-1.5 uppercase tracking-wide">Services & Projects</label>
                    <div className="flex flex-col gap-2 max-h-48 overflow-y-auto p-2 border rounded-[10px] dark:border-navy-700 custom-scrollbar">
                        <div className="text-xs font-bold text-brand-500 mb-1">Services</div>
                        {DESIGN_SERVICES.map(s => (
                           <label key={s.id} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-navy-700 p-1 rounded">
                              <input type="checkbox" checked={Array.isArray(newClient.work_types) && newClient.work_types.includes(s.id)} onChange={(e) => {
                                 let st = Array.isArray(newClient.work_types) ? [...newClient.work_types] : [];
                                 if (e.target.checked) st.push(s.id);
                                 else st = st.filter(x => x !== s.id);
                                 setNewClient({...newClient, work_types: st});
                              }} /> {s.id}
                           </label>
                        ))}
                        <div className="text-xs font-bold text-brand-500 mt-2 mb-1">Projects</div>
                        {EXECUTION_PROJECTS.map(p => (
                           <label key={p.id} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-navy-700 p-1 rounded">
                              <input type="checkbox" checked={Array.isArray(newClient.work_types) && newClient.work_types.includes(p.id)} onChange={(e) => {
                                 let st = Array.isArray(newClient.work_types) ? [...newClient.work_types] : [];
                                 if (e.target.checked) st.push(p.id);
                                 else st = st.filter(x => x !== p.id);
                                 setNewClient({...newClient, work_types: st});
                              }} /> {p.id}
                           </label>
                        ))}
                    </div>
                  </div>"""

if 'Services & Projects' not in content:
    # Insert after GST
    target = 'placeholder="Enter tax ID"'
    # find the closing div after target
    pos = content.find(target)
    end_div = content.find('</div>', pos) + 6
    content = content[:end_div] + '\n' + services_block + content[end_div:]
    
    with open('crm/src/views/admin/clients/index.jsx', 'w') as f:
        f.write(content)
    print("Added services block to client form")
