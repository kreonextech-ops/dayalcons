const fs = require('fs');
let code = fs.readFileSync('src/views/admin/crm/components/TabTasks.jsx', 'utf8');

code = code.replace(
  '<div key={task.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">',
  '<div key={task.id} onClick={(e) => { if(e.target.tagName !== \'SELECT\' && e.target.tagName !== \'OPTION\') window.location.href = `/admin/tasks?taskId=${task.id}`; }} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow">'
);

code = code.replace(
  '<a href={`/admin/tasks?taskId=${task.id}`} className="text-brand-500 hover:underline">{task.name}</a>',
  '<span className="text-brand-500">{task.name}</span>'
);

// We should replace all instances just in case.
// Actually, it maps over columns, so there's only one map block in TabTasks.jsx.
fs.writeFileSync('src/views/admin/crm/components/TabTasks.jsx', code);
