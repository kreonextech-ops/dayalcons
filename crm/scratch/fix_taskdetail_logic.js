const fs = require('fs');
let code = fs.readFileSync('src/views/admin/tasks/TaskDetail.jsx', 'utf8');

// 1. Fix employees query
code = code.replace(
    /await supabase\.from\('employees'\)\.select\('id, name, employee_id'\);/,
    "await supabase.from('employees').select('id, name');"
);

// 2. Make Priority editable via Dropdown
if (!code.includes('handlePriorityChange')) {
    code = code.replace(
      'const handleAssigneeChange',
      `const handlePriorityChange = async (e) => {
         const newPriority = e.target.value;
         await supabase.from('tasks').update({ priority: newPriority }).eq('id', task.id);
         task.priority = newPriority;
         setContextData(prev => ({...prev}));
      };
      const handleAssigneeChange`
    );
    
    code = code.replace(
       /<p className="text-\[\#64748B\]">Priority: <b className="text-\[\#0F172A\]">\{taskData\.priority\}<\/b><\/p>/,
       `<div className="flex items-center gap-1">
           <span className="text-[#64748B]">Priority:</span>
           <select 
              value={task.priority || "Low"}
              onChange={handlePriorityChange}
              className="bg-transparent border-b border-dashed border-gray-400 text-[#0F172A] font-bold text-[13px] outline-none cursor-pointer pb-0.5"
           >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
           </select>
        </div>`
    );
}

// 3. Fix "Project/Service ID" display instead of Name for Project/Service
// First for contextData.project.name -> ID + Name
code = code.replace(
   /<a href=\{\`\/admin\/projects\?projectId=\$\{contextData\.project\.id\}\`\} className="text-\[13px\] font-bold text-\[\#0F172A\] hover:text-\[\#2563EB\] truncate inline-block w-full">\{contextData\.project\.name\}<\/a>/g,
   '<a href={`/admin/projects?projectId=${contextData.project.id}`} className="text-[13px] font-bold text-[#0F172A] hover:text-[#2563EB] truncate inline-block w-full">PRJ-{contextData.project.id.substring(0,5).toUpperCase()}</a>'
);

code = code.replace(
   /<a href=\{\`\/admin\/services\?serviceId=\$\{contextData\.service\.id\}\`\} className="text-\[13px\] font-bold text-\[\#0F172A\] hover:text-\[\#2563EB\] truncate inline-block w-full">\{contextData\.service\.title\}<\/a>/g,
   '<a href={`/admin/services?serviceId=${contextData.service.id}`} className="text-[13px] font-bold text-[#0F172A] hover:text-[#2563EB] truncate inline-block w-full">SRV-{contextData.service.id.substring(0,5).toUpperCase()}</a>'
);

fs.writeFileSync('src/views/admin/tasks/TaskDetail.jsx', code);
