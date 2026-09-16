import sys
import re

# LEAD
with open('crm/src/views/admin/crm/index.jsx', 'r') as f:
    lead_content = f.read()

lead_pattern = re.compile(r'<select value={newLead\.service_type}.*?</select>', re.DOTALL)
lead_replacement = """<div className="flex flex-col gap-2 max-h-48 overflow-y-auto p-2 border rounded-[10px] dark:border-navy-700 custom-scrollbar">
                        <div className="text-xs font-bold text-brand-500 mb-1">Services</div>
                        {DESIGN_SERVICES.map(s => (
                           <label key={s.id} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-navy-700 p-1 rounded">
                              <input type="checkbox" checked={Array.isArray(newLead.service_type) && newLead.service_type.includes(s.id)} onChange={(e) => {
                                 let st = Array.isArray(newLead.service_type) ? [...newLead.service_type] : [];
                                 if (e.target.checked) st.push(s.id);
                                 else st = st.filter(x => x !== s.id);
                                 setNewLead({...newLead, service_type: st});
                              }} /> {s.id}
                           </label>
                        ))}
                        <div className="text-xs font-bold text-brand-500 mt-2 mb-1">Projects</div>
                        {EXECUTION_PROJECTS.map(p => (
                           <label key={p.id} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-navy-700 p-1 rounded">
                              <input type="checkbox" checked={Array.isArray(newLead.service_type) && newLead.service_type.includes(p.id)} onChange={(e) => {
                                 let st = Array.isArray(newLead.service_type) ? [...newLead.service_type] : [];
                                 if (e.target.checked) st.push(p.id);
                                 else st = st.filter(x => x !== p.id);
                                 setNewLead({...newLead, service_type: st});
                              }} /> {p.id}
                           </label>
                        ))}
                    </div>"""

lead_content = lead_pattern.sub(lead_replacement, lead_content)

with open('crm/src/views/admin/crm/index.jsx', 'w') as f:
    f.write(lead_content)


# CLIENT
with open('crm/src/views/admin/clients/index.jsx', 'r') as f:
    client_content = f.read()

client_pattern = re.compile(r'<input[^>]*value={newClient\.work_types}[^>]*>', re.DOTALL)
client_replacement = """<div className="flex flex-col gap-2 max-h-48 overflow-y-auto p-2 border rounded-[10px] dark:border-navy-700 custom-scrollbar">
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
                    </div>"""
client_content = client_pattern.sub(client_replacement, client_content)

with open('crm/src/views/admin/clients/index.jsx', 'w') as f:
    f.write(client_content)

print("Replaced forms")
