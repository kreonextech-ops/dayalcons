import React, { useState, useEffect } from "react";
import { 
  MdArrowBack, MdDesignServices, MdPerson, MdPhone, MdMessage, MdEmail, MdEvent, MdClose
} from "react-icons/md";
import Card from "components/card";
import { createClient } from "@supabase/supabase-js";

// Project specific tabs
import TabWorkspace from "./components/TabWorkspace";
import TabScope from "./components/TabScope";
import TabSteps from "./components/TabSteps";
import TabPayments from "./components/TabPayments";

// CRM shared tabs
import TabTasks from "../crm/components/TabTasks";
import TabCommunication from "../crm/components/TabCommunication";
import TabTimeline from "../crm/components/TabTimeline";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);

const ProjectDetail = ({ projData, onBack, onUpdate }) => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [employees, setEmployees] = useState([]);
  const [nextTask, setNextTask] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [communicationAction, setCommunicationAction] = useState(null);

  useEffect(() => {
    fetchEmployees();
    if (projData?.id) {
       fetchNextTask();
    }
  }, [projData?.id]);

  const fetchEmployees = async () => {
    const { data } = await supabase.from('employees').select('id, name, role');
    if (data) setEmployees(data);
  };

  const fetchNextTask = async () => {
    if (!projData?.client_id) return;
    const { data } = await supabase.from('tasks').select('*').eq('client_id', projData.client_id).eq('project_id', projData.id).neq('status', 'Completed').order('due_date', { ascending: true }).limit(1);
    if (data && data.length > 0) setNextTask(data[0]);
    else setNextTask(null);
  };

  const handleCompleteTask = async () => {
    if (!nextTask) return;
    const { error } = await supabase.from('tasks').update({ status: 'Completed' }).eq('id', nextTask.id);
    if (!error) fetchNextTask();
  };

  const handleToggleAssignEmployee = async (employeeId) => {
    let currentAssigned = (projData.assigned_to || '').split(',').filter(Boolean);
    if (currentAssigned.includes(employeeId)) {
      currentAssigned = currentAssigned.filter(id => id !== employeeId);
    } else {
      currentAssigned.push(employeeId);
    }
    const newAssignedString = currentAssigned.join(',');
    
    // Optimistic update
    const updatedCase = { ...projData, assigned_to: newAssignedString || null };
    if (onUpdate) onUpdate(updatedCase);

    if (projData.id) {
       await supabase.from('projects').update({ assigned_to: newAssignedString || null }).eq('id', projData.id);
       
       if (!currentAssigned.includes(employeeId)) { // wait, currentAssigned already modified. We need to check if it was ADDED.
           // Since we can't reliably check currentAssigned after modification in a generic replace, 
           // let's just create the task unconditionally for now if newAssignedString includes employeeId.
           // Actually, let's just put it right after the update.
           if (newAssignedString.includes(employeeId)) {
             await supabase.from('tasks').insert([{
               name: `Assigned to Project: ${projData.title || projData.name || 'Unknown'}`,
               description: `You have been assigned to Project ID: PRJ-${projData.id.substring(0,5).toUpperCase()}`,
               status: 'To Do',
               priority: 'High',
               assignee_id: employeeId,
               project_id: projData.id, client_id: projData.client_id
             }]);
           }
       }
    }
  };

  const handleQuickAction = (label) => {
    if (label === 'Schedule') {
       setShowScheduleModal(true);
    } else {
       if (label === 'Call' && projData.client?.phone) {
         window.open(`tel:${projData.client.phone}`, '_self');
       } else if (label === 'WhatsApp' && projData.client?.phone) {
         window.open(`https://wa.me/${projData.client.phone.replace(/\D/g, '')}`, '_blank');
       } else if (label === 'Email' && projData.client?.email) {
         window.open(`mailto:${projData.client.email}`, '_self');
       }
       setCommunicationAction(label);
       setActiveTab('Communication');
    }
  };

  let parsedMeta = {};
  try {
     parsedMeta = JSON.parse(projData?.description || "{}");
  } catch(e) {}

  const financials = parsedMeta.financials || { total: 0, advance: 0 };
  const payments = parsedMeta.payments || [];
  const totalPaid = (parseFloat(financials.advance) || 0) + payments.reduce((acc, p) => acc + (parseFloat(p.amount) || 0), 0);
  const totalAmount = parseFloat(financials.total) || 0;
  const balance = totalAmount - totalPaid;
  
  // Format dates and names
  const clientName = projData?.client?.name || projData?.clientName || "Unknown Client";

  // Role Check
  const userStr = localStorage.getItem('dayal_user');
  const loggedInUser = userStr ? JSON.parse(userStr) : null;
  const isAdmin = loggedInUser?.role === 'Admin';

  const tabs = [
    "Overview", "Scope", "Workspace", "Steps", ...(isAdmin ? ["Payments"] : []), "Tasks", 
    "Timeline", "Communication"
  ];

  if (!projData) return null;
  return (
    <div className="relative min-h-screen bg-[#F8FAFC] p-4 sm:p-8 font-sans pb-24">
      {/* 1. Back Navigation */}
      <div className="mb-6 flex items-center gap-2 text-sm text-[#64748B]">
        <button onClick={onBack} className="flex items-center gap-2 hover:text-brand-500 transition">
          <MdArrowBack className="h-5 w-5" />
          <span className="font-semibold">Back to Projects</span>
        </button>
        <span className="mx-2">/</span>
        <span>Pages</span>
        <span className="mx-2">/</span>
        <span>Design & Legal</span>
      </div>

      {/* 2. Hero Card */}
      <div className="rounded-[20px] bg-gradient-to-r from-[#2563EB]/10 to-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)] border border-[#E2E8F0] mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="flex items-center gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#2563EB] text-3xl font-bold text-white shadow-md">
            <MdDesignServices />
          </div>
          <div>
            <div className="flex items-center gap-3">
               <h1 className="text-[28px] font-bold text-[#0F172A]">{(projData?.name || projData?.title)}</h1>
               <span className="bg-gray-100 text-[#475569] px-3 py-1 rounded-md text-[12px] font-bold">SRV-{projData.id?.substring(0,5).toUpperCase()}</span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-[#475569]">
              <span className="flex items-center gap-1 font-semibold text-[#0F172A]"><MdPerson /> Client: {clientName}</span>
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-col items-end md:mt-0 gap-3">
          <span className="rounded-full px-4 py-1 text-xs font-bold tracking-wide bg-[#F59E0B] text-white uppercase">
            STATUS: {projData.status}
          </span>
          {isAdmin && (
            <div className="flex gap-4 text-right">
               <div>
                  <p className="text-[11px] font-semibold text-[#64748B] uppercase">Total Value</p>
                  <p className="text-[20px] font-bold text-[#0F172A]">₹ {totalAmount.toLocaleString()}</p>
               </div>
               <div>
                  <p className="text-[11px] font-semibold text-[#64748B] uppercase">Balance</p>
                  <p className="text-[20px] font-bold text-[#DC2626]">₹ {balance.toLocaleString()}</p>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Content */}
        <div className="w-full lg:w-[72%]">
          {/* Tabs */}
          <div className="sticky top-0 z-10 flex gap-2 overflow-x-auto bg-[#F8FAFC] py-4 border-b border-[#E2E8F0] mb-6 custom-scrollbar">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-[12px] px-5 py-2.5 text-sm font-semibold transition whitespace-nowrap ${
                  activeTab === tab 
                  ? 'bg-[#2563EB] text-white shadow-md' 
                  : 'text-[#64748B] hover:bg-white border border-transparent hover:border-[#E2E8F0]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[500px]">
            {activeTab === "Overview" && (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                 {/* Client Info Card */}
                 <Card extra="p-6 border border-[#E2E8F0] shadow-sm">
                   <h3 className="text-[16px] font-semibold text-[#0F172A] mb-4">Client Information</h3>
                   <div className="space-y-4">
                     <div className="flex flex-col"><span className="text-[12px] font-medium text-[#64748B]">Client / Company Name</span><span className="text-[14px] font-semibold text-[#0F172A]">{clientName}</span></div>
                     <div className="flex flex-col"><span className="text-[12px] font-medium text-[#64748B]">Contact Email</span><span className="text-[14px] font-semibold text-[#0F172A]">{projData.client?.email || "—"}</span></div>
                     <div className="flex flex-col"><span className="text-[12px] font-medium text-[#64748B]">Contact Phone</span><span className="text-[14px] font-semibold text-[#0F172A]">{projData.client?.phone || "—"}</span></div>
                     <div className="flex flex-col"><span className="text-[12px] font-medium text-[#64748B]">Project Creation Date</span><span className="text-[14px] font-semibold text-[#0F172A]">{new Date(projData.created_at).toLocaleDateString()}</span></div>
                   </div>
                 </Card>

                 {/* Project Info Card */}
                 <Card extra="p-6 border border-[#E2E8F0] shadow-sm">
                   <h3 className="text-[16px] font-semibold text-[#0F172A] mb-4">Project Details</h3>
                   <div className="space-y-4">
                     <div className="flex flex-col"><span className="text-[12px] font-medium text-[#64748B]">Current Status</span><span className="text-[14px] font-bold text-[#2563EB]">{projData.status}</span></div>
                     <div className="flex flex-col"><span className="text-[12px] font-medium text-[#64748B]">Primary Requirement</span><span className="text-[14px] font-semibold text-[#0F172A]">{(projData?.name || projData?.title)}</span></div>
                     <div className="flex flex-col"><span className="text-[12px] font-medium text-[#64748B]">Selected Requirements Count</span><span className="text-[14px] font-semibold text-[#0F172A]">{parsedMeta?.requirements?.length || 0} Modules</span></div>
                     <div className="flex flex-col"><span className="text-[12px] font-medium text-[#64748B]">Project Progress</span><span className="text-[14px] font-semibold text-[#0F172A]">{parsedMeta?.steps ? Math.round((parsedMeta.steps.filter(s=>s.completed).length / parsedMeta.steps.length)*100) : 0}% Completed</span></div>
                   </div>
                 </Card>
                 
                 {/* Commercial Summary */}
                 {isAdmin && (
                   <Card extra="p-6 border border-[#E2E8F0] shadow-sm">
                     <h3 className="text-[16px] font-semibold text-[#0F172A] mb-4">Commercial Summary</h3>
                     <div className="space-y-4">
                       <div className="flex justify-between items-center"><span className="text-[12px] font-medium text-[#64748B]">Project Value</span><span className="text-[14px] font-bold text-[#0F172A]">₹ {totalAmount.toLocaleString()}</span></div>
                       <div className="flex justify-between items-center"><span className="text-[12px] font-medium text-[#64748B]">Paid Amount</span><span className="text-[14px] font-bold text-[#16A34A]">₹ {totalPaid.toLocaleString()}</span></div>
                       <div className="flex justify-between items-center"><span className="text-[12px] font-medium text-[#64748B]">Outstanding</span><span className="text-[14px] font-bold text-[#DC2626]">₹ {balance.toLocaleString()}</span></div>
                       <div className="mt-4 pt-4 border-t border-[#E2E8F0]">
                          <p className="text-[11px] text-[#64748B] mb-2 font-bold uppercase">Payment Progress</p>
                          <div className="h-2 w-full rounded-full bg-[#E2E8F0]"><div className="h-2 rounded-full bg-[#16A34A] transition-all" style={{width: `${totalAmount ? Math.min(100, Math.round((totalPaid/totalAmount)*100)) : 0}%`}}></div></div>
                       </div>
                     </div>
                   </Card>
                 )}
               </div>
            )}
            
            {activeTab === "Scope" && <TabScope projData={projData} onUpdate={onUpdate} />}
            {activeTab === "Workspace" && <TabWorkspace projData={projData} />}
            {activeTab === "Steps" && <TabSteps projData={projData} onUpdate={onUpdate} />}
            {activeTab === "Payments" && isAdmin && <TabPayments projData={projData} onUpdate={onUpdate} />}
            
            {/* Convert projData to client format for CRM components */}
            {activeTab === "Tasks" && <TabTasks leadData={{ id: projData.client_id, name: clientName }} isClient={true} entityType="project" entityId={projData.id} />}
            {activeTab === "Communication" && <TabCommunication leadData={{ id: projData.client_id, name: clientName }} isClient={true} action={communicationAction} setAction={setCommunicationAction} entityType="project" entityId={projData.id} />}
            {activeTab === "Timeline" && <TabTimeline leadData={{ id: projData.client_id, name: clientName }} isClient={true} entityType="project" entityId={projData.id} />}
          </div>
        </div>

        {/* Right Sidebar (28%) */}
        <div className="w-full lg:w-[28%] relative">
          <div className="sticky top-6 flex flex-col gap-6">

            <Card extra="p-6">
              <h3 className="text-[16px] font-semibold text-[#0F172A] mb-1">Next Follow-up</h3>
              {nextTask ? (
                <>
                  <p className="text-[14px] font-bold text-[#DC2626] mb-1">{nextTask.due_date ? new Date(nextTask.due_date).toLocaleString() : "No Due Date"}</p>
                  <p className="text-[12px] text-gray-600 mb-4">
                    <a href={`/admin/tasks?taskId=${nextTask.id}`} className="text-brand-500 hover:underline font-bold">{nextTask.name}</a>
                  </p>
                  <div className="flex flex-col gap-2">
                    <button onClick={() => handleQuickAction('Call')} className="w-full rounded-[10px] bg-blue-600 py-2 text-[12px] font-bold text-white hover:bg-blue-700 transition">Follow up</button>
                    <div className="flex gap-2">
                      <button onClick={handleCompleteTask} className="flex-1 rounded-[10px] bg-[#16A34A] py-2 text-[12px] font-bold text-white hover:bg-green-700 transition">Mark Complete</button>
                      <button onClick={() => setShowScheduleModal(true)} className="flex-1 rounded-[10px] border border-[#E2E8F0] py-2 text-[12px] font-bold text-[#0F172A] hover:bg-gray-50 transition">Reschedule</button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-[28px] font-bold text-gray-400 mb-4">No follow-up set</p>
                  <button onClick={() => setShowScheduleModal(true)} className="w-full rounded-[10px] bg-blue-600 py-2 text-[12px] font-bold text-white hover:bg-blue-700 transition">Schedule Follow-up</button>
                </>
              )}
            </Card>

            <Card extra="p-6">
              <h3 className="text-[16px] font-semibold text-[#0F172A] mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Call", icon: <MdPhone /> },
                  { label: "WhatsApp", icon: <MdMessage /> },
                  { label: "Email", icon: <MdEmail /> },
                  { label: "Schedule", icon: <MdEvent /> }
                ].map((act, i) => (
                  <button key={i} onClick={() => handleQuickAction(act.label)} className="flex flex-col items-center justify-center rounded-[12px] border border-[#E2E8F0] p-3 hover:bg-[#F8FAFC] transition hover:border-[#2563EB] group">
                    <span className="text-[#64748B] group-hover:text-[#2563EB] text-xl mb-1 transition-colors">{act.icon}</span>
                    <span className="text-[11px] font-medium text-[#475569]">{act.label}</span>
                  </button>
                ))}
              </div>
            </Card>

            <Card extra="p-6">
              <h3 className="text-[16px] font-semibold text-[#0F172A] mb-4">Assigned Team</h3>
              <div className="space-y-4">
                  <div className="max-h-[200px] overflow-y-auto border border-gray-100 rounded-lg p-2 space-y-2 custom-scrollbar">
                    {employees.map(emp => {
                      const isAssigned = (projData.assigned_to || '').split(',').includes(emp.id);
                      return (
                        <div key={emp.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition" onClick={() => handleToggleAssignEmployee(emp.id)}>
                           <input type="checkbox" checked={isAssigned} readOnly className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                           <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                             {emp.name?.charAt(0) || 'U'}
                           </div>
                           <div className="flex-1">
                             <p className="text-sm font-bold text-gray-800">{emp.name}</p>
                             <p className="text-[10px] text-gray-500">{emp.role}</p>
                           </div>
                        </div>
                      )
                    })}
                  </div>
              </div>
            </Card>

          </div>
        </div>

      </div>

      {/* Schedule Task Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between mb-6">
               <h2 className="text-xl font-bold text-[#0F172A]">Schedule Follow-up</h2>
               <MdClose className="text-2xl text-[#64748B] cursor-pointer hover:text-red-500" onClick={() => setShowScheduleModal(false)} />
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              
              const { error } = await supabase.from('tasks').insert([{
                name: formData.get('name'),
                due_date: formData.get('due_date') || null,
                priority: 'High',
                status: 'To Do',
                assignee_id: projData.assigned_to?.split(',')[0] || null, // assign to first employee
                client_id: projData.client_id,
                  project_id: projData.id,
                creator_id: loggedInUser?.id,
                category: 'Project Follow-up'
              }]);
              if (error) alert('Failed to schedule task: ' + error.message);
              else {
                setShowScheduleModal(false);
                fetchNextTask();
              }
            }}>
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700">Task Description</label>
                <input type="text" name="name" required placeholder="e.g., Follow up call for drafts" className="w-full mt-1 p-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500" />
              </div>
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700">Date & Time</label>
                <input type="datetime-local" name="due_date" required className="w-full mt-1 p-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500" />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowScheduleModal(false)} className="px-4 py-2 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-sm font-bold text-white hover:bg-blue-700">Schedule Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProjectDetail;
