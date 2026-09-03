const fs = require('fs');
let code = fs.readFileSync('src/views/admin/tasks/TaskDetail.jsx', 'utf8');

const startIdx = code.indexOf('{/* Right Info */}');
const endIdx = code.indexOf('{/* Actions */}');

if (startIdx !== -1 && endIdx !== -1) {
    const newRightInfo = `{/* Right Info */}
             <div className="flex flex-wrap md:flex-nowrap gap-6 md:gap-8 bg-gray-50 p-4 rounded-xl border border-gray-100 min-w-0">
                <div className="min-w-[150px]">
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
                {(contextData.client || contextData.lead || contextData.project || contextData.service) && (
                   <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold text-[#64748B] uppercase mb-1">Linked To</p>
                      <div className="text-[13px] font-bold text-[#0F172A] truncate flex items-center gap-1.5 flex-wrap">
                         {contextData.project ? (
                            <>
                               {contextData.client && (
                                  <>Client: <a href={\`/admin/clients?clientId=\${contextData.client.id}\`} className="text-[#2563EB] hover:underline mr-1">{contextData.client.name}</a> &bull;</>
                               )}
                               Project ID: <a href={\`/admin/projects?projectId=\${contextData.project.id}\`} className="text-[#2563EB] hover:underline">PRJ-{contextData.project.id.substring(0,5).toUpperCase()}</a>
                            </>
                         ) : contextData.service ? (
                            <>
                               {contextData.client && (
                                  <>Client: <a href={\`/admin/clients?clientId=\${contextData.client.id}\`} className="text-[#2563EB] hover:underline mr-1">{contextData.client.name}</a> &bull;</>
                               )}
                               Service ID: <a href={\`/admin/services?serviceId=\${contextData.service.id}\`} className="text-[#2563EB] hover:underline">SER-{contextData.service.id.substring(0,5).toUpperCase()}</a>
                            </>
                         ) : contextData.lead ? (
                            <>Lead: <a href={\`/admin/crm?leadId=\${contextData.lead.id}\`} className="text-[#2563EB] hover:underline">{contextData.lead.name}</a></>
                         ) : contextData.client ? (
                            <>Client: <a href={\`/admin/clients?clientId=\${contextData.client.id}\`} className="text-[#2563EB] hover:underline">{contextData.client.name}</a></>
                         ) : null}
                      </div>
                   </div>
                )}
             </div>
          </div>
  
          `;
    
    code = code.substring(0, startIdx) + newRightInfo + code.substring(endIdx);
    fs.writeFileSync('src/views/admin/tasks/TaskDetail.jsx', code);
}
