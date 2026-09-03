const fs = require('fs');
let code = fs.readFileSync('src/views/admin/employees/components/TabMyTasks.jsx', 'utf8');

code = code.replace('MdWarning } from "react-icons/md";', 'MdWarning, MdDelete } from "react-icons/md";');

const deleteLogic = `
  const handleDelete = async (taskId) => {
     if(window.confirm('Delete this task?')) {
        await supabase.from('tasks').delete().eq('id', taskId);
        fetchTasks();
     }
  };`;
code = code.replace('const getPriorityColor', deleteLogic + '\n\n  const getPriorityColor');

const dateRender = /<p className="text-\[12px\] font-bold text-\[#64748B\]">\{new Date\(task\.created_at\)\.toLocaleDateString\(\)\}<\/p>/;
const newDateRender = `<p className="text-[12px] font-bold text-[#64748B] mb-2">{new Date(task.created_at).toLocaleDateString()}</p>
                  <button onClick={() => handleDelete(task.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition inline-flex" title="Delete Task">
                     <MdDelete size={18} />
                  </button>`;
                  
code = code.replace(dateRender, newDateRender);
fs.writeFileSync('src/views/admin/employees/components/TabMyTasks.jsx', code);
