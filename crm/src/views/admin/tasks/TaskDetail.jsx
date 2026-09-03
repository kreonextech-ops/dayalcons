import { createClient } from "@supabase/supabase-js";
import { useEffect } from "react";
import React, { useState } from "react";
import { 
  MdArrowBack, MdCheckCircle, MdEdit, MdAssignment, MdShare, MdDelete
} from "react-icons/md";
import Card from "components/card";



// Tab Components
import TabOverview from "./components/TabOverview";
import TabChecklist from "./components/TabChecklist";
import TabActivity from "./components/TabActivity";
import TabComments from "./components/TabComments";
import TabFiles from "./components/TabFiles";
import TabTimeLog from "./components/TabTimeLog";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);

const TaskDetail = ({ task, onBack, onStatusChange, onDeleteTask }) => {
  const [activeTab, setActiveTab] = useState("Overview");
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editTitle, setEditTitle] = useState("");
    const handlePriorityChange = async (e) => {
         const newPriority = e.target.value;
         await supabase.from('tasks').update({ priority: newPriority }).eq('id', task.id);
         task.priority = newPriority;
         setContextData(prev => ({...prev}));
      };
      const handleAssigneeChange = async (e) => {
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
      const handleTitleSave = async () => { await supabase.from("tasks").update({ title: editTitle, name: editTitle }).eq("id", task.id); setIsEditingTitle(false); task.title = editTitle; task.name = editTitle; };
              const [employees, setEmployees] = useState([]);
    const [contextData, setContextData] = useState({ client: null, lead: null, project: null, service: null });

  useEffect(() => {
    async function fetchContext() {
      const dataObj = {};
        const { data: emps } = await supabase.from('employees').select('id, name');
        if (emps) setEmployees(emps);
      
      if (task?.client_id) {
         const { data } = await supabase.from('clients').select('id, name').eq('id', task.client_id).single();
         if (data) dataObj.client = { ...data, name: data.name };
      }

      if (task?.lead_id) {
         const { data } = await supabase.from('leads').select('id, name').eq('id', task.lead_id).single();
         if (data) dataObj.lead = data;
      }
      if (task?.project_id) {
         const { data } = await supabase.from('projects').select('id, name').eq('id', task.project_id).single();
         if (data) dataObj.project = data;
      }
      if (task?.service_id) {
         const { data } = await supabase.from('services').select('id, title').eq('id', task.service_id).single();
         if (data) dataObj.service = data;
      }
      setContextData(dataObj);
    }
    fetchContext();
  }, [task]);

  // Bind real task data
  const taskData = {
    title: task?.title || task?.name || "Enter task title",
    status: task?.status || "To Do",
    priority: task?.priority || "—",
    progress: task?.status === "Completed" ? 100 : task?.status === "Needs Approval" ? 90 : task?.status === "In Progress" ? 50 : 0,
    employee: task?.assigneeName || task?.assignee?.name || "Unassigned",
    creator: task?.creatorName || "Unknown",
    department: "—",
    module: task?.category || "—",
    client: task?.client_id ? (contextData.client?.name || contextData.lead?.name || contextData.project?.name || contextData.service?.title || "Unknown Record") : (task?.custom_category || "—"),
    project: task?.project_id || "—"
  };

  const tabs = [
    "Overview", "Checklist", "Comments", "Files", "Activity & Time Log"
  ];

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] p-4 sm:p-8 font-sans pb-24">
      {/* Back Navigation */}
      <div className="mb-6 flex items-center gap-2 text-sm text-[#64748B]">
        <button onClick={onBack} className="flex items-center gap-2 hover:text-[#2563EB] transition">
          <MdArrowBack className="h-5 w-5" />
          <span className="font-semibold">Back to Tasks</span>
        </button>
      </div>

      {/* Hero Header */}
      <div className="rounded-[20px] bg-white p-8 shadow-sm border border-[#E2E8F0] mb-6 flex flex-col md:flex-row justify-between items-start md:items-center relative">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 w-full min-w-0">
           {/* Left */}
           <div>
              <div className="flex items-center gap-3 mb-2">
                 {isEditingTitle ? <input type="text" autoFocus onBlur={handleTitleSave} onKeyDown={e => e.key === "Enter" && handleTitleSave()} value={editTitle} onChange={e => setEditTitle(e.target.value)} className="text-[24px] md:text-[28px] font-bold text-[#0F172A] tracking-tight border-b-2 border-blue-500 outline-none bg-transparent w-full max-w-md" /> : <h1 onClick={() => { setEditTitle(taskData.title); setIsEditingTitle(true); }} className="text-[24px] md:text-[28px] font-bold text-[#0F172A] tracking-tight cursor-pointer hover:bg-gray-100 rounded transition break-words" title="Click to edit">{taskData.title}</h1>}
                 <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-md text-[12px] font-bold border border-gray-200 uppercase">{taskData.status}</span>
              </div>
              <div className="flex flex-wrap gap-4 text-[13px]">
                  <div className="flex items-center gap-1">
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
        </div>
                  
                  <div className="flex items-center gap-2">
                     <span className="text-[#64748B]">Status:</span>
                     <select 
                        value={taskData.status}
                        onChange={(e) => onStatusChange(task.id, e.target.value)}
                        className="bg-white border border-gray-300 text-gray-700 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block px-2 py-1 outline-none font-bold cursor-pointer"
                     >
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Needs Approval">Needs Approval</option>
                        <option value="Approved">Approved</option>
                        <option value="Completed">Completed</option>
                     </select>
                  </div>
               </div>
           </div>

           {/* Right Info */}
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
                
             </div>
          </div>
  
          {/* Actions */}
        <div className="flex gap-2 mt-6 md:mt-0 md:ml-8 w-full md:w-auto">
           <button onClick={() => onDeleteTask(task.id)} className="flex-1 md:flex-none h-10 px-4 rounded-lg bg-red-50 text-[13px] font-bold text-red-600 hover:bg-red-100 flex items-center justify-center gap-2"><MdDelete /> Delete</button>
           
           <button className="flex-1 md:flex-none h-10 px-4 rounded-lg bg-[#10B981] text-[13px] font-bold text-white hover:bg-green-600 shadow-sm flex items-center justify-center gap-2"><MdCheckCircle /> Complete</button>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="flex flex-col gap-6">
        <div className="flex gap-2 overflow-x-auto bg-[#F8FAFC] py-4 border-b border-[#E2E8F0] custom-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-[12px] px-6 py-2.5 text-sm font-bold transition whitespace-nowrap ${
                activeTab === tab 
                ? 'bg-[#2563EB] text-white shadow-sm' 
                : 'text-[#64748B] hover:bg-white border border-transparent hover:border-[#E2E8F0]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[500px]">
          {activeView(activeTab)}
        </div>
      </div>
    </div>
  );

  function activeView(tab) {
     switch(tab) {
        case "Overview": return <TabOverview task={task} contextData={contextData} />;
        case "Checklist": return <TabChecklist task={task} />;
        case "Comments": return <TabComments task={task} />;
        case "Files": return <TabFiles task={task} />;
        case "Activity & Time Log": return <TabTimeLog task={task} />;
        default: return null;
     }
  }
};

export default TaskDetail;
