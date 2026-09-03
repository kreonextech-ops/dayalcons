import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Card from "components/card";
import { createClient } from "@supabase/supabase-js";
import { 
  MdSearch, MdAdd, MdClose, MdViewKanban, MdViewList, MdCalendarToday, 
  MdTimeline, MdChevronRight, MdChevronLeft, MdCheckCircle, MdAssignment
} from "react-icons/md";
import TaskDetail from "./TaskDetail";
import ViewKanban from "./components/ViewKanban";
import ViewList from "./components/ViewList";
import ViewCalendar from "./components/ViewCalendar";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);

const Tasks = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedTask, setSelectedTask] = useState(null);
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const taskId = params.get('taskId');
    if (taskId && !selectedTask) {
       supabase.from('tasks').select('*').eq('id', taskId).single().then(({ data }) => {
          if (data) setSelectedTask(data);
       });
    }
  }, [location, selectedTask]);

  const handleCloseDetail = () => {
     setSelectedTask(null);
     navigate('/admin/tasks');
  };
  const [activeView, setActiveView] = useState("Kanban");
  const [showNewModal, setShowNewModal] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const initialTaskState = {
     module: "",
     linkedRecordId: "",
     linkedRecordName: "",
     assigneeId: "",
     assigneeName: "",
     title: "",
     description: "",
     priority: "Medium",
     department: "",
     startDate: "",
     dueDate: "",
     estimatedHours: "",
     status: "To Do"
  };
  const [newTask, setNewTask] = useState(initialTaskState);

  const [availableRecords, setAvailableRecords] = useState([]);
  const [availableEmployees, setAvailableEmployees] = useState([]);
  const [availableDepts, setAvailableDepts] = useState([]);
  const [allTasks, setAllTasks] = useState([]);

  React.useEffect(() => {
     const fetchAllData = async () => {
        // Fetch tasks and employees in parallel
        const [tasksRes, empsRes] = await Promise.all([
           supabase.from('tasks').select('*'),
           supabase.from('employees').select('*')
        ]);

        const tasksData = tasksRes.data;
        const empsData = empsRes.data;

        if (empsData) setAvailableEmployees(empsData);

        if (tasksData) {
           const userStr = localStorage.getItem("dayal_user");
           const loggedInUser = userStr ? JSON.parse(userStr) : null;

           setAllTasks(tasksData.map(t => {
              const assignee = empsData ? empsData.find(e => e.id === t.assignee_id) : null;
              const creator = empsData ? empsData.find(e => e.id === t.creator_id) : null;
              
              let cName = "System";
              if (creator) cName = creator.name;
              else if (loggedInUser && loggedInUser.id === t.creator_id) cName = loggedInUser.name || "System";

              return {
                 ...t, 
                 assigneeName: assignee ? assignee.name : "Unassigned",
                 creatorName: cName,
                 dueDate: t.due_date ? t.due_date.split('T')[0] : null
              };
           }));
        }
        
        // Departments can still be local or hardcoded for now, or just extract from employees
        if (empsData) {
           const depts = [...new Set(empsData.map(e => e.department).filter(Boolean))];
           setAvailableDepts(depts.map(d => ({ name: d })));
        }
     };
     fetchAllData();
  }, [showNewModal, refreshTrigger]);

  React.useEffect(() => {
     const fetchRecords = async () => {
        if (modalStep === 2 && newTask.module) {
           if (newTask.module === "Lead") {
              const { data } = await supabase.from("leads").select("*");
              setAvailableRecords(data || []);
           } else if (newTask.module === "Client") {
              const { data } = await supabase.from("clients").select("*");
              setAvailableRecords(data || []);
           } else if (newTask.module === "Project") {
              const { data } = await supabase.from("projects").select("*");
              setAvailableRecords(data || []);
           } else if (newTask.module === "Service") {
              const { data } = await supabase.from("services").select("*");
              setAvailableRecords(data || []);
           } else {
              setAvailableRecords([]);
           }
        }
     };
     fetchRecords();
  }, [modalStep, newTask.module]);

  const handleCreateTask = async () => {
     if (!newTask.title) return;
     
     const userStr = localStorage.getItem("dayal_user");
     const loggedInUser = userStr ? JSON.parse(userStr) : null;

     const payload = {
        title: newTask.title,
        name: newTask.title, // Keep legacy name column populated to satisfy any not-null constraints
        description: newTask.description,
        priority: newTask.priority,
        status: newTask.status || 'To Do',
        due_date: newTask.dueDate ? new Date(newTask.dueDate).toISOString() : null,
        assignee_id: newTask.assigneeId || null,
        creator_id: loggedInUser ? loggedInUser.id : null,
        category: newTask.module,
        custom_category: newTask.module === "Other" ? newTask.linkedRecordName : null
     };

     if (newTask.module === "Lead") payload.lead_id = newTask.linkedRecordId;
     else if (newTask.module === "Client") payload.client_id = newTask.linkedRecordId;
     else if (newTask.module === "Project") payload.project_id = newTask.linkedRecordId;
     else if (newTask.module === "Service") payload.service_id = newTask.linkedRecordId;

     const { data, error } = await supabase.from('tasks').insert([payload]).select();
     if (error) {
        alert("Failed to create task: " + error.message);
        return;
     }

     if (data && data[0]) {
        await supabase.from('task_activity_logs').insert([{
           task_id: data[0].id,
           employee_name: loggedInUser ? loggedInUser.name : "Admin",
           activity_type: "Created",
           description: "Task was created."
        }]);
     }
     
     setNewTask(initialTaskState);
     setModalStep(1);
     setShowNewModal(false);
     setRefreshTrigger(prev => prev + 1);
  };

  const [taskScope, setTaskScope] = useState("My Tasks");

  const userStr = localStorage.getItem("dayal_user");
  const loggedInUser = userStr ? JSON.parse(userStr) : null;
  const isAdminOrMD = loggedInUser && (loggedInUser.role === "Admin" || loggedInUser.role === "MD");

  const displayedTasks = allTasks.filter(t => {
     if (!loggedInUser) return true; // fallback
     if (taskScope === "All Tasks" && isAdminOrMD) return true;
     if (taskScope === "My Tasks") return t.assignee_id === loggedInUser.id;
     if (taskScope === "Given Tasks") return t.creator_id === loggedInUser.id;
     return false;
  });

    // KPIs
  const today = new Date().toISOString().split('T')[0];
  const activeTasks = displayedTasks.filter(t => t.status !== "Completed");
  const dueToday = activeTasks.filter(t => t.due_date && t.due_date.startsWith(today));
  const overdue = activeTasks.filter(t => t.due_date && t.due_date < today && t.status !== "Completed");
  const inProgress = displayedTasks.filter(t => t.status === "In Progress");
  const waitingReview = displayedTasks.filter(t => t.status === "Needs Approval" || t.status === "Waiting Review");
  const completed = displayedTasks.filter(t => t.status === "Completed");
  const highPriority = activeTasks.filter(t => t.priority === "High" || t.priority === "Critical");
  const uniqueEmployees = new Set(displayedTasks.filter(t => t.assigneeName).map(t => t.assigneeName)).size;

  const kpis = [
    { title: "Total Active Tasks", value: activeTasks.length || "0" },
    { title: "Due Today", value: dueToday.length || "0" },
    { title: "Overdue", value: overdue.length || "0" },
    { title: "In Progress", value: inProgress.length || "0" },
    { title: "Waiting Review", value: waitingReview.length || "0" },
    { title: "Completed", value: completed.length || "0" },
    { title: "High Priority", value: highPriority.length || "0" },
    { title: "Assigned Employees", value: uniqueEmployees || "0" }
  ];

  const views = [
    { name: "Kanban", icon: <MdViewKanban /> },
    { name: "List", icon: <MdViewList /> },
    { name: "Calendar", icon: <MdCalendarToday /> }
  ];

  const handleStatusChange = async (taskId, newStatus) => {
     const { error } = await supabase.from('tasks').update({ status: newStatus }).eq('id', taskId);
     if (!error) {
        setAllTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
        setSelectedTask(prev => prev && prev.id === taskId ? { ...prev, status: newStatus } : prev);

        const userStr = localStorage.getItem("dayal_user");
        const user = userStr ? JSON.parse(userStr) : { name: "Admin" };
        await supabase.from('task_activity_logs').insert([{
           task_id: taskId,
           employee_name: user.name || "Admin",
           activity_type: "Status Change",
           description: `Changed status to ${newStatus}`
        }]);
     }
  };

  const handleDeleteTask = async (taskId) => {
     const confirmed = window.confirm("Are you sure you want to permanently delete this task?");
     if (!confirmed) return;

     const { error } = await supabase.from('tasks').delete().eq('id', taskId);
     if (error) {
        alert("Failed to delete task: " + error.message);
     } else {
        setAllTasks(prev => prev.filter(t => t.id !== taskId));
        setSelectedTask(null);
     }
  };

  
  if (selectedTask) {
     return <TaskDetail task={selectedTask} onBack={handleCloseDetail} onStatusChange={handleStatusChange} onDeleteTask={handleDeleteTask} />;
  }

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen pt-12 pb-24 font-sans text-[#475569]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 mt-8 md:mt-2">
          <div>
            <p className="text-[12px] font-medium text-[#64748B] mb-1">Pages / Work Management</p>
            <h1 className="text-[32px] font-bold text-[#0F172A] leading-tight flex flex-col md:flex-row md:items-center gap-4">
               Task Management
               <div className="flex bg-gray-100 rounded-lg p-1 mt-2 md:mt-0 w-fit">
                  <button 
                     onClick={() => setTaskScope("My Tasks")}
                     className={`px-3 py-1.5 rounded-md text-[13px] font-bold transition whitespace-nowrap ${taskScope === "My Tasks" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                  >My Tasks</button>
                  <button 
                     onClick={() => setTaskScope("Given Tasks")}
                     className={`px-3 py-1.5 rounded-md text-[13px] font-bold transition whitespace-nowrap ${taskScope === "Given Tasks" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                  >Given Tasks</button>
                  {isAdminOrMD && (
                     <button 
                        onClick={() => setTaskScope("All Tasks")}
                        className={`px-3 py-1.5 rounded-md text-[13px] font-bold transition whitespace-nowrap ${taskScope === "All Tasks" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                     >All Tasks</button>
                  )}
               </div>
            </h1>
            <p className="text-[14px] text-[#64748B] mt-1 max-w-2xl">Manage every assigned task across sales, architecture, legal, engineering, construction, interior, accounts, HR, and internal operations.</p>
          </div>
          <div className="flex gap-3 z-10 relative">
            <button className="h-10 px-4 rounded-[12px] border border-[#E2E8F0] bg-white text-[14px] font-bold text-[#0F172A] hover:bg-gray-50 flex items-center gap-2 transition">
              <MdCalendarToday /> Calendar View
            </button>
            <button className="h-10 px-4 rounded-[12px] border border-[#E2E8F0] bg-white text-[14px] font-bold text-[#0F172A] hover:bg-gray-50 flex items-center gap-2 transition">
              Export
            </button>
            <button onClick={() => setShowNewModal(true)} className="h-10 px-5 rounded-[12px] bg-[#2563EB] text-[14px] font-bold text-white hover:bg-[#1D4ED8] flex items-center gap-2 transition shadow-sm">
              <MdAdd /> New Task
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
          {kpis.map((kpi, i) => (
             <Card key={i} extra="p-4 border border-[#E2E8F0] shadow-sm hover:shadow-md transition text-center">
                <p className="text-[10px] font-bold text-[#64748B] uppercase leading-tight mb-2 tracking-wider">{kpi.title}</p>
                <p className={`text-[24px] font-bold text-[#0F172A]`}>{kpi.value}</p>
             </Card>
          ))}
        </div>

        {/* Filters & Views Bar */}
        <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-sm mb-6 flex flex-col xl:flex-row justify-between items-center gap-4">
           {/* Search & Filters */}
           <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
              <div className="relative w-full sm:w-[250px]">
                <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#64748B] text-xl" />
                <input type="text" placeholder="Search task, client, employee..." className="w-full pl-10 pr-4 h-10 rounded-[10px] bg-gray-50 border border-transparent text-[13px] outline-none focus:bg-white focus:border-[#2563EB] transition-colors" />
              </div>
              {["Module", "Department", "Employee", "Client", "Project", "Status"].map(f => (
                 <select key={f} className="h-10 px-3 rounded-[10px] border border-[#E2E8F0] text-[12px] font-medium text-[#475569] bg-white outline-none hover:border-[#2563EB] cursor-pointer">
                    <option>{f}</option>
                 </select>
              ))}
              <div className="flex gap-2 ml-auto sm:ml-2">
                 <button className="text-[12px] font-bold text-[#64748B] hover:text-[#0F172A]">Reset</button>
                 <button className="text-[12px] font-bold text-[#2563EB] hover:underline">Save Filter</button>
              </div>
           </div>

           {/* View Toggles */}
           <div className="flex bg-gray-100 p-1 rounded-xl w-full sm:w-auto">
              {views.map(v => (
                 <button
                    key={v.name}
                    onClick={() => setActiveView(v.name)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-bold transition flex-1 sm:flex-none justify-center ${activeView === v.name ? 'bg-white text-[#2563EB] shadow-sm' : 'text-[#64748B] hover:text-[#0F172A]'}`}
                 >
                    {v.icon} {v.name}
                 </button>
              ))}
           </div>
        </div>

        {/* Dynamic View Content */}
        <div className="min-h-[600px]">
           {activeView === "Kanban" && (
              <ViewKanban 
                 onSelect={(task) => setSelectedTask(task)} 
                 onAddClick={(status) => {
                    setNewTask({ ...initialTaskState, status: status });
                    setShowNewModal(true);
                 }}
                 tasks={displayedTasks} 
                 onDelete={handleDeleteTask}
              />
           )}
           {activeView === "List" && <ViewList onSelect={(task) => setSelectedTask(task)} tasks={displayedTasks} onDelete={handleDeleteTask} />}
           {activeView === "Calendar" && (
              <ViewCalendar 
                 tasks={displayedTasks} 
                 onDateClick={(dateStr) => {
                    setNewTask({ ...initialTaskState, dueDate: dateStr });
                    setShowNewModal(true);
                 }}
                 onTaskClick={(task) => setSelectedTask(task)}
                 onDelete={handleDeleteTask}
              />
           )}
        </div>
      </div>

      {/* Add Task Modal (4 steps) */}
      {showNewModal && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-[1000px] bg-white rounded-[20px] shadow-2xl flex flex-col max-h-[90vh]">
               {/* Header */}
               <div className="p-6 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC] rounded-t-[20px]">
                  <div>
                    <h2 className="text-[20px] font-bold text-[#0F172A]">Create New Task</h2>
                    <p className="text-[13px] text-[#64748B] mt-1">Step {modalStep} of 4</p>
                  </div>
                  <button onClick={() => setShowNewModal(false)} className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center text-gray-500 transition">
                     <MdClose size={20} />
                  </button>
               </div>

               {/* Body */}
               <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
                  
                  {/* Step 1: Source Module */}
                  {modalStep === 1 && (
                     <div className="animate-fade-in max-w-4xl mx-auto">
                        <h3 className="text-[18px] font-bold text-[#0F172A] mb-6 text-center">Where does this task belong?</h3>
                        <p className="text-center text-[13px] text-gray-500 mb-8 max-w-xl mx-auto">A task must never exist independently. Every task must be linked to a module.</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                           {["Lead", "Client", "Service", "Project", "Office Work", "Other"].map(mod => (
                              <div 
                                 key={mod} 
                                 onClick={() => { setNewTask({...newTask, module: mod}); setModalStep(mod === "Office Work" ? 3 : 2); }}
                                 className={`p-6 border-2 ${newTask.module === mod ? 'border-[#2563EB] bg-blue-50' : 'border-[#E2E8F0]'} rounded-xl hover:border-[#2563EB] cursor-pointer text-center group transition`}
                              >
                                 <div className="w-12 h-12 bg-gray-50 group-hover:bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400 group-hover:text-blue-600 text-2xl transition">
                                    <MdAssignment />
                                 </div>
                                 <h4 className="text-[15px] font-bold text-[#0F172A]">{mod}</h4>
                              </div>
                           ))}
                        </div>
                     </div>
                  )}

                  {/* Step 2: Link Entity */}
                  {modalStep === 2 && (
                     <div className="animate-fade-in max-w-2xl mx-auto text-center">
                        <h3 className="text-[18px] font-bold text-[#0F172A] mb-6">Link {newTask.module} Record</h3>
                        {newTask.module === "Other" ? (
                           <div className="mt-8 border border-[#E2E8F0] rounded-xl bg-gray-50 p-12 flex flex-col items-center justify-center">
                              <label className="block text-[11px] font-bold text-[#475569] mb-1.5 uppercase">Specify Category</label>
                              <input type="text" value={newTask.linkedRecordName} onChange={e => setNewTask({...newTask, linkedRecordName: e.target.value})} placeholder="E.g. Marketing, Event" className="w-full h-14 px-4 rounded-xl border-2 border-[#E2E8F0] text-[15px] outline-none focus:border-[#2563EB]" />
                              <button onClick={() => { setModalStep(3); }} className="mt-4 px-6 h-10 bg-[#2563EB] text-white font-bold rounded-lg hover:bg-blue-700">Continue</button>
                           </div>
                        ) : (
                           <>
                              <div className="relative max-w-xl mx-auto mb-6">
                                 <MdSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-2xl" />
                                 <input 
                                    type="text" 
                                    onChange={(e) => {
                                       const val = e.target.value.toLowerCase();
                                       const filtered = (availableRecords || []).filter(r => (r.name || r.projectName || r.clientName || r.leadName || r.title || "").toLowerCase().includes(val));
                                       // We can use a local state or just inline it, but since we don't have local state, let's use DOM tricks or add state.
                                       // Actually, let's just use a local state in the component. Wait, I can't easily add state hook inside the JSX. 
                                    }}
                                    placeholder={`Search existing ${newTask.module}s in database...`} 
                                    className="w-full h-14 pl-12 pr-4 rounded-xl border-2 border-[#E2E8F0] text-[15px] outline-none focus:border-[#2563EB] transition shadow-sm" 
                                    title={`You MUST select an existing ${newTask.module} from the database.`}
                                 />
                                 <p className="text-[11px] text-gray-400 mt-2 text-left ml-2">You can only select a {newTask.module} that already exists in the CRM database.</p>
                              </div>
                              <div className="max-h-[300px] overflow-y-auto custom-scrollbar text-left border border-[#E2E8F0] rounded-xl">
                                 {availableRecords.length === 0 ? (
                                    <div className="p-8 text-center">
                                       <p className="text-[14px] font-bold text-red-500 mb-2">No {newTask.module}s found in database.</p>
                                       <p className="text-[12px] text-gray-500">You must create a {newTask.module} in the CRM first before you can link a task to it.</p>
                                    </div>
                                 ) : (
                                    availableRecords.map(rec => (
                                       <div 
                                          key={rec.id} 
                                          onClick={() => { setNewTask({...newTask, linkedRecordId: rec.id, linkedRecordName: rec.name || rec.projectName || rec.clientName || rec.leadName || rec.title}); setModalStep(3); }}
                                          className={`p-4 border-b border-[#E2E8F0] hover:bg-blue-50 cursor-pointer transition ${newTask.linkedRecordId === rec.id ? 'bg-blue-50' : ''}`}
                                       >
                                          <p className="text-[14px] font-bold text-[#0F172A]">{rec.name || rec.projectName || rec.clientName || rec.leadName || rec.title || "Unnamed Record"}</p>
                                          <p className="text-[12px] text-gray-500">{rec.id}</p>
                                       </div>
                                    ))
                                 )}
                              </div>
                           </>
                        )}
                     </div>
                  )}

                  {/* Step 3: Assign Employee */}
                  {modalStep === 3 && (
                     <div className="animate-fade-in max-w-2xl mx-auto text-center">
                        <h3 className="text-[18px] font-bold text-[#0F172A] mb-6">Assign Employee</h3>
                        <div className="relative max-w-xl mx-auto mb-6">
                           <MdSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-2xl" />
                           <input type="text" placeholder="Search employee..." className="w-full h-14 pl-12 pr-4 rounded-xl border-2 border-[#E2E8F0] text-[15px] outline-none focus:border-[#2563EB] transition shadow-sm" />
                           <p className="text-[11px] text-gray-400 mt-2 text-left ml-2">Select an employee from the directory to assign this task.</p>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto custom-scrollbar text-left border border-[#E2E8F0] rounded-xl">
                           {availableEmployees.length === 0 ? (
                              <div className="p-8 text-center">
                                 <p className="text-[14px] text-gray-500">No employees found in directory.</p>
                              </div>
                           ) : (
                              availableEmployees.map(emp => (
                                 <div 
                                    key={emp.id} 
                                    onClick={() => { setNewTask({...newTask, assigneeId: emp.id, assigneeName: emp.name, department: emp.department}); setModalStep(4); }}
                                    className={`p-4 border-b border-[#E2E8F0] hover:bg-blue-50 cursor-pointer transition flex items-center justify-between ${newTask.assigneeId === emp.id ? 'bg-blue-50' : ''}`}
                                 >
                                    <div>
                                       <p className="text-[14px] font-bold text-[#0F172A]">{emp.name}</p>
                                       <p className="text-[12px] text-gray-500">{emp.designation} • {emp.department}</p>
                                    </div>
                                    <div className="text-right">
                                       <p className="text-[12px] font-bold text-green-600">Available</p>
                                    </div>
                                 </div>
                              ))
                           )}
                        </div>
                     </div>
                  )}

                  {/* Step 4: Task Information */}
                  {modalStep === 4 && (
                     <div className="animate-fade-in max-w-3xl mx-auto">
                        <h3 className="text-[18px] font-bold text-[#0F172A] mb-6 text-center">Task Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                           <div className="md:col-span-2"><label className="block text-[11px] font-bold text-[#475569] mb-1.5 uppercase">Task Title *</label><input type="text" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} placeholder="Enter task title" className="w-full h-11 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none focus:border-[#2563EB]" /></div>
                           <div className="md:col-span-2"><label className="block text-[11px] font-bold text-[#475569] mb-1.5 uppercase">Description</label><textarea value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} placeholder="Enter task description" className="w-full h-24 p-3 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none focus:border-[#2563EB] resize-none" /></div>
                           <div><label className="block text-[11px] font-bold text-[#475569] mb-1.5 uppercase">Priority</label><select value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})} className="w-full h-11 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none bg-white"><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select></div>
                           <div><label className="block text-[11px] font-bold text-[#475569] mb-1.5 uppercase">Department</label>
                              <select value={newTask.department} onChange={e => setNewTask({...newTask, department: e.target.value})} className="w-full h-11 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none bg-white">
                                 <option value="">Select Department</option>
                                 {availableDepts.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
                              </select>
                           </div>
                           <div><label className="block text-[11px] font-bold text-[#475569] mb-1.5 uppercase">Start Date</label><input type="date" value={newTask.startDate} onChange={e => setNewTask({...newTask, startDate: e.target.value})} className="w-full h-11 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none" /></div>
                           <div><label className="block text-[11px] font-bold text-[#475569] mb-1.5 uppercase">Due Date</label><input type="date" value={newTask.dueDate} onChange={e => setNewTask({...newTask, dueDate: e.target.value})} className="w-full h-11 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none" /></div>
                           <div><label className="block text-[11px] font-bold text-[#475569] mb-1.5 uppercase">Estimated Hours</label><input type="number" value={newTask.estimatedHours} onChange={e => setNewTask({...newTask, estimatedHours: e.target.value})} placeholder="—" className="w-full h-11 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none" /></div>
                           <div><label className="block text-[11px] font-bold text-[#475569] mb-1.5 uppercase">Attachments</label><div className="w-full h-11 px-3 rounded-[10px] border border-dashed border-gray-400 bg-gray-50 flex items-center justify-center text-[12px] text-gray-500 font-bold cursor-pointer">Upload Files</div></div>
                        </div>
                     </div>
                  )}

               </div>

               {/* Footer */}
               <div className="p-6 border-t border-[#E2E8F0] flex justify-between items-center bg-white rounded-b-[20px]">
                  <button 
                     onClick={() => setModalStep(modalStep - 1)} 
                     disabled={modalStep === 1}
                     className={`flex items-center gap-1 h-10 px-4 rounded-[12px] font-bold text-sm transition ${modalStep === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-[#64748B] hover:bg-gray-100'}`}
                  >
                     <MdChevronLeft size={20} /> Back
                  </button>
                  <div className="flex gap-2">
                     {[1,2,3,4].map(dot => (
                        <div key={dot} className={`h-2.5 rounded-full transition-all duration-300 ${modalStep === dot ? 'w-8 bg-[#2563EB]' : 'w-2.5 bg-gray-200'}`}></div>
                     ))}
                  </div>
                  {modalStep < 4 ? (
                     <button onClick={() => setModalStep(modalStep + 1)} className="flex items-center gap-1 h-10 px-6 rounded-[12px] bg-[#2563EB] text-white font-bold text-sm hover:bg-[#1D4ED8] transition shadow-md">
                        Next <MdChevronRight size={20} />
                     </button>
                  ) : (
                     <button onClick={handleCreateTask} disabled={!newTask.title} className={`flex items-center gap-2 h-10 px-8 rounded-[12px] text-white font-bold text-sm transition shadow-md ${!newTask.title ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#16A34A] hover:bg-green-700'}`}>
                        <MdCheckCircle size={18} /> Create Task
                     </button>
                  )}
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default Tasks;
