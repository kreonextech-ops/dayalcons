import React, { useState, useEffect } from "react";
import Card from "components/card";
import { MdAdd, MdDelete } from "react-icons/md";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);

const TabChecklist = ({ task }) => {
  const [items, setItems] = useState([]);
  const [newItemText, setNewItemText] = useState("");

  useEffect(() => {
    fetchItems();
  }, [task]);

  const fetchItems = async () => {
    if (!task) return;
    const { data } = await supabase.from('task_checklists').select('*').eq('task_id', task.id).order('created_at', { ascending: true });
    if (data) setItems(data);
  };

  const handleAddItem = async () => {
    if (!newItemText.trim() || !task) return;
    const { data, error } = await supabase.from('task_checklists').insert([{ task_id: task.id, title: newItemText }]).select();
    if (error) {
       alert("Failed to add checklist item: " + error.message);
       return;
    }
    if (data) {
       const userStr = localStorage.getItem("dayal_user");
       const user = userStr ? JSON.parse(userStr) : { name: "Admin" };
       await supabase.from('task_activity_logs').insert([{
          task_id: task.id,
          employee_name: user.name || "Admin",
          activity_type: "Checklist",
          description: `Added checklist item: "${newItemText}"`
       }]);

       setItems([...items, data[0]]);
       setNewItemText("");
    }
  };

  const handleToggle = async (id, currentVal, title) => {
    // optimistic UI update
    setItems(items.map(i => i.id === id ? { ...i, is_completed: !currentVal } : i));
    await supabase.from('task_checklists').update({ is_completed: !currentVal }).eq('id', id);

    const userStr = localStorage.getItem("dayal_user");
    const user = userStr ? JSON.parse(userStr) : { name: "Admin" };
    await supabase.from('task_activity_logs').insert([{
       task_id: task.id,
       employee_name: user.name || "Admin",
       activity_type: "Checklist",
       description: `Marked item "${title}" as ${!currentVal ? 'Completed' : 'Incomplete'}`
    }]);
  };

  const handleDelete = async (id) => {
    setItems(items.filter(i => i.id !== id));
    await supabase.from('task_checklists').delete().eq('id', id);
  };

  return (
    <div className="animate-fade-in max-w-3xl">
       <div className="flex justify-between items-center mb-6">
         <div>
            <h3 className="text-[18px] font-bold text-[#0F172A]">Steps to Do</h3>
            <p className="text-[13px] text-[#64748B]">Add steps that anyone can track and complete.</p>
         </div>
       </div>

       <Card extra="border border-[#E2E8F0] overflow-hidden shadow-sm p-6 mb-6">
          <div className="flex gap-2 mb-6">
             <input 
                type="text" 
                value={newItemText} 
                onChange={e => setNewItemText(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && handleAddItem()}
                placeholder="What needs to be done?" 
                className="flex-1 h-10 px-4 rounded-lg border border-gray-300 text-[14px] outline-none focus:border-blue-500" 
             />
             <button onClick={handleAddItem} className="flex items-center gap-1 bg-[#2563EB] text-white px-4 h-10 rounded-lg text-[13px] font-bold shadow-sm hover:bg-[#1D4ED8] whitespace-nowrap">
                <MdAdd /> Add Item
             </button>
          </div>

          <div className="space-y-3">
             {items.length === 0 ? (
                <p className="text-[14px] text-gray-400 text-center py-4">No items added yet.</p>
             ) : (
                items.map(item => (
                   <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition">
                      <div className="flex items-center gap-3">
                         <input 
                            type="checkbox" 
                            checked={item.is_completed} 
                            onChange={() => handleToggle(item.id, item.is_completed, item.title)} 
                            className="w-4 h-4 cursor-pointer text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                         />
                         <span className={`text-[14px] font-medium ${item.is_completed ? 'text-gray-400 line-through' : 'text-[#0F172A]'}`}>
                            {item.title}
                         </span>
                      </div>
                      <button onClick={() => handleDelete(item.id)} className="text-gray-400 hover:text-red-500 p-1">
                         <MdDelete />
                      </button>
                   </div>
                ))
             )}
          </div>
       </Card>
    </div>
  );
};

export default TabChecklist;
