import React, { useState, useEffect, useRef } from "react";
import Card from "components/card";
import { createClient } from "@supabase/supabase-js";
import { MdSearch, MdDesignServices, MdGavel, MdOutlineArchitecture, MdBusinessCenter, MdAttachMoney, MdAdd, MdCloudDownload, MdCloudUpload, MdMoreVert, MdFolder, MdChevronRight, MdChevronLeft, MdClose, MdCheckCircle, MdDelete, MdFoundation, MdLocationCity, MdEngineering } from "react-icons/md";
import { FiFileText, FiMap } from "react-icons/fi";
import { 
  MdDomainVerification, MdLayers, MdHouse, MdOutlineFoundation,
  MdPhotoSizeSelectSmall, MdWaterDrop
} from "react-icons/md";
import ProjectDetail from "./ProjectDetail";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);

const EXECUTION_PROJECTS = [
  { id: "Turnkey Construction", icon: <MdFoundation size={24} /> },
  { id: "Commercial Construction", icon: <MdLocationCity size={24} /> },
  { id: "Industrial Setup", icon: <MdEngineering size={24} /> },
  { id: "Renovation & Remodeling", icon: <MdOutlineArchitecture size={24} /> },
  { id: "Interior Execution", icon: <MdBusinessCenter size={24} /> },
  { id: "Landscaping", icon: <MdCloudDownload size={24} /> },
];

const Projects = () => {
  const [selectedCase, setSelectedCase] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterProg, setFilterProg] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [showNewModal, setShowNewModal] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [allClients, setAllClients] = useState([]);
  const [clientSearch, setClientSearch] = useState("");
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const searchRef = useRef(null);

  const [newCase, setNewCase] = useState({
     clientType: "new", clientName: "", phone: "", whatsapp: "", email: "", address: "", clientId: "",
     selectedProjects: [],
     projectCharge: "", advanceAmount: "", targetDate: ""
  });

  useEffect(() => {
    const fetchClients = async () => {
      const { data, error } = await supabase.from("clients").select("*");
      if (!error && data) {
        const merged = data.map(client => {
           const localData = JSON.parse(localStorage.getItem(`client_${client.id}`) || "{}");
           return { ...client, ...localData };
        });
        setAllClients(merged);
      }
    };
    fetchClients();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowClientDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const userStr = localStorage.getItem('dayal_user');
  const loggedInUser = userStr ? JSON.parse(userStr) : null;
  const isAdmin = loggedInUser?.role === 'Admin';
  
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     const fetchProjects = async () => {
        setLoading(true);
        let query = supabase.from('projects').select('*').order('created_at', { ascending: false });
          if (!isAdmin && loggedInUser?.id) {
             query = query.like('assigned_to', `%${loggedInUser.id}%`);
          }
          const { data, error } = await query;
        
        if (!error && data) {
           const { data: clientsData } = await supabase.from('clients').select('id, name');
           const merged = data.map(proj => {
               const clientMatch = clientsData?.find(c => c.id === proj.client_id);
               return { ...proj, client: clientMatch || { name: 'Unknown Client' } };
           });
           setProjects(merged);
        }
        setLoading(false);
     };
     fetchProjects();
  }, [refreshTrigger]);

  const handleDelete = async (e, id) => {
     e.stopPropagation();
     if (window.confirm("Are you sure you want to delete this project case?")) {
        await supabase.from("projects").delete().eq("id", id);
        setRefreshTrigger(p => p + 1);
     }
  };

  const handleCreate = async (e) => {
     e.preventDefault();
     let finalClientId = newCase.clientId;

     if (newCase.clientType === "new") {
       const { data: newClientData, error } = await supabase.from("clients").insert([{
         name: newCase.clientName,
         status: 'active'
       }]).select();
       
       if (!error && newClientData && newClientData.length > 0) {
         finalClientId = newClientData[0].id;
         localStorage.setItem(`client_${finalClientId}`, JSON.stringify({
            phone: newCase.phone,
            whatsapp: newCase.whatsapp,
            email: newCase.email,
            address: newCase.address
         }));
       } else {
         alert("Failed to create new client. Please try again.");
         return;
       }
     }

     const title = newCase.selectedProjects.length > 0 ? newCase.selectedProjects[0] + (newCase.selectedProjects.length > 1 ? ' & Others' : '') : "Unnamed Project";
     
     const metadata = {
        requirements: newCase.selectedProjects,
        financials: {
           total: newCase.projectCharge || 0,
           advance: newCase.advanceAmount || 0,
           targetDate: newCase.targetDate
        }
     };

     const { error: projError } = await supabase.from("projects").insert([{
        name: title,
        client_id: finalClientId,
        description: JSON.stringify(metadata),
        status: "Active"
     }]);

     if (projError) {
        alert("Failed to create project case: " + projError.message);
        return;
     }

     setNewCase({
       clientType: "new", clientName: "", phone: "", whatsapp: "", email: "", address: "", clientId: "",
       selectedProjects: [], projectCharge: "", advanceAmount: "", targetDate: ""
     });
     setModalStep(1);
     setShowNewModal(false);
     setRefreshTrigger(prev => prev + 1);
  };

  const toggleProject = (id) => {
      setNewCase(prev => {
          const arr = prev.selectedProjects || [];
          if (arr.includes(id)) return { ...prev, selectedProjects: arr.filter(x => x !== id) };
          return { ...prev, selectedProjects: [...arr, id] };
      });
  };

  if (selectedCase) {
    return <ProjectDetail projData={selectedCase} onBack={() => setSelectedCase(null)} onUpdate={(updated) => { setSelectedCase(updated); setRefreshTrigger(p => p + 1); }} />;
  }

  const kpis = [
     { title: "Total Projects", value: projects.length || "0" },
     { title: "Active Cases", value: projects.filter(s => s.status === 'Active').length || "0" },
     { title: "Completed", value: projects.filter(s => s.status === 'Completed').length || "0" },
     ...(isAdmin ? [{ title: "Total Revenue", value: "₹ 0" }] : []),
     ...(isAdmin ? [{ title: "Received", value: "₹ 0" }] : []),
     ...(isAdmin ? [{ title: "Pending", value: "₹ 0" }] : [])
  ];

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen pt-12 pb-24 font-sans text-[#475569]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 mt-8 md:mt-2">
          <div>
            <p className="text-[12px] font-medium text-[#64748B] mb-1">Pages / Execution</p>
            <h1 className="text-[32px] font-bold text-[#0F172A] leading-tight">Execution Projects</h1>
            <p className="text-[14px] text-[#64748B] mt-1">Manage turnkey construction, interior execution, and remodeling projects.</p>
          </div>
          <div className="flex gap-3 z-10 relative">
            <button onClick={() => setShowNewModal(true)} className="h-10 px-5 rounded-[12px] bg-[#2563EB] text-[14px] font-bold text-white hover:bg-[#1D4ED8] flex items-center gap-2 transition shadow-sm">
              <MdAdd /> New Project
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {kpis.map((kpi, i) => (
             <Card key={i} extra="p-4 border border-[#E2E8F0] shadow-sm hover:shadow-md transition">
                <p className="text-[11px] font-semibold text-[#64748B] uppercase mb-1">{kpi.title}</p>
                <p className={`text-[20px] font-bold ${i === 5 ? 'text-[#DC2626]' : 'text-[#0F172A]'}`}>{kpi.value}</p>
             </Card>
          ))}
        </div>

        {/* Search & Filters */}
        <Card extra="p-4 border border-[#E2E8F0] mb-6 shadow-sm">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <div className="relative w-full lg:w-[350px]">
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#64748B] text-xl" />
              <input type="text" placeholder="Search client, case ID, project..." className="w-full pl-10 pr-4 h-10 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none focus:border-[#2563EB] transition-colors" />
            </div>
            <div className="flex flex-wrap gap-2 w-full lg:w-auto">
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="h-10 px-4 rounded-[10px] border border-[#E2E8F0] text-[13px] font-medium text-[#475569] bg-white outline-none hover:border-[#2563EB] cursor-pointer">
                <option value="">All Projects</option>
                {EXECUTION_PROJECTS.map(ds => <option key={ds.id} value={ds.id}>{ds.id}</option>)}
              </select>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="h-10 px-4 rounded-[10px] border border-[#E2E8F0] text-[13px] font-medium text-[#475569] bg-white outline-none hover:border-[#2563EB] cursor-pointer">
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <select value={filterProg} onChange={(e) => setFilterProg(e.target.value)} className="h-10 px-4 rounded-[10px] border border-[#E2E8F0] text-[13px] font-medium text-[#475569] bg-white outline-none hover:border-[#2563EB] cursor-pointer">
                <option value="">All Progress</option>
                <option value="0-25">0% - 25%</option>
                <option value="26-75">26% - 75%</option>
                <option value="76-99">76% - 99%</option>
                <option value="100">100% Completed</option>
              </select>
              <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="h-10 px-4 rounded-[10px] border border-[#E2E8F0] text-[13px] font-medium text-[#475569] bg-white outline-none hover:border-[#2563EB] cursor-pointer">
                <option value="">Sort: Newest First</option>
                <option value="oldest">Sort: Oldest First</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Table */}
        <Card extra="border border-[#E2E8F0] overflow-hidden shadow-sm">
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse min-w-[900px]">
               <thead>
                 <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                   <th className="py-4 px-6 text-[12px] font-medium text-[#64748B] uppercase tracking-wider">Case ID</th>
                   <th className="py-4 px-4 text-[12px] font-medium text-[#64748B] uppercase tracking-wider">Client</th>
                   <th className="py-4 px-4 text-[12px] font-medium text-[#64748B] uppercase tracking-wider">Project</th>
                   <th className="py-4 px-4 text-[12px] font-medium text-[#64748B] uppercase tracking-wider">Progress</th>
                   
                   <th className="py-4 px-6 text-[12px] font-medium text-[#64748B] uppercase tracking-wider text-right">Actions</th>
                 </tr>
               </thead>
               <tbody>
                  {(() => {
                     let filtered = projects;
                     if (searchTerm) {
                        const lower = searchTerm.toLowerCase();
                        filtered = filtered.filter(p => (p.id && p.id.toLowerCase().includes(lower)) || (p.client?.name && p.client.name.toLowerCase().includes(lower)) || (p.client?.phone && p.client.phone.toLowerCase().includes(lower)) || (p.client?.address && p.client.address.toLowerCase().includes(lower)) || (p.name && p.name.toLowerCase().includes(lower)));
                     }
                     if (filterType) {
                        filtered = filtered.filter(p => p.description && p.description.includes(filterType));
                     }
                     if (filterStatus) {
                        filtered = filtered.filter(p => p.status === filterStatus);
                     }
                     
                     let mapped = filtered.map(proj => {
                        let prog = 0;
                        try {
                           const meta = JSON.parse(proj.description || "{}");
                           if (meta.steps && meta.steps.length > 0) {
                              const comp = meta.steps.filter(st => st.completed).length;
                              prog = Math.round((comp / meta.steps.length) * 100);
                           }
                        } catch(e) {}
                        return { ...proj, calcProgress: prog };
                     });
                     
                     if (filterProg) {
                        mapped = mapped.filter(p => {
                           if (filterProg === "0-25") return p.calcProgress >= 0 && p.calcProgress <= 25;
                           if (filterProg === "26-75") return p.calcProgress > 25 && p.calcProgress <= 75;
                           if (filterProg === "76-99") return p.calcProgress > 75 && p.calcProgress < 100;
                           if (filterProg === "100") return p.calcProgress === 100;
                           return true;
                        });
                     }
                     
                     if (sortOrder === "oldest") {
                        mapped.sort((a,b) => new Date(a.created_at) - new Date(b.created_at));
                     } else {
                        mapped.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
                     }

                     if (loading) return <tr><td colSpan="5" className="py-12 text-center text-[#64748B]">Loading...</td></tr>;
                     if (mapped.length === 0) return <tr><td colSpan="5" className="py-24 text-center">No projects found.</td></tr>;
                     
                     return mapped.map(proj => (
                        <tr 
                           key={proj.id} 
                           onClick={() => setSelectedCase(proj)}
                           className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition cursor-pointer"
                        >
                           <td className="py-4 px-6">
                              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-bold">PRJ-{proj.id.substring(0, 5).toUpperCase()}</span>
                           </td>
                           <td className="py-4 px-4 font-bold text-[#0F172A]">{proj.client?.name || "Unknown"}</td>
                           <td className="py-4 px-4 text-[#0F172A] font-medium">{(proj?.name || proj?.title)}</td>
                           <td className="py-4 px-4">
                              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                 <div className="h-full bg-[#2563EB]" style={{width: `${proj.calcProgress || 0}%`}}></div>
                              </div>
                              <span className="text-[10px] font-bold text-[#64748B]">{proj.calcProgress || 0}%</span>
                           </td>
                           <td className="py-4 px-6 text-right">
                              <button onClick={(e) => { e.stopPropagation(); handleDelete(e, proj.id); }} className="text-[#DC2626] hover:bg-red-50 p-2 rounded-lg transition" title="Delete Project">
                                 <MdDelete size={20} />
                              </button>
                           </td>
                        </tr>
                     ));
                  })()}
               </tbody>
             </table>
           </div>
        </Card>
      </div>

      {/* New Project Modal (Multi-step) */}
      {showNewModal && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-[900px] bg-white rounded-[20px] shadow-2xl flex flex-col max-h-[90vh]">
               {/* Modal Header */}
               <div className="flex justify-between items-center p-6 border-b border-[#E2E8F0]">
                  <div>
                    <h2 className="text-[20px] font-bold text-[#0F172A]">Create New Project</h2>
                    <p className="text-[13px] text-[#64748B]">Step {modalStep} of 3: {modalStep === 1 ? 'Client Information' : modalStep === 2 ? 'Project Requirements' : 'Financials'}</p>
                  </div>
                  <button onClick={() => {setShowNewModal(false); setModalStep(1);}} className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center text-gray-500 transition">
                     <MdClose size={20} />
                  </button>
               </div>
               
               {/* Modal Body */}
               <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
                  {modalStep === 1 && (
                     <div className="animate-fade-in space-y-6">
                        <div className="flex gap-4 mb-4">
                           <button onClick={() => setNewCase({...newCase, clientType: "new"})} className={`px-4 py-2 rounded-lg text-sm font-bold border transition ${newCase.clientType === 'new' ? 'bg-[#2563EB] text-white border-[#2563EB]' : 'bg-white text-[#64748B] border-[#E2E8F0]'}`}>New Client</button>
                           <button onClick={() => setNewCase({...newCase, clientType: "existing"})} className={`px-4 py-2 rounded-lg text-sm font-bold border transition ${newCase.clientType === 'existing' ? 'bg-[#2563EB] text-white border-[#2563EB]' : 'bg-white text-[#64748B] border-[#E2E8F0]'}`}>Existing Client</button>
                        </div>
                        {newCase.clientType === 'existing' ? (
                           <div className="relative mb-6" ref={searchRef}>
                             <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#64748B] text-xl" />
                             <input 
                                type="text" 
                                value={clientSearch}
                                onChange={(e) => {
                                   setClientSearch(e.target.value);
                                   setShowClientDropdown(true);
                                }}
                                onFocus={() => setShowClientDropdown(true)}
                                placeholder="Search client by name or phone..." 
                                className="w-full pl-10 pr-4 h-11 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none focus:border-[#2563EB]" 
                             />
                             {showClientDropdown && (
                                <div className="absolute top-12 left-0 w-full bg-white border border-[#E2E8F0] rounded-[10px] shadow-lg max-h-60 overflow-y-auto z-50">
                                   {allClients.filter(c => c.name?.toLowerCase().includes(clientSearch.toLowerCase()) || c.phone?.includes(clientSearch)).length > 0 ? (
                                      allClients.filter(c => c.name?.toLowerCase().includes(clientSearch.toLowerCase()) || c.phone?.includes(clientSearch)).map(client => (
                                         <div 
                                            key={client.id} 
                                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-[#E2E8F0] last:border-b-0"
                                            onClick={() => {
                                               setClientSearch(client.name);
                                               setNewCase({ ...newCase, clientName: client.name, phone: client.phone || "", whatsapp: client.whatsapp || "", email: client.email || "", address: client.address || "", clientId: client.id });
                                               setShowClientDropdown(false);
                                            }}
                                         >
                                            <p className="text-[14px] font-bold text-[#0F172A]">{client.name}</p>
                                            <p className="text-[12px] text-[#64748B]">{client.phone} {client.email ? `• ${client.email}` : ''}</p>
                                         </div>
                                      ))
                                   ) : (
                                      <div className="px-4 py-3 text-[13px] text-[#64748B]">No clients found.</div>
                                   )}
                                </div>
                             )}
                           </div>
                        ) : (
                           <div className="grid grid-cols-2 gap-4">
                              <div><label className="block text-xs font-bold text-[#475569] mb-1">Full Name *</label><input type="text" value={newCase.clientName} onChange={e => setNewCase({...newCase, clientName: e.target.value})} className="w-full h-10 px-3 rounded-[8px] border border-[#E2E8F0] text-[14px] outline-none focus:border-[#2563EB]" /></div>
                              <div><label className="block text-xs font-bold text-[#475569] mb-1">Phone Number *</label><input type="text" value={newCase.phone} onChange={e => setNewCase({...newCase, phone: e.target.value})} className="w-full h-10 px-3 rounded-[8px] border border-[#E2E8F0] text-[14px] outline-none focus:border-[#2563EB]" /></div>
                              <div className="col-span-2"><label className="block text-xs font-bold text-[#475569] mb-1">Email / Address</label><input type="text" value={newCase.email} onChange={e => setNewCase({...newCase, email: e.target.value})} placeholder="Optional..." className="w-full h-10 px-3 rounded-[8px] border border-[#E2E8F0] text-[14px] outline-none focus:border-[#2563EB]" /></div>
                           </div>
                        )}
                     </div>
                  )}

                  {modalStep === 2 && (
                     <div className="animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {EXECUTION_PROJECTS.map(proj => {
                             const checked = (newCase.selectedProjects || []).includes(proj.id);
                             return (
                               <div 
                                 key={proj.id} 
                                 onClick={() => toggleProject(proj.id)}
                                 className={`cursor-pointer flex flex-col p-4 rounded-xl border-2 transition ${checked ? 'border-[#2563EB] bg-blue-50' : 'border-[#E2E8F0] hover:border-gray-300'}`}
                               >
                                 <div className="flex justify-between items-start mb-2">
                                   <div className={`p-2 rounded-lg ${checked ? 'bg-[#2563EB] text-white' : 'bg-gray-100 text-[#64748B]'}`}>{proj.icon}</div>
                                   {checked && <MdCheckCircle className="text-[#2563EB] text-xl" />}
                                 </div>
                                 <h4 className={`text-sm font-bold mt-2 ${checked ? 'text-[#0F172A]' : 'text-[#475569]'}`}>{proj.id}</h4>
                               </div>
                             );
                          })}
                        </div>
                     </div>
                  )}

                  {modalStep === 3 && (
                     <div className="animate-fade-in max-w-lg mx-auto">
                        <div className="space-y-5">
                           <div>
                              <label className="block text-xs font-bold text-[#475569] mb-1">Total Project Amount (₹)</label>
                              <div className="relative">
                                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                                 <input type="number" value={newCase.projectCharge} onChange={e => setNewCase({...newCase, projectCharge: e.target.value})} className="w-full h-11 pl-8 pr-3 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none focus:border-[#2563EB]" placeholder="0.00" />
                              </div>
                           </div>
                           <div>
                              <label className="block text-xs font-bold text-[#475569] mb-1">Advance Amount Received (₹)</label>
                              <div className="relative">
                                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                                 <input type="number" value={newCase.advanceAmount} onChange={e => setNewCase({...newCase, advanceAmount: e.target.value})} className="w-full h-11 pl-8 pr-3 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none focus:border-[#2563EB]" placeholder="0.00" />
                              </div>
                           </div>
                           <div>
                              <label className="block text-xs font-bold text-[#475569] mb-1">Target Completion Date</label>
                              <input type="date" value={newCase.targetDate} onChange={e => setNewCase({...newCase, targetDate: e.target.value})} className="w-full h-11 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none focus:border-[#2563EB]" />
                           </div>
                        </div>
                     </div>
                  )}
               </div>

               {/* Modal Footer */}
               <div className="p-6 border-t border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC] rounded-b-[20px]">
                  {modalStep > 1 ? (
                     <button onClick={() => setModalStep(s => s - 1)} className="px-5 h-10 rounded-[10px] text-sm font-bold text-[#475569] bg-white border border-[#E2E8F0] hover:bg-gray-50 transition">Back</button>
                  ) : <div></div>}
                  
                  {modalStep < 3 ? (
                     <button 
                        onClick={() => {
                           if (modalStep === 1 && newCase.clientType === 'existing' && !newCase.clientId) {
                              alert('Please select a client.'); return;
                           }
                           setModalStep(s => s + 1);
                        }} 
                        className="px-6 h-10 rounded-[10px] text-sm font-bold text-white bg-[#0F172A] hover:bg-black transition shadow-md"
                     >
                        Next Step
                     </button>
                  ) : (
                     <button onClick={handleCreate} className="flex items-center gap-2 h-10 px-6 rounded-[10px] bg-[#2563EB] text-white font-bold text-sm hover:bg-[#1D4ED8] transition shadow-md">
                        <MdCheckCircle size={18} /> Save & Create Project
                     </button>
                  )}
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default Projects;
