import React, { useState, useEffect } from "react";
import { 
  MdArrowBack, MdPhone, MdEmail, MdLocationOn, MdEdit,
  MdBusinessCenter, MdAttachMoney, MdMap, MdFolder, MdAssignment,
  MdMessage, MdSave, MdDomain, MdCheckCircle, MdPerson, MdClose, MdDownload, MdDelete
} from "react-icons/md";
import Card from "components/card";
import { FiClock, FiFileText } from "react-icons/fi";
import { createClient } from "@supabase/supabase-js";
import { uploadFileToR2, getR2FileUrl, deleteR2File } from "utils/r2Storage";

import TabFinancials from "./components/TabFinancials";
import TabTimeline from "../crm/components/TabTimeline";
import TabCommunication from "../crm/components/TabCommunication";
import TabProjects from "./components/TabProjects";
import TabSiteVisit from "../crm/components/TabSiteVisit";
import TabTasks from "../crm/components/TabTasks";
import TabEstimate from "../crm/components/TabEstimate";
import TabDocuments from "../crm/components/TabDocuments";
import TabServiceRequirement from "../crm/components/TabServiceRequirement";
import TabServiceWorkspace from "../crm/components/TabServiceWorkspace";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);

const ClientDetail = ({ client, onBack }) => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [isEditingClient, setIsEditingClient] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [nextTask, setNextTask] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [communicationAction, setCommunicationAction] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
    const [agreements, setAgreements] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = React.useRef(null);
    
    React.useEffect(() => {
       const fetchAgreements = async () => {
          if (!client?.id) return;
          const { data } = await supabase.from('documents').select('*').eq('client_id', client.id);
          if (data) setAgreements(data);
       };
       fetchAgreements();
    }, [client]);
    
    const handleUploadClick = () => { fileInputRef.current?.click(); };
    
    const handleFileChange = async (e) => {
       const file = e.target.files[0];
       if (!file || !client?.id) return;
       setIsUploading(true);
       
       try {
           const fileKey = await uploadFileToR2(file, 'clients');
           const { data, error } = await supabase.from('documents').insert([{
              client_id: client.id,
              name: file.name,
              file_url: fileKey
           }]).select();
           
           if (data) setAgreements([...agreements, data[0]]);
       } catch (err) {
           console.error("Upload failed", err);
           alert("Upload failed. Ensure R2 keys are set.");
       }
       setIsUploading(false);
       e.target.value = null;
    };
    
    const handleDownload = async (fileKey) => {
        try {
            const url = await getR2FileUrl(fileKey);
            window.open(url, "_blank");
        } catch (e) {
            alert("Download failed.");
        }
    };
    
    const handleDeleteFile = async (docId, fileKey) => {
        if (!window.confirm("Delete this agreement?")) return;
        try {
            await deleteR2File(fileKey);
            await supabase.from('documents').delete().eq('id', docId);
            setAgreements(agreements.filter(a => a.id !== docId));
        } catch (e) {
            alert("Delete failed.");
        }
    };

  
  const [clientData, setClientData] = useState({
    id: client?.id,
    name: client?.name || "",
    phone: client?.phone || "",
    email: client?.email || "",
    address: client?.address || "",
    company: client?.company || "",
    gst: client?.gst || "",
    status: client?.status || "Active",
    assigned_to: client?.assigned_to || null,
    leadData: client?.leadData || {},
  });

  useEffect(() => {
    fetchEmployees();
    if (clientData.id) {
       fetchNextTask();
       fetchComments();
    }
  }, [clientData.id]);

  const fetchEmployees = async () => {
    const { data } = await supabase.from('employees').select('id, name, role');
    if (data) setEmployees(data);
  };

  const fetchComments = async () => {
    const { data } = await supabase.from('lead_activities').select('*').eq('client_id', clientData.id).eq('activity_group', 'comment').order('created_at', { ascending: false });
    if (data) setComments(data);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    const userStr = localStorage.getItem('dayal_user');
    const loggedInUser = userStr ? JSON.parse(userStr) : null;
    await supabase.from('lead_activities').insert([{
      client_id: clientData.id,
      activity_type: 'Comment',
      activity_group: 'comment',
      title: 'Internal Note / Comment',
      details: newComment.trim(),
      employee_name: loggedInUser?.name || 'Admin'
    }]);
    setNewComment("");
    fetchComments();
  };

  const fetchNextTask = async () => {
    const { data } = await supabase.from('tasks').select('*').eq('client_id', clientData.id).neq('status', 'Completed').order('due_date', { ascending: true }).limit(1);
    if (data && data.length > 0) setNextTask(data[0]);
    else setNextTask(null);
  };

  const handleCompleteTask = async () => {
    if (!nextTask) return;
    const { error } = await supabase.from('tasks').update({ status: 'Completed' }).eq('id', nextTask.id);
    if (!error) fetchNextTask();
  };

  const handleToggleAssignEmployee = async (employeeId) => {
    let currentAssigned = (clientData.assigned_to || '').split(',').filter(Boolean);
    if (currentAssigned.includes(employeeId)) {
      currentAssigned = currentAssigned.filter(id => id !== employeeId);
    } else {
      currentAssigned.push(employeeId);
    }
    const newAssignedString = currentAssigned.join(',');
    
    setClientData({ ...clientData, assigned_to: newAssignedString || null });
    if (clientData.id) {
       await supabase.from('clients').update({ assigned_to: newAssignedString || null }).eq('id', clientData.id);
       
       if (!currentAssigned.includes(employeeId)) { // wait, currentAssigned already modified. We need to check if it was ADDED.
           // Since we can't reliably check currentAssigned after modification in a generic replace, 
           // let's just create the task unconditionally for now if newAssignedString includes employeeId.
           // Actually, let's just put it right after the update.
           if (newAssignedString.includes(employeeId)) {
             await supabase.from('tasks').insert([{
               name: `Assigned to Client: ${clientData.name || clientData.name || 'Unknown'}`,
               description: `You have been assigned to Client ID: CLIENT-${clientData.id.substring(0,5).toUpperCase()}`,
               status: 'To Do',
               priority: 'High',
               assignee_id: employeeId,
               client_id: clientData.id
             }]);
           }
       }
    }
  };

  const handleQuickAction = (label) => {
    if (label === 'Add Note') {
       setActiveTab('Overview');
       setTimeout(() => {
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
       }, 100);
    } else if (label === 'Schedule') {
       setShowScheduleModal(true);
    } else {
       if (label === 'Call' && clientData?.phone) {
         window.open(`tel:${clientData.phone}`, '_self');
       } else if (label === 'WhatsApp' && clientData?.phone) {
         window.open(`https://wa.me/${clientData.phone.replace(/\D/g, '')}`, '_blank');
       } else if (label === 'Email' && clientData?.email) {
         window.open(`mailto:${clientData.email}`, '_self');
       }
       setCommunicationAction(label);
       setActiveTab('Communication');
    }
  };

  const userStr = localStorage.getItem('dayal_user');
  const loggedInUser = userStr ? JSON.parse(userStr) : null;
  const isAdmin = loggedInUser?.role === 'Admin';

  const tabs = [
    "Overview", "Communication", "Service Requirement", "Service Workspace", 
    ...(isAdmin ? ["Amount"] : []), "Projects", "Tasks", "Timeline", "Site Visit", 
    "Documents"
  ];

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] p-4 sm:p-8 font-sans pb-24">
      {/* 1. Back Navigation */}
      <div className="mb-6 flex items-center gap-2 text-sm text-[#64748B]">
        <button onClick={onBack} className="flex items-center gap-2 hover:text-brand-500 transition">
          <MdArrowBack className="h-5 w-5" />
          <span className="font-semibold">Back to Clients</span>
        </button>
        <span className="mx-2">/</span>
        <span>Pages</span>
        <span className="mx-2">/</span>
        <span>Clients</span>
      </div>

      {/* 2. Hero Client Card */}
      <div className="rounded-[20px] bg-gradient-to-r from-[#16A34A]/10 to-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)] border border-[#E2E8F0] mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="flex items-center gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#16A34A] text-3xl font-bold text-white shadow-md">
            {(clientData.company || clientData.name).charAt(0) || 'C'}
          </div>
          <div>
            <h1 className="text-[32px] font-bold text-[#0F172A]">{clientData.company || clientData.name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-[#475569]">
              {clientData.company && <span className="flex items-center gap-1"><MdPerson /> {clientData.name} (Contact)</span>}
              <span className="flex items-center gap-1"><MdPhone /> {clientData.phone || 'Not provided'}</span>
              {clientData.email && <span className="flex items-center gap-1"><MdEmail /> {clientData.email}</span>}
              {clientData.address && <span className="flex items-center gap-1"><MdLocationOn /> {clientData.address}</span>}
            </div>
            <div className="mt-3 flex gap-2 text-xs flex-wrap">
              <span className="rounded-md bg-gray-100 px-3 py-1 text-[#64748B] font-medium flex items-center gap-1"><MdDomain /> GST: {clientData.gst || 'Not Provided'}</span>
              <span className="rounded-md bg-blue-50 border border-blue-100 px-3 py-1 text-blue-700 font-bold uppercase tracking-wider">Source: {clientData.source || 'Website'}</span>
              <span className="rounded-md bg-gray-100 px-3 py-1 text-[#64748B] font-medium">
                Assigned: {clientData.assigned_to 
                  ? (clientData.assigned_to.split(',').filter(Boolean).map(id => employees.find(e => e.id === id)?.name).filter(Boolean).join(', ') || 'Unknown') 
                  : 'Unassigned'}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-col items-end md:mt-0">
          <span className={`rounded-full px-4 py-1 text-xs font-bold tracking-wide ${clientData.status === 'Active' ? 'bg-[#16A34A] text-white' : 'bg-gray-500 text-white'}`}>
            STATUS: {clientData.status.toUpperCase()}
          </span>
          <p className="mt-3 text-sm font-semibold text-[#64748B]">Total Lifetime Value</p>
          <p className="text-[28px] font-bold text-[#16A34A]">₹0.00</p>
        </div>
      </div>

      {/* 3. KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {[
          { title: "Active Projects", value: "0", icon: <MdBusinessCenter /> },
          ...(isAdmin ? [
            { title: "Total Invoiced", value: "₹0.00", icon: <MdAttachMoney /> },
            { title: "Total Received", value: "₹0.00", icon: <MdAttachMoney /> },
            { title: "Outstanding", value: "₹0.00", icon: <MdAttachMoney /> }
          ] : [])
        ].map((kpi, i) => (
          <Card key={i} extra="p-6 hover:-translate-y-1 transition duration-200">
            <div className="flex items-center gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-full text-xl ${i === 3 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                {kpi.icon}
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B] uppercase">{kpi.title}</p>
                <p className={`text-[20px] font-bold ${i === 3 ? 'text-red-600' : 'text-[#0F172A]'}`}>{kpi.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Schedule Task Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
               <h2 className="text-xl font-bold text-[#0F172A]">Schedule Follow-up</h2>
               <MdClose className="text-2xl text-[#64748B] cursor-pointer hover:text-red-500" onClick={() => setShowScheduleModal(false)} />
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              
              const userStr = localStorage.getItem('dayal_user');
              const loggedInUser = userStr ? JSON.parse(userStr) : null;
              
              const { error } = await supabase.from('tasks').insert([{
                name: formData.get('name'),
                due_date: formData.get('due_date') || null,
                priority: 'High',
                status: 'To Do',
                assignee_id: clientData.assigned_to || null,
                client_id: clientData.id,
                creator_id: loggedInUser?.id,
                category: 'Client Follow-up'
              }]);
              if (error) alert('Failed to schedule task: ' + error.message);
              else {
                setShowScheduleModal(false);
                fetchNextTask();
              }
            }}>
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700">Task Description</label>
                <input type="text" name="name" required placeholder="e.g., Follow up call" className="w-full mt-1 p-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500" />
              </div>
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700">Date & Time</label>
                <input type="datetime-local" name="due_date" required className="w-full mt-1 p-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500" />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowScheduleModal(false)} className="px-4 py-2 rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700">Schedule Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Content (72%) */}
        <div className="w-full lg:w-[72%]">
          {/* Tabs */}
          <div className="sticky top-0 z-10 flex gap-2 overflow-x-auto bg-[#F8FAFC] py-4 border-b border-[#E2E8F0] mb-6">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-[12px] px-5 py-2.5 text-sm font-semibold transition whitespace-nowrap ${
                  activeTab === tab 
                  ? 'bg-[#16A34A] text-white shadow-md' 
                  : 'text-[#64748B] hover:bg-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[500px]">
            {activeTab === "Overview" && (
              <div className="grid grid-cols-1 gap-6">
                
                {/* Client Info Card */}
                <Card extra="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-[16px] font-semibold text-[#0F172A]">Entity Information</h3>
                    {isEditingClient ? (
                       <button onClick={() => setIsEditingClient(false)} className="text-[#16A34A] flex items-center gap-1 font-bold text-sm"><MdSave /> Save</button>
                    ) : (
                       <MdEdit onClick={() => setIsEditingClient(true)} className="text-[#64748B] cursor-pointer hover:text-[#16A34A]" />
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {isEditingClient ? (
                      <>
                        <div className="flex flex-col"><label className="text-xs text-gray-500">Company Name</label><input type="text" className="border rounded p-2 text-sm outline-none border-[#16A34A]" value={clientData.company} onChange={e => setClientData({...clientData, company: e.target.value})} /></div>
                        <div className="flex flex-col"><label className="text-xs text-gray-500">Contact Name</label><input type="text" className="border rounded p-2 text-sm outline-none border-[#16A34A]" value={clientData.name} onChange={e => setClientData({...clientData, name: e.target.value})} /></div>
                        <div className="flex flex-col"><label className="text-xs text-gray-500">Phone</label><input type="text" className="border rounded p-2 text-sm outline-none border-[#16A34A]" value={clientData.phone} onChange={e => setClientData({...clientData, phone: e.target.value})} /></div>
                        <div className="flex flex-col"><label className="text-xs text-gray-500">Email</label><input type="email" className="border rounded p-2 text-sm outline-none border-[#16A34A]" value={clientData.email} onChange={e => setClientData({...clientData, email: e.target.value})} /></div>
                        <div className="flex flex-col"><label className="text-xs text-gray-500">GST / PAN</label><input type="text" className="border rounded p-2 text-sm outline-none border-[#16A34A]" value={clientData.gst} onChange={e => setClientData({...clientData, gst: e.target.value})} /></div>
                        <div className="flex flex-col"><label className="text-xs text-gray-500">Billing Address</label><input type="text" className="border rounded p-2 text-sm outline-none border-[#16A34A]" value={clientData.address} onChange={e => setClientData({...clientData, address: e.target.value})} /></div>
                      </>
                    ) : (
                      <>
                        <div className="flex flex-col"><span className="text-[12px] font-medium text-[#64748B]">Company / Legal Name</span><span className="text-[14px] font-semibold text-[#0F172A]">{clientData.company || "—"}</span></div>
                        <div className="flex flex-col"><span className="text-[12px] font-medium text-[#64748B]">Primary Contact</span><span className="text-[14px] font-semibold text-[#0F172A]">{clientData.name || "—"}</span></div>
                        <div className="flex flex-col"><span className="text-[12px] font-medium text-[#64748B]">Phone Number</span><span className="text-[14px] font-semibold text-[#0F172A]">{clientData.phone || "—"}</span></div>
                        <div className="flex flex-col"><span className="text-[12px] font-medium text-[#64748B]">Email Address</span><span className="text-[14px] font-semibold text-[#0F172A]">{clientData.email || "—"}</span></div>
                        <div className="flex flex-col"><span className="text-[12px] font-medium text-[#64748B]">GST / PAN</span><span className="text-[14px] font-semibold text-[#0F172A]">{clientData.gst || "—"}</span></div>
                        <div className="flex flex-col"><span className="text-[12px] font-medium text-[#64748B]">Billing Address</span><span className="text-[14px] font-semibold text-[#0F172A]">{clientData.address || "—"}</span></div>
                      </>
                    )}
                  </div>
                </Card>

                {/* Master Contracts Card */}
                  <Card extra="p-6">
                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-[16px] font-semibold text-[#0F172A]">Master Contracts & Agreements</h3>
                      <button onClick={handleUploadClick} disabled={isUploading} className="text-sm font-bold text-[#16A34A] hover:underline disabled:opacity-50">
                          {isUploading ? "Uploading..." : "Upload NDA/MSA"}
                      </button>
                    </div>
                    {agreements.length === 0 ? (
                        <div onClick={handleUploadClick} className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed border-[#E2E8F0] rounded-xl bg-gray-50 cursor-pointer hover:bg-green-50 hover:border-green-300 transition">
                          <MdFolder className="text-4xl text-gray-300 mb-2" />
                          <p className="text-sm text-[#64748B]">{isUploading ? "Uploading..." : "Click here to upload master agreements."}</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3 max-h-[150px] overflow-y-auto custom-scrollbar">
                           {agreements.map(doc => (
                              <div key={doc.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-white shadow-sm">
                                 <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="w-8 h-8 rounded bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                                       <MdFolder size={18} />
                                    </div>
                                    <span className="text-[13px] font-semibold text-[#0F172A] truncate" title={doc.name}>{doc.name}</span>
                                 </div>
                                 <div className="flex items-center gap-2 shrink-0">
                                    <button onClick={() => handleDownload(doc.file_url)} className="text-gray-500 hover:text-blue-600 p-1 transition"><MdDownload size={18} /></button>
                                    <button onClick={() => handleDeleteFile(doc.id, doc.file_url)} className="text-gray-500 hover:text-red-500 p-1 transition"><MdDelete size={18} /></button>
                                 </div>
                              </div>
                           ))}
                        </div>
                    )}
                  </Card>
                  
                  <Card extra="col-span-1 md:col-span-2 p-6 flex flex-col h-[500px]">
                  <h3 className="text-[16px] font-semibold text-[#0F172A] mb-4">Comments</h3>
                  <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
                    {comments.length === 0 ? (
                       <p className="text-sm text-gray-400 italic">No comments yet. Be the first to add one!</p>
                    ) : (
                       comments.map(comment => (
                         <div key={comment.id} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                           <p className="text-sm text-[#475569] whitespace-pre-wrap">{comment.details}</p>
                           <div className="mt-2 text-[11px] text-gray-400 flex items-center justify-between">
                             <span>{comment.employee_name || 'Admin'}</span>
                             <span>{new Date(comment.created_at).toLocaleString()}</span>
                           </div>
                         </div>
                       ))
                    )}
                  </div>
                  <div className="mt-auto flex gap-2 pt-4 border-t border-gray-100">
                    <textarea 
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                      placeholder="Add a comment..." 
                      className="w-full border rounded-lg p-2 text-sm outline-none resize-none h-[42px] focus:border-blue-500" 
                    />
                    <button onClick={handleAddComment} className="bg-blue-600 text-white px-4 rounded-lg font-bold hover:bg-blue-700 transition h-[42px]">Post</button>
                  </div>
                </Card>
              </div>
            )}
            
            {/* Financials removed intentionally per user */}

            {activeTab === "Projects" && (
              <TabProjects clientData={clientData} />
            )}
            
            {activeTab === "Service Requirement" && (
              <TabServiceRequirement leadData={clientData.leadData} setLeadData={(newData) => setClientData({...clientData, leadData: newData})} />
            )}
            
            {activeTab === "Service Workspace" && (
              <TabServiceWorkspace leadData={clientData.leadData} />
            )}
            
            {activeTab === "Amount" && (
              <TabEstimate leadData={clientData} isClient={true} />
            )}
            
            {activeTab === "Tasks" && (
              <TabTasks leadData={clientData} isClient={true} />
            )}

            {activeTab === "Timeline" && (
              <TabTimeline leadData={clientData} isClient={true} />
            )}

            {activeTab === "Site Visit" && (
              <TabSiteVisit leadData={clientData} />
            )}

            {activeTab === "Documents" && (
              <TabDocuments leadData={clientData} />
            )}

            {activeTab === "Communication" && (
              <TabCommunication leadData={clientData} action={communicationAction} setAction={setCommunicationAction} isClient={true} />
            )}
          </div>
        </div>

        {/* Right Sidebar (28%) */}
        <div className="w-full lg:w-[28%] relative">
          <div className="sticky top-6 flex flex-col gap-6">

            {activeTab === "Financials & Billing" && (
              <Card extra="p-6 border-t-4 border-t-[#DC2626]">
                <h3 className="text-[16px] font-semibold text-[#0F172A] mb-4">Outstanding Summary</h3>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center"><span className="text-[13px] text-[#64748B]">Total Due</span><span className="text-[14px] font-bold text-[#0F172A]">₹ —</span></div>
                  <div className="flex justify-between items-center"><span className="text-[13px] text-[#64748B]">Overdue Amount</span><span className="text-[14px] font-bold text-[#DC2626]">₹ —</span></div>
                  <div className="flex justify-between items-center"><span className="text-[13px] text-[#64748B]">Next Due Date</span><span className="text-[14px] font-bold text-[#0F172A]">—</span></div>
                </div>
                <button className="w-full h-10 rounded-lg bg-[#DC2626] text-[13px] font-bold text-white hover:bg-red-700 transition">
                  Collect Payment
                </button>
              </Card>
            )}

            <Card extra="p-6">
              <h3 className="text-[16px] font-semibold text-[#0F172A] mb-1">Next Follow-up</h3>
              {nextTask ? (
                <>
                  <p className="text-[14px] font-bold text-[#DC2626] mb-1">{nextTask.due_date ? new Date(nextTask.due_date).toLocaleString() : 'No Due Date'}</p>
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
                {activeTab === "Financials & Billing" ? (
                  [
                    { label: "New Invoice", icon: <MdAttachMoney /> },
                    { label: "Add Receipt", icon: <MdAttachMoney /> },
                    { label: "Change Order", icon: <MdEdit /> },
                    { label: "Statement", icon: <FiFileText /> },
                  ].map((act, i) => (
                    <button key={i} className="flex flex-col items-center justify-center rounded-[12px] border border-[#E2E8F0] p-3 hover:bg-[#F8FAFC] transition hover:border-[#16A34A] group">
                      <span className="text-[#64748B] group-hover:text-[#16A34A] text-xl mb-1 transition-colors">{act.icon}</span>
                      <span className="text-[11px] font-medium text-[#475569]">{act.label}</span>
                    </button>
                  ))
                ) : (
                  [
                    { label: "Call", icon: <MdPhone /> },
                    { label: "WhatsApp", icon: <MdMessage /> },
                    { label: "Email", icon: <MdEmail /> },
                    { label: "Schedule", icon: <FiClock /> },
                    { label: "Add Note", icon: <FiFileText /> },
                  ].map((act, i) => (
                    <button key={i} onClick={() => handleQuickAction(act.label)} className="flex flex-col items-center justify-center rounded-[12px] border border-[#E2E8F0] p-3 hover:bg-[#F8FAFC] transition hover:border-[#16A34A] group">
                      <span className="text-[#64748B] group-hover:text-[#16A34A] text-xl mb-1 transition-colors">{act.icon}</span>
                      <span className="text-[11px] font-medium text-[#475569]">{act.label}</span>
                    </button>
                  ))
                )}
              </div>
            </Card>

            <Card extra="p-6">
              <h3 className="text-[16px] font-semibold text-[#0F172A] mb-4">Assigned Team</h3>
              <div className="space-y-4">
                  <div className="max-h-[200px] overflow-y-auto border border-gray-100 rounded-lg p-2 space-y-2">
                    {employees.map(emp => {
                      const isAssigned = (clientData.assigned_to || '').split(',').includes(emp.id);
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
    </div>
  );
};

export default ClientDetail;
