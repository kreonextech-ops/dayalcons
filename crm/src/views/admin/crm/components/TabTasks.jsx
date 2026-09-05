import React, { useState, useEffect } from "react";
import Card from "components/card";
import { MdFilterList, MdAdd, MdClose, MdCheckCircle } from "react-icons/md";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);

const TabTasks = ({ leadData, isClient = false, entityType, entityId }) => {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    if (leadData?.id) fetchTasks();
    fetchEmployees();
  }, [leadData?.id]);

  const fetchTasks = async () => {
    setLoading(true);
    let query = supabase.from('tasks').select('*');
    if (entityType === 'service' && entityId) { query = query.eq('service_id', entityId); }
    else if (entityType === 'project' && entityId) { query = query.eq('project_id', entityId); }
    else { query = query.eq(isClient ? 'client_id' : 'lead_id', leadData.id); }
    
    const { data } = await query.order('created_at', { ascending: false });
    if (data) setTasks(data);
    setLoading(false);
  };
  
  const fetchEmployees = async () => {
    const { data } = await supabase.from('employees').select('id, name');
    if (data) setEmployees(data);
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const due_date = formData.get('due_date');
    const priority = formData.get('priority');
    const status = formData.get('status');
    const assignee_id = formData.get('assignee_id');
    
    const userStr = localStorage.getItem('dayal_user');
    const loggedInUser = userStr ? JSON.parse(userStr) : null;
    
    const { error } = await supabase.from('tasks').insert([{
      name,
      due_date: due_date || null,
      priority,
      status,
      assignee_id: assignee_id || null,
      lead_id: isClient ? null : leadData.id,
      client_id: isClient ? leadData.id : null,
      service_id: entityType === 'service' ? entityId : null,
      project_id: entityType === 'project' ? entityId : null,
      creator_id: loggedInUser?.id,
      category: 'General'
    }]);
    
    if (error) {
       alert('Failed to create task: ' + error.message);
    } else {
       setShowModal(false);
       fetchTasks();
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    const { error } = await supabase.from('tasks').update({ status: newStatus }).eq('id', taskId);
    if (!error) fetchTasks();
  };

  const renderColumn = (statusValue, title) => {
    const columnTasks = tasks.filter(t => t.status === statusValue);
    return (
      <div className="flex-1 bg-[#F1F5F9] rounded-[20px] p-4 flex flex-col gap-4 min-w-[250px] min-h-[400px]">
        <div className="flex justify-between items-center px-2">
          <h3 className="font-bold text-[#0F172A]">{title}</h3>
          <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs font-bold">{columnTasks.length}</span>
        </div>
        {columnTasks.length === 0 && (
          <div className="text-center py-12 text-sm text-gray-400 italic">No tasks</div>
        )}
        {columnTasks.map(task => (
          <div key={task.id} onClick={(e) => { if(e.target.tagName !== 'SELECT' && e.target.tagName !== 'OPTION') window.location.href = `/admin/tasks?taskId=${task.id}`; }} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow">
             <div className="flex justify-between items-start mb-2">
               <h4 className="text-sm font-bold text-gray-800">
                 <span className="text-brand-500">{task.name}</span>
               </h4>
             </div>
             {task.due_date && <p className="text-xs text-gray-500 mb-2">Due: {new Date(task.due_date).toLocaleDateString('en-GB')}</p>}
             <div className="flex justify-between items-center mt-3">
                <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase ${task.priority === 'High' ? 'bg-red-50 text-red-600' : task.priority === 'Medium' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                  {task.priority || 'Normal'}
                </span>
                <select 
                  className="text-xs border border-gray-200 rounded p-1 outline-none text-gray-600"
                  value={task.status}
                  onChange={(e) => handleStatusChange(task.id, e.target.value)}
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Needs Approval">Needs Approval</option>
                  <option value="Completed">Completed</option>
                </select>
             </div>
          </div>
        ))}
      </div>
    );
  };

  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'Completed').length;
  const pending = total - completed;
  const completePct = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
               <h2 className="text-xl font-bold text-[#0F172A]">New Task</h2>
               <MdClose className="text-2xl text-[#64748B] cursor-pointer hover:text-red-500" onClick={() => setShowModal(false)} />
            </div>
            
            <form onSubmit={handleCreateTask}>
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700">Task Name</label>
                <input type="text" name="name" className="w-full mt-1 p-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500" required />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <select name="status" className="w-full mt-1 p-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500">
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Priority</label>
                  <select name="priority" className="w-full mt-1 p-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500">
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700">Due Date</label>
                <input type="date" name="due_date" className="w-full mt-1 p-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500" />
              </div>
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700">Assignee</label>
                <select name="assignee_id" className="w-full mt-1 p-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500">
                  <option value="">Unassigned</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-[20px] font-semibold text-[#0F172A]">Lead Tasks</h2>
        <div className="flex gap-3">
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 h-10 px-4 rounded-[10px] bg-[#2563EB] font-bold text-white hover:opacity-90 transition shadow-sm">
            <MdAdd className="text-lg" /> New Task
          </button>
        </div>
      </div>

      {/* Progress Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card extra="p-5 flex justify-between items-center">
          <div>
            <p className="text-xs font-semibold text-[#64748B] uppercase">Total Tasks</p>
            <p className="text-[24px] font-bold text-[#0F172A]">{total}</p>
          </div>
          <div className="text-[#2563EB] font-bold text-sm bg-blue-50 px-3 py-1 rounded-full">100%</div>
        </Card>
        <Card extra="p-5 flex justify-between items-center">
          <div>
            <p className="text-xs font-semibold text-[#64748B] uppercase">Pending</p>
            <p className="text-[24px] font-bold text-[#F59E0B]">{pending}</p>
          </div>
          <div className="text-[#F59E0B] font-bold text-sm bg-orange-50 px-3 py-1 rounded-full">{total === 0 ? 0 : Math.round((pending/total)*100)}%</div>
        </Card>
        <Card extra="p-5 flex justify-between items-center">
          <div>
            <p className="text-xs font-semibold text-[#64748B] uppercase">Completed</p>
            <p className="text-[24px] font-bold text-[#16A34A]">{completed}</p>
          </div>
          <div className="text-[#16A34A] font-bold text-sm bg-green-50 px-3 py-1 rounded-full">{completePct}%</div>
        </Card>
      </div>

      {/* Kanban Board */}
      <div className="flex flex-col md:flex-row gap-6 overflow-x-auto pb-4">
        {renderColumn("To Do", "To Do")}
        {renderColumn("In Progress", "In Progress")}
        {renderColumn("Needs Approval", "Needs Approval")}
        {renderColumn("Completed", "Completed")}
      </div>
      
    </div>
  );
};

export default TabTasks;
