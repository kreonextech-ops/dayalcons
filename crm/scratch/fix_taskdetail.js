const fs = require('fs');
let code = fs.readFileSync('src/views/admin/tasks/TaskDetail.jsx', 'utf8');

// Fix the Linked Client resolution:
const clientResolutionCode = `
      if (task?.client_id) {
         const { data } = await supabase.from('clients').select('id, name, clientName').eq('id', task.client_id).single();
         if (data) dataObj.client = { ...data, name: data.name || data.clientName };
      }
`;

code = code.replace(/if \(task\?\.client_id\) \{[\s\S]*?if \(data\) dataObj\.client = data;\n\s*\}/, clientResolutionCode);

// Modify the rendering of "Linked Client" string block in Header
// It currently is: taskData.client (which is the UUID). Let's use contextData.client?.name.
code = code.replace(/<p className="text-\[13px\] font-bold text-\[\#0F172A\]">\{taskData\.client\}<\/p>/g, 
  `<p className="text-[13px] font-bold text-[#0F172A]">{contextData.client?.name || contextData.lead?.name || contextData.project?.name || contextData.service?.title || taskData.client}</p>`);

// Also change the literal text from "Linked Client" to "Linked Record" to be robust
code = code.replace(/<p className="text-\[10px\] font-bold text-\[\#64748B\] uppercase mb-1">Linked Client<\/p>/g,
  `<p className="text-[10px] font-bold text-[#64748B] uppercase mb-1">Linked {taskData.module === "Client" ? "Client" : taskData.module}</p>`);

// Add an inline edit modal for Task Title & Description
// 1. Add state variable
code = code.replace('const [activeTab, setActiveTab] = useState("Overview");', 
  'const [activeTab, setActiveTab] = useState("Overview");\n    const [showEditModal, setShowEditModal] = useState(false);\n    const [editForm, setEditForm] = useState({ title: "", description: "", due_date: "" });\n    const handleEditSave = async () => {\n       await supabase.from("tasks").update({ title: editForm.title, description: editForm.description, due_date: editForm.due_date }).eq("id", task.id);\n       window.location.reload();\n    };');

// 2. Wire up the Edit button
code = code.replace(/<button className="flex-1 md:flex-none h-10 px-4 rounded-lg border border-\[\#E2E8F0\] text-\[13px\] font-bold text-\[\#0F172A\] hover:bg-gray-50 flex items-center justify-center gap-2"><MdEdit \/> Edit<\/button>/g,
  `<button onClick={() => { setEditForm({ title: task.title, description: task.description, due_date: task.due_date }); setShowEditModal(true); }} className="flex-1 md:flex-none h-10 px-4 rounded-lg border border-[#E2E8F0] text-[13px] font-bold text-[#0F172A] hover:bg-gray-50 flex items-center justify-center gap-2"><MdEdit /> Edit</button>`);

// 3. Inject Modal UI at the bottom of the root div
const editModalUi = `
      {showEditModal && (
         <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-[20px] p-6 w-full max-w-md shadow-lg animate-fade-in">
               <h2 className="text-xl font-bold mb-4">Edit Task</h2>
               <div className="space-y-4">
                  <div><label className="block text-xs font-bold text-gray-500 mb-1">Title</label><input type="text" className="w-full h-10 px-3 rounded-lg border border-gray-300 outline-none focus:border-blue-500" value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} /></div>
                  <div><label className="block text-xs font-bold text-gray-500 mb-1">Description</label><textarea className="w-full p-3 rounded-lg border border-gray-300 outline-none focus:border-blue-500" rows="3" value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})}></textarea></div>
                  <div><label className="block text-xs font-bold text-gray-500 mb-1">Due Date</label><input type="date" className="w-full h-10 px-3 rounded-lg border border-gray-300 outline-none focus:border-blue-500" value={editForm.due_date || ""} onChange={e => setEditForm({...editForm, due_date: e.target.value})} /></div>
               </div>
               <div className="flex justify-end gap-3 mt-6">
                  <button onClick={() => setShowEditModal(false)} className="px-4 py-2 bg-gray-100 text-gray-600 font-bold rounded-lg hover:bg-gray-200">Cancel</button>
                  <button onClick={handleEditSave} className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">Save Changes</button>
               </div>
            </div>
         </div>
      )}
`;

code = code.replace(/<\/div>\n  \);\n\n  function activeView/g, `${editModalUi}    </div>\n  );\n\n  function activeView`);

fs.writeFileSync('src/views/admin/tasks/TaskDetail.jsx', code);
