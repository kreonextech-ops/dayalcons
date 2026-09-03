const fs = require('fs');
let code = fs.readFileSync('src/views/admin/tasks/TaskDetail.jsx', 'utf8');

// 1. Remove Edit Modal
code = code.replace(/\{showEditModal && \([\s\S]*?\)\}/, '');
code = code.replace(/const \[showEditModal.*?;\n/g, '');
code = code.replace(/const \[editForm.*?;\n/g, '');
code = code.replace(/const handleEditSave = async.*?;\n.*?;\n.*?;\n/g, '');

// 2. Change the Hero Header flex structure
code = code.replace(
  '<div className="flex-1 w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-6">',
  '<div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 w-full min-w-0">'
);

code = code.replace(
  '<div>\n                <div className="flex items-center gap-3 mb-2">',
  '<div className="min-w-0 flex-1">\n                <div className="flex items-start md:items-center gap-3 mb-2 flex-col md:flex-row">'
);

// 3. Fix the title inline edit
code = code.replace(
  'const [activeTab, setActiveTab] = useState("Overview");',
  'const [activeTab, setActiveTab] = useState("Overview");\n    const [isEditingTitle, setIsEditingTitle] = useState(false);\n    const [editTitle, setEditTitle] = useState("");\n    const handleTitleSave = async () => { await supabase.from("tasks").update({ title: editTitle, name: editTitle }).eq("id", task.id); setIsEditingTitle(false); task.title = editTitle; task.name = editTitle; };'
);

code = code.replace(
  '<h1 className="text-[28px] font-bold text-[#0F172A] tracking-tight">{taskData.title}</h1>',
  '{isEditingTitle ? <input type="text" autoFocus onBlur={handleTitleSave} onKeyDown={e => e.key === "Enter" && handleTitleSave()} value={editTitle} onChange={e => setEditTitle(e.target.value)} className="text-[24px] md:text-[28px] font-bold text-[#0F172A] tracking-tight border-b-2 border-blue-500 outline-none bg-transparent w-full max-w-md" /> : <h1 onClick={() => { setEditTitle(taskData.title); setIsEditingTitle(true); }} className="text-[24px] md:text-[28px] font-bold text-[#0F172A] tracking-tight cursor-pointer hover:bg-gray-100 rounded transition break-words" title="Click to edit">{taskData.title}</h1>}'
);

// 4. Update taskData to fallbacks properly
code = code.replace(
  'title: task?.title || "Enter task title",',
  'title: task?.title || task?.name || "Enter task title",'
);

code = code.replace(
  'client: task?.client_id || task?.custom_category || "—",',
  'client: task?.client_id ? (contextData.client?.name || contextData.lead?.name || contextData.project?.name || contextData.service?.title || "Unknown Record") : (task?.custom_category || "—"),'
);

// 5. Update Linked client text
code = code.replace(
  '<p className="text-[13px] font-bold text-[#0F172A]">{contextData.client?.name || contextData.lead?.name || contextData.project?.name || contextData.service?.title || taskData.client}</p>',
  '<p className="text-[13px] font-bold text-[#0F172A] truncate max-w-[120px]" title={taskData.client}>{taskData.client}</p>'
);

// 6. Remove Edit button from actions right side
code = code.replace(
  /<button onClick=\{\(\) => \{ setEditForm[\s\S]*?<\/button>/,
  ''
);

fs.writeFileSync('src/views/admin/tasks/TaskDetail.jsx', code);
