const fs = require('fs');
let code = fs.readFileSync('src/views/admin/tasks/TaskDetail.jsx', 'utf8');

// 1. Add employee state and fetch logic if missing
if (!code.includes('const [employees, setEmployees]')) {
    code = code.replace(
      'const [contextData, setContextData]',
      'const [employees, setEmployees] = useState([]);\n    const [contextData, setContextData]'
    );
}

if (!code.includes("await supabase.from('employees')")) {
    code = code.replace(
      'const dataObj = {};',
      `const dataObj = {};\n        const { data: emps } = await supabase.from('employees').select('id, name, employee_id');\n        if (emps) setEmployees(emps);`
    );
}

// 2. Add handleAssigneeChange function
if (!code.includes('handleAssigneeChange')) {
    code = code.replace(
      'const handleTitleSave',
      `const handleAssigneeChange = async (e) => {
         const newId = e.target.value;
         await supabase.from('tasks').update({ assignee_id: newId }).eq('id', task.id);
         const selectedEmp = employees.find(emp => emp.id === newId);
         if (selectedEmp) {
            task.assignee_id = newId;
            task.assigneeName = selectedEmp.name;
            task.assignee = { name: selectedEmp.name };
         }
         // optimistic ui update hack - trigger re-render
         setContextData(prev => ({...prev}));
      };
      const handleTitleSave`
    );
}

// 3. Rebuild the Right Info div completely
const startIdx = code.indexOf('{/* Right Info */}');
const endIdx = code.indexOf('{/* Actions */}');

if (startIdx !== -1 && endIdx !== -1) {
    const newRightInfo = `{/* Right Info */}
             <div className="flex flex-wrap md:flex-nowrap gap-6 md:gap-8 bg-gray-50 p-4 rounded-xl border border-gray-100 min-w-0">
                <div className="min-w-[120px]">
                   <p className="text-[10px] font-bold text-[#64748B] uppercase mb-1">Assigned To</p>
                   <select 
                      value={task.assignee_id || ""}
                      onChange={handleAssigneeChange}
                      className="bg-transparent text-[13px] font-bold text-[#2563EB] outline-none cursor-pointer w-full border-b border-dashed border-blue-300 pb-0.5"
                   >
                      <option value="">Select Employee...</option>
                      {employees.map(emp => (
                         <option key={emp.id} value={emp.id}>{emp.name}</option>
                      ))}
                   </select>
                </div>
                
                {(contextData.client || contextData.lead || contextData.project || contextData.service) && (
                   <div className="w-px h-10 bg-gray-200 hidden md:block"></div>
                )}
                
                {/* Dynamically show Linked Records */}
                {contextData.client && !contextData.project && !contextData.service && (
                   <div className="min-w-0">
                      <p className="text-[10px] font-bold text-[#64748B] uppercase mb-1">Linked Client</p>
                      <a href={\`/admin/clients?clientId=\${contextData.client.id}\`} className="text-[13px] font-bold text-[#0F172A] hover:text-[#2563EB] truncate inline-block w-full">{contextData.client.name}</a>
                   </div>
                )}

                {contextData.lead && (
                   <div className="min-w-0">
                      <p className="text-[10px] font-bold text-[#64748B] uppercase mb-1">Linked Lead</p>
                      <a href={\`/admin/crm?leadId=\${contextData.lead.id}\`} className="text-[13px] font-bold text-[#0F172A] hover:text-[#2563EB] truncate inline-block w-full">{contextData.lead.name}</a>
                   </div>
                )}

                {contextData.project && (
                   <>
                      {contextData.client && (
                         <>
                            <div className="min-w-0">
                               <p className="text-[10px] font-bold text-[#64748B] uppercase mb-1">Linked Client</p>
                               <a href={\`/admin/clients?clientId=\${contextData.client.id}\`} className="text-[13px] font-bold text-[#0F172A] hover:text-[#2563EB] truncate inline-block w-full">{contextData.client.name}</a>
                            </div>
                            <div className="w-px h-10 bg-gray-200 hidden md:block"></div>
                         </>
                      )}
                      <div className="min-w-0">
                         <p className="text-[10px] font-bold text-[#64748B] uppercase mb-1">Linked Project</p>
                         <a href={\`/admin/projects?projectId=\${contextData.project.id}\`} className="text-[13px] font-bold text-[#0F172A] hover:text-[#2563EB] truncate inline-block w-full">{contextData.project.name}</a>
                      </div>
                   </>
                )}

                {contextData.service && (
                   <>
                      {contextData.client && (
                         <>
                            <div className="min-w-0">
                               <p className="text-[10px] font-bold text-[#64748B] uppercase mb-1">Linked Client</p>
                               <a href={\`/admin/clients?clientId=\${contextData.client.id}\`} className="text-[13px] font-bold text-[#0F172A] hover:text-[#2563EB] truncate inline-block w-full">{contextData.client.name}</a>
                            </div>
                            <div className="w-px h-10 bg-gray-200 hidden md:block"></div>
                         </>
                      )}
                      <div className="min-w-0">
                         <p className="text-[10px] font-bold text-[#64748B] uppercase mb-1">Linked Service</p>
                         <a href={\`/admin/services?serviceId=\${contextData.service.id}\`} className="text-[13px] font-bold text-[#0F172A] hover:text-[#2563EB] truncate inline-block w-full">{contextData.service.title}</a>
                      </div>
                   </>
                )}
             </div>
          </div>
  
          `;
    
    code = code.substring(0, startIdx) + newRightInfo + code.substring(endIdx);
}

fs.writeFileSync('src/views/admin/tasks/TaskDetail.jsx', code);
