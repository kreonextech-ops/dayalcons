import React, { useState, useEffect } from "react";
import Card from "components/card";
import { MdCheckCircle, MdSchedule, MdWarning, MdDelete } from "react-icons/md";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);

const TabMyTasks = ({ employee }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (employee?.id) {
      fetchTasks();
    }
  }, [employee]);

  const fetchTasks = async () => {
    setLoading(true);
    const { data } = await supabase.from('tasks').select('*').eq('assignee_id', employee.id).order('created_at', { ascending: false });
    if (data) setTasks(data);
    setLoading(false);
  };

  
  const handleDelete = async (taskId) => {
     if(window.confirm('Delete this task?')) {
        await supabase.from('tasks').delete().eq('id', taskId);
        fetchTasks();
     }
  };

  const getPriorityColor = (p) => {
    if (p === 'High') return 'text-red-500 bg-red-50';
    if (p === 'Medium') return 'text-orange-500 bg-orange-50';
    return 'text-blue-500 bg-blue-50';
  };

  return (
    <div className="animate-fade-in relative">
      <div className="flex justify-between items-center mb-6">
         <div>
            <h3 className="text-[18px] font-bold text-[#0F172A]">Employee Tasks & Notifications</h3>
            <p className="text-[13px] text-[#64748B]">Automated notifications and tasks assigned to this employee.</p>
         </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <p className="text-sm text-gray-500">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <Card extra="p-10 text-center border border-dashed border-gray-300 shadow-none">
            <p className="text-gray-500">No tasks or notifications currently assigned.</p>
          </Card>
        ) : (
          tasks.map(task => (
            <Card key={task.id} extra={`p-5 border ${task.status === 'Completed' ? 'border-green-200 bg-green-50/30' : 'border-[#E2E8F0] hover:border-[#2563EB]'} transition shadow-sm`}>
              <div className="flex justify-between items-start gap-4">
                <div className="flex gap-4">
                  <div className={`mt-1 h-6 w-6 rounded-full flex items-center justify-center shrink-0 ${task.status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                    {task.status === 'Completed' ? <MdCheckCircle /> : <MdSchedule />}
                  </div>
                  <div>
                    <h4 className={`text-[15px] font-bold ${task.status === 'Completed' ? 'text-gray-500 line-through' : 'text-[#0F172A]'}`}>{task.name}</h4>
                    {task.description && <p className="text-[13px] text-[#64748B] mt-1">{task.description}</p>}
                    
                    <div className="flex gap-3 mt-3">
                      <span className={`px-2 py-1 rounded-md text-[11px] font-bold ${getPriorityColor(task.priority)}`}>
                        {task.priority || 'Normal'} Priority
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-[11px] font-bold flex items-center gap-1">
                        {task.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[12px] font-bold text-[#64748B] mb-2">{new Date(task.created_at).toLocaleDateString()}</p>
                  <button onClick={() => handleDelete(task.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition inline-flex" title="Delete Task">
                     <MdDelete size={18} />
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default TabMyTasks;
