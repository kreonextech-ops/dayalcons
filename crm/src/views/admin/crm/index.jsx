import React, { useState, useEffect } from "react";
import Card from "components/card";
import { createClient } from "@supabase/supabase-js";
import * as XLSX from "xlsx";
import { useRef } from "react";
import LeadDetail from "./LeadDetail";
import { 
  MdSearch, MdPeople, MdLocalFireDepartment, MdToday, MdCheckCircle,
  MdCloudDownload, MdAdd, MdMoreVert, MdKeyboardArrowLeft, MdKeyboardArrowRight,
  MdOutlineRefresh, MdContentCopy, MdArchive, MdDeleteOutline, MdEdit, MdClose
} from "react-icons/md";
import { FiClock } from "react-icons/fi";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);

const CRMLeads = () => {
  const userStr = localStorage.getItem('dayal_user');
  const loggedInUser = userStr ? JSON.parse(userStr) : null;
  const isAdmin = loggedInUser?.role === 'Admin';

  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [filterTemp, setFilterTemp] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [convertLeadData, setConvertLeadData] = useState(null);
  const fileInputRef = useRef(null);
  const [importing, setImporting] = useState(false);

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImporting(true);
    try {
      const reader = new FileReader();
      reader.onload = async (evt) => {
        try {
          const data = evt.target.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });

          // Fetch employees to map "FOLLOW BY" correctly
          const { data: empData } = await supabase.from('employees').select('id, name');
          const empMap = {};
          if (empData) {
             empData.forEach(emp => {
                if (emp.name) {
                   empMap[emp.name.toLowerCase().trim()] = emp.id;
                }
             });
          }

          const inserts = [];
          for (const row of json) {
             const clientName = row["CLIENT DETAILS"];
             if (!clientName) continue;
             
             let leadTemp = "Cold";
             let status = row["STATUS"] || "New";
             const rawStatus = status.toUpperCase();
             if (rawStatus.includes("HOT")) { leadTemp = "Hot"; status = "New"; }
             else if (rawStatus.includes("WARM")) { leadTemp = "Warm"; status = "New"; }
             else if (rawStatus.includes("COLD")) { leadTemp = "Cold"; status = "New"; }
             
             let createdAt = new Date().toISOString();
             if (row["LEAD ARRIVING DATE"]) {
                 const parsed = new Date(row["LEAD ARRIVING DATE"]);
                 if (!isNaN(parsed)) createdAt = parsed.toISOString();
             }
             
             inserts.push({
                name: clientName,
                phone: row["PHONE NO."] || null,
                address: row["ADDRESS"] || null,
                source: row["SOURCE"] || null,
                service_type: row["REQUIREMENT"] || null,
                created_at: createdAt,
                status: status,
                lead_temperature: leadTemp,
                assigned_to: row["FOLLOW BY"] || null,
                notes: row["REMARKS"] || null
             });
          }
          
          const { error } = await supabase.from('leads').insert(inserts);
          if (error) {
             alert("Import failed (Make sure you ran the SQL query to add missing columns!): " + error.message);
          } else {
             alert(`Successfully imported ${inserts.length} leads!`);
             fetchLeads();
          }
        } catch (innerErr) {
          alert("Parse error: " + innerErr.message);
        }
        setImporting(false);
        e.target.value = null; // reset input
      };
      reader.readAsBinaryString(file);
    } catch(err) {
      alert("Error reading file.");
      setImporting(false);
      e.target.value = null;
    }
  };

  const handleExport = () => {
      const dataToExport = leads.map(l => ({
         "CLIENT DETAILS": l.name,
         "ADDRESS": l.address || "",
         "PHONE NO.": l.phone || "",
         "SOURCE": l.source || "",
         "REQUIREMENT": l.service_type || "",
         "LEAD ARRIVING DATE": l.created_at ? new Date(l.created_at).toLocaleDateString() : "",
         "STATUS": l.status,
         "TEMPERATURE": l.lead_temperature || "",
         "FOLLOW BY": l.assigned_to || "",
         "REMARKS": l.notes || ""
      }));
      const ws = XLSX.utils.json_to_sheet(dataToExport);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Leads");
      XLSX.writeFile(wb, "Leads_Export.xlsx");
  };


  const confirmConvert = async () => {
    if (!convertLeadData) return;
    const { data: newClientData, error: insertError } = await supabase.from('clients').insert([{
      name: convertLeadData.name,
      status: 'active'
    }]).select();

    if (!insertError && newClientData && newClientData.length > 0) {
       const clientId = newClientData[0].id;
       localStorage.setItem(`client_${clientId}`, JSON.stringify({
          phone: convertLeadData.phone, email: convertLeadData.email, address: convertLeadData.address, company: convertLeadData.name, leadData: convertLeadData
       }));
       await supabase.from('leads').delete().eq('id', convertLeadData.id);
       setConvertLeadData(null);
       fetchLeads();
    } else {
       alert("Failed to convert to client.");
       setConvertLeadData(null);
    }
  };

  // Modals
  const [showNewLeadModal, setShowNewLeadModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(null); // stores lead object for status update
  const [statusUpdateData, setStatusUpdateData] = useState({ status: "New", lead_temperature: "Warm Lead", reason: "", followup: "" });
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(null); // stores lead object to delete
  const [activeMenu, setActiveMenu] = useState(null); // stores lead id for open menu

  // New Lead Form State
  const [newLead, setNewLead] = useState({
    name: "", phone: "", whatsapp: "", email: "", service_type: "", source: "", address: "", notes: "", status: "New", lead_temperature: "Warm Lead"
  });

  const fetchLeads = async () => {
    setLoading(true);
    let query = supabase.from("leads").select("*").order('created_at', { ascending: false });
      if (!isAdmin && loggedInUser?.id) {
         query = query.like('assigned_to', `%${loggedInUser.id}%`);
      }
      const { data, error } = await query;
    if (!error && data) {
       // Merge with localStorage
       const merged = data.map(lead => {
          const localData = JSON.parse(localStorage.getItem(`lead_${lead.id}`) || "{}");
          return { ...lead, ...localData };
       });
       setLeads(merged);
    }
    setLoading(false);
  };

  useEffect(() => { fetchLeads(); }, []);

  const handleCreateLead = async (e) => {
    e.preventDefault();
    // Only insert schema-supported columns
    const { data: newLeadData, error } = await supabase.from("leads").insert([{
       name: newLead.name,
       phone: newLead.phone,
       service_type: newLead.service_type,
       source: newLead.source === "Other" ? (newLead.source_custom || "Other") : newLead.source,
       status: newLead.status
    }]).select();

    if (!error && newLeadData && newLeadData.length > 0) {
      // Save unmapped fields to localStorage
      const leadId = newLeadData[0].id;
      localStorage.setItem(`lead_${leadId}`, JSON.stringify({
         whatsapp: newLead.whatsapp,
         email: newLead.email,
         address: newLead.address,
         notes: newLead.notes,
         lead_temperature: newLead.lead_temperature
      }));

      setShowNewLeadModal(false);
      setNewLead({ name: "", phone: "", whatsapp: "", email: "", service_type: "", source: "", address: "", notes: "", status: "New" });
      fetchLeads();
    } else {
      console.error("Error creating lead:", error);
      alert("Failed to create lead. Check console.");
    }
  };

  const handleUpdateStatus = async () => {
    if (!showStatusModal) return;
    const leadId = showStatusModal.id;
    
    // Update DB
    const { error } = await supabase.from("leads").update({ status: statusUpdateData.status }).eq("id", leadId);
    if (!error) {
       // Also update localStorage with the temperature
       const localData = JSON.parse(localStorage.getItem(`lead_${leadId}`) || "{}");
       localData.lead_temperature = statusUpdateData.lead_temperature;
       localStorage.setItem(`lead_${leadId}`, JSON.stringify(localData));
       
       if (statusUpdateData.status === "Won") {
          const leadToConvert = leads.find(l => l.id === leadId);
          if (leadToConvert) {
             setConvertLeadData(leadToConvert);
          }
       }
       
       setShowStatusModal(null);
       fetchLeads();
    } else {
       alert("Error updating status: " + error.message);
    }
  };

  const handleDirectStatusChange = async (leadId, newStatus) => {
    const { error } = await supabase.from("leads").update({ status: newStatus }).eq("id", leadId);
    if (error) alert("Error: " + error.message);
    else {
      if (newStatus === "Won") {
        const leadToConvert = leads.find(l => l.id === leadId);
        if (leadToConvert) {
           setConvertLeadData(leadToConvert);
        }
      }
      fetchLeads();
    }
  };

  const handleDirectTempChange = async (leadId, newTemp) => {
    const localData = JSON.parse(localStorage.getItem(`lead_${leadId}`) || "{}");
    localData.lead_temperature = newTemp;
    localStorage.setItem(`lead_${leadId}`, JSON.stringify(localData));
    
    await supabase.from("leads").update({ lead_temperature: newTemp }).eq("id", leadId);
    fetchLeads();
  };

  const handleDeleteLead = async (id) => {
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (!error) {
      setShowDeleteModal(null);
      localStorage.removeItem(`lead_${id}`);
      fetchLeads();
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'New': return 'bg-blue-100 text-blue-700';
      case 'Contacted': return 'bg-purple-100 text-purple-700';
      case 'Site Visit': return 'bg-cyan-100 text-cyan-700';
      case 'Estimate': return 'bg-orange-100 text-orange-700';
      case 'Negotiation': return 'bg-yellow-100 text-yellow-700';
      case 'Won': return 'bg-green-100 text-green-700';
      case 'Lost': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTempColor = (temp) => {
    switch(temp) {
      case 'Hot Lead': return 'bg-red-100 text-red-700';
      case 'Warm Lead': return 'bg-orange-100 text-orange-700';
      case 'Cold Lead': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (selectedLead) {
    return <LeadDetail lead={selectedLead} onBack={() => { setSelectedLead(null); fetchLeads(); }} />;
  }

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen pt-12 pb-24">
      {convertLeadData && (
        <div className="fixed inset-0 z-[99] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-[20px] p-6 w-full max-w-md shadow-2xl transform transition-all">
             <div className="flex justify-between items-center mb-4">
               <h2 className="text-xl font-bold text-[#0F172A]">Convert to Client?</h2>
               <MdClose className="text-2xl text-[#64748B] cursor-pointer hover:text-red-500" onClick={() => setConvertLeadData(null)} />
             </div>
             <p className="text-[#475569] mb-6">You are marking <span className="font-bold text-[#0F172A]">{convertLeadData.name}</span> as "Won". Would you like to remove them from Leads and officially convert them into a Client?</p>
             <div className="flex gap-3 justify-end">
               <button onClick={() => setConvertLeadData(null)} className="px-5 py-2.5 rounded-[10px] font-bold text-[#475569] bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</button>
               <button onClick={confirmConvert} className="px-5 py-2.5 rounded-[10px] font-bold text-white bg-[#16A34A] hover:bg-green-700 transition-colors flex items-center gap-2"><MdCheckCircle /> Convert to Client</button>
             </div>
          </div>
        </div>
      )}
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 font-sans text-[#475569]">
        
        {/* 1. Breadcrumb & Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 mt-8 md:mt-2">
          <div>
            <p className="text-[12px] font-medium text-[#64748B] mb-1">Pages / Leads</p>
            <h1 className="text-[32px] font-bold text-[#0F172A] leading-tight">Leads Management</h1>
          </div>
          <div className="flex gap-3 z-10 relative">
            <input type="file" ref={fileInputRef} onChange={handleImport} accept=".csv, .xlsx, .xls" className="hidden" />
            <button onClick={() => fileInputRef.current.click()} disabled={importing} className="h-10 px-4 rounded-[12px] border border-[#E2E8F0] bg-white text-[14px] font-bold text-[#0F172A] hover:bg-gray-50 flex items-center gap-2 transition disabled:opacity-50">
              <MdCloudDownload /> {importing ? "Importing..." : "Import Excel"}
            </button>
            <button onClick={handleExport} className="h-10 px-4 rounded-[12px] border border-[#E2E8F0] bg-white text-[14px] font-bold text-[#0F172A] hover:bg-gray-50 flex items-center gap-2 transition">
              <MdCloudDownload /> Export Data
            </button>
            <button onClick={() => setShowNewLeadModal(true)} className="h-10 px-5 rounded-[12px] bg-[#2563EB] text-[14px] font-bold text-white hover:bg-[#1D4ED8] flex items-center gap-2 transition shadow-[0_2px_10px_rgba(37,99,235,0.2)]">
              <MdAdd /> New Lead
            </button>
          </div>
        </div>

        {/* 2. KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
             { title: "Total Leads", val: leads.length || "0", icon: <MdPeople className="text-[#2563EB]" />, bg: "bg-blue-50" },
             { title: "Hot Leads", val: leads.filter(l => l.status === 'Qualified' || l.status === 'Negotiation').length || "0", icon: <MdLocalFireDepartment className="text-[#DC2626]" />, bg: "bg-red-50" },
             { title: "Follow-up Today", val: "0", icon: <MdToday className="text-[#F59E0B]" />, bg: "bg-orange-50" },
             { title: "Converted This Month", val: leads.filter(l => l.status === 'Won').length || "0", icon: <MdCheckCircle className="text-[#16A34A]" />, bg: "bg-green-50" }
          ].map((kpi, i) => (
            <Card key={i} extra="p-6 border border-[#E2E8F0] hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)] hover:border-blue-200 transition-all duration-300">
               <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[12px] font-medium text-[#64748B] mb-1">{kpi.title}</p>
                    <p className="text-[28px] font-bold text-[#0F172A] leading-none">{kpi.val}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${kpi.bg}`}>
                     {kpi.icon}
                  </div>
               </div>
            </Card>
          ))}
        </div>

        {/* 3. Search & Filter Toolbar */}
        <Card extra="p-4 border border-[#E2E8F0] mb-6 shadow-sm">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
              <div className="relative w-full lg:w-[350px]">
                <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#64748B] text-xl" />
                <input 
                  type="text" 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  placeholder="Search name, phone, address..." 
                  className="w-full pl-10 pr-4 h-10 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none focus:border-[#2563EB] transition-colors" 
                />
              </div>
              <div className="flex gap-3 w-full lg:w-auto">
                <select 
                  value={filterTemp}
                  onChange={(e) => setFilterTemp(e.target.value)}
                  className="h-10 px-4 rounded-[10px] border border-[#E2E8F0] text-[14px] text-[#475569] outline-none focus:border-[#2563EB] bg-white cursor-pointer"
                >
                  <option value="">All Temperatures</option>
                  <option value="Hot">Hot</option>
                  <option value="Warm">Warm</option>
                  <option value="Cold">Cold</option>
                </select>
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="h-10 px-4 rounded-[10px] border border-[#E2E8F0] text-[14px] text-[#475569] outline-none focus:border-[#2563EB] bg-white cursor-pointer"
                >
                  <option value="">All Statuses</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Proposal Sent">Proposal Sent</option>
                  <option value="Negotiation">Negotiation</option>
                  <option value="Won">Won</option>
                  <option value="Lost">Lost</option>
                </select>
                <select 
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="h-10 px-4 rounded-[10px] border border-[#E2E8F0] text-[14px] text-[#475569] outline-none focus:border-[#2563EB] bg-white cursor-pointer"
                >
                  <option value="newest">Sort: Newest First</option>
                  <option value="oldest">Sort: Oldest First</option>
                </select>
              </div>
            </div>
          </Card>

        {/* 4. Leads Data Table */}
        <Card extra="border border-[#E2E8F0] overflow-hidden shadow-sm">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <th className="py-4 px-6 w-12"><input type="checkbox" className="w-4 h-4 rounded text-[#2563EB] border-[#E2E8F0] cursor-pointer" /></th>
                  <th className="py-4 px-4 text-[12px] font-medium text-[#64748B] uppercase tracking-wider">Lead</th>
                  <th className="py-4 px-4 text-[12px] font-medium text-[#64748B] uppercase tracking-wider">Source</th>
                  <th className="py-4 px-4 text-[12px] font-medium text-[#64748B] uppercase tracking-wider">Service</th>
                  <th className="py-4 px-4 text-[12px] font-medium text-[#64748B] uppercase tracking-wider">Status</th>
                  <th className="py-4 px-4 text-[12px] font-medium text-[#64748B] uppercase tracking-wider">Temperature</th>
                  <th className="py-4 px-4 text-[12px] font-medium text-[#64748B] uppercase tracking-wider">Follow-up</th>
                  <th className="py-4 px-4 text-[12px] font-medium text-[#64748B] uppercase tracking-wider">Assigned</th>
                  <th className="py-4 px-6 text-[12px] font-medium text-[#64748B] uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                  {(() => {
                     let filtered = leads;
                     if (filterStatus) {
                        filtered = filtered.filter(x => x.status === filterStatus);
                     }
                     if (filterTemp) {
                        filtered = filtered.filter(x => x.lead_temperature === filterTemp);
                     }
                     if (sortOrder === "oldest") {
                        filtered.sort((a,b) => new Date(a.created_at) - new Date(b.created_at));
                     } else {
                        filtered.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
                     }
                     if (searchTerm) {
                        const lower = searchTerm.toLowerCase();
                        filtered = filtered.filter(l => 
                           (l.name && l.name.toLowerCase().includes(lower)) || 
                           (l.email && l.email.toLowerCase().includes(lower)) || 
                           (l.phone && l.phone.toLowerCase().includes(lower)) || 
                           (l.company && l.company.toLowerCase().includes(lower)) ||
                           (l.address && l.address.toLowerCase().includes(lower)) ||
                           (l.source && l.source.toLowerCase().includes(lower))
                        );
                     }
                     if (loading) return <tr><td colSpan="7" className="py-12 text-center text-gray-500">Loading leads...</td></tr>;
                     if (filtered.length === 0) return <tr><td colSpan="7" className="py-12 text-center text-gray-500">No leads found.</td></tr>;
                     return filtered.map(lead => (
                        <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedLead(lead)}>
                           <td className="py-4 px-6" onClick={(e) => e.stopPropagation()}>
                              <input type="checkbox" className="w-4 h-4 rounded text-[#2563EB] border-[#E2E8F0] cursor-pointer" />
                           </td>
                           <td className="py-4 px-4">
                              <p className="text-sm text-gray-800 font-bold">{lead.name}</p>
                              {lead.email && <p className="text-[12px] text-gray-500">{lead.email}</p>}
                           </td>
                           <td className="py-4 px-4 text-sm text-gray-600">{lead.source || lead.phone || "-"}</td>
                           <td className="py-4 px-4 text-sm text-gray-600">{lead.service_type || "-"}</td>
                           <td className="py-4 px-4 text-sm">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${lead.status === 'New' ? 'bg-blue-100 text-blue-700' : lead.status === 'Contacted' ? 'bg-yellow-100 text-yellow-700' : lead.status === 'Converted' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                 {lead.status}
                              </span>
                           </td>
                           <td className="py-4 px-4 text-sm text-gray-600 font-medium">
                              {lead.lead_temperature === 'Hot' ? <span className="text-red-500 flex items-center gap-1"><MdLocalFireDepartment /> Hot</span> : 
                               lead.lead_temperature === 'Warm' ? <span className="text-orange-500">Warm</span> : 
                               lead.lead_temperature === 'Cold' ? <span className="text-blue-500">Cold</span> : "-"}
                           </td>
                           <td className="py-4 px-4 text-sm text-gray-600">{lead.created_at ? new Date(lead.created_at).toLocaleDateString() : "-"}</td>
                           <td className="py-4 px-4 text-sm font-medium text-gray-800">
                              {lead.assigned_to ? (lead.assigned_to.includes("-") ? `EMP-${lead.assigned_to.substring(0, 5).toUpperCase()}` : lead.assigned_to) : "Unassigned"}
                           </td>
                           <td className="py-4 px-6 text-right">
                              <button onClick={(e) => { e.stopPropagation(); handleDeleteLead(lead.id); }} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition" title="Delete Lead">
                                 <MdDeleteOutline size={20} />
                              </button>
                           </td>
                        </tr>
                     ));
                  })()}
               </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="p-4 border-t border-[#E2E8F0] flex justify-between items-center bg-white">
             <span className="text-[13px] font-medium text-[#64748B]">Showing {leads.length > 0 ? `1 - ${leads.length}` : '—'} of {leads.length > 0 ? leads.length : '—'} leads</span>
             <div className="flex gap-1">
               <button className="h-8 px-3 rounded border border-[#E2E8F0] text-[13px] font-medium text-[#64748B] hover:bg-gray-50 flex items-center transition"><MdKeyboardArrowLeft /> Prev</button>
               <button className="h-8 px-3 rounded bg-[#2563EB] text-white text-[13px] font-medium shadow-sm">1</button>
               <button className="h-8 px-3 rounded border border-[#E2E8F0] text-[13px] font-medium text-[#64748B] hover:bg-gray-50 flex items-center transition">Next <MdKeyboardArrowRight /></button>
             </div>
          </div>
        </Card>

      </div>

      {/* New Lead Modal */}
      {showNewLeadModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-[600px] bg-white rounded-[20px] shadow-[0_20px_60px_rgba(15,23,42,0.2)] flex flex-col max-h-[90vh] animate-fade-in">
            <div className="p-6 border-b border-[#E2E8F0] flex justify-between items-center bg-white rounded-t-[20px]">
              <h2 className="text-[20px] font-bold text-[#0F172A]">New Lead</h2>
            </div>
            <div className="p-6 overflow-y-auto flex-1 bg-white">
              <form id="newLeadForm" onSubmit={handleCreateLead} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-[12px] font-bold text-[#475569] mb-1.5 uppercase tracking-wide">Full Name</label>
                  <input required value={newLead.name} onChange={e=>setNewLead({...newLead, name: e.target.value})} type="text" placeholder="Enter full name" className="w-full h-11 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] text-[#0F172A] outline-none focus:border-[#2563EB] transition-colors" />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#475569] mb-1.5 uppercase tracking-wide">Phone Number</label>
                  <input required value={newLead.phone} onChange={e=>setNewLead({...newLead, phone: e.target.value})} type="text" placeholder="Enter phone" className="w-full h-11 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] text-[#0F172A] outline-none focus:border-[#2563EB] transition-colors" />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#475569] mb-1.5 uppercase tracking-wide">WhatsApp</label>
                  <input value={newLead.whatsapp} onChange={e=>setNewLead({...newLead, whatsapp: e.target.value})} type="text" placeholder="Enter WhatsApp" className="w-full h-11 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] text-[#0F172A] outline-none focus:border-[#2563EB] transition-colors" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[12px] font-bold text-[#475569] mb-1.5 uppercase tracking-wide">Email Address</label>
                  <input value={newLead.email} onChange={e=>setNewLead({...newLead, email: e.target.value})} type="email" placeholder="Enter email" className="w-full h-11 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] text-[#0F172A] outline-none focus:border-[#2563EB] transition-colors" />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#475569] mb-1.5 uppercase tracking-wide">Service</label>
                  <select value={newLead.service_type} onChange={e=>setNewLead({...newLead, service_type: e.target.value})} className="w-full h-11 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] text-[#0F172A] outline-none focus:border-[#2563EB] transition-colors cursor-pointer bg-white">
                    <option value="">Select service</option>
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Interior Design">Interior Design</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#475569] mb-1.5 uppercase tracking-wide">Lead Source</label>
                  <select value={newLead.source} onChange={e=>setNewLead({...newLead, source: e.target.value})} className="w-full h-11 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] text-[#0F172A] outline-none focus:border-[#2563EB] transition-colors cursor-pointer bg-white">
                    <option value="">Select source</option>
                    <option value="Website">Website</option>
                    <option value="Referral">Referral</option>
                    <option value="Walk-in">Walk-in</option>
                    <option value="Other">Other</option>
                  </select>
                  {newLead.source === "Other" && (
                    <input type="text" placeholder="Please specify..." onChange={e => setNewLead({...newLead, source_custom: e.target.value})} className="w-full h-11 px-3 mt-2 rounded-[10px] border border-[#E2E8F0] text-[14px] text-[#0F172A] outline-none focus:border-[#2563EB] transition-colors" />
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[12px] font-bold text-[#475569] mb-1.5 uppercase tracking-wide">Address / Location</label>
                  <input value={newLead.address} onChange={e=>setNewLead({...newLead, address: e.target.value})} type="text" placeholder="Enter location" className="w-full h-11 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] text-[#0F172A] outline-none focus:border-[#2563EB] transition-colors" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[12px] font-bold text-[#475569] mb-1.5 uppercase tracking-wide">Initial Notes</label>
                  <textarea value={newLead.notes} onChange={e=>setNewLead({...newLead, notes: e.target.value})} placeholder="Enter any specific requirements..." className="w-full min-h-[100px] p-3 rounded-[10px] border border-[#E2E8F0] text-[14px] text-[#0F172A] outline-none focus:border-[#2563EB] transition-colors resize-y"></textarea>
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-[#E2E8F0] flex justify-end gap-3 bg-[#F8FAFC] rounded-b-[20px]">
              <button onClick={() => setShowNewLeadModal(false)} className="h-10 px-6 rounded-[12px] border border-[#E2E8F0] bg-white text-[14px] font-bold text-[#475569] hover:bg-gray-100 hover:text-[#0F172A] transition">Cancel</button>
              <button form="newLeadForm" type="submit" className="h-10 px-6 rounded-[12px] bg-[#2563EB] text-[14px] font-bold text-white hover:bg-[#1D4ED8] transition shadow-md">Create Lead</button>
            </div>
          </div>
        </div>
      )}

      {/* Change Status Modal Placeholder */}
      {showStatusModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-[400px] bg-white rounded-[20px] shadow-2xl p-6">
            <h2 className="text-[20px] font-bold text-[#0F172A] mb-4">Change Status</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-bold text-[#475569] mb-1.5 uppercase">New Status</label>
                  <select 
                    value={statusUpdateData.status} 
                    onChange={e => setStatusUpdateData({...statusUpdateData, status: e.target.value})}
                    className="w-full h-11 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] text-[#0F172A] outline-none focus:border-[#2563EB]"
                  >
                    <option>New</option>
                    <option>Contacted</option>
                    <option>Site Visit</option>
                    <option>Estimate</option>
                    <option>Negotiation</option>
                    <option>Won</option>
                    <option>Lost</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#475569] mb-1.5 uppercase">Temperature</label>
                  <select 
                    value={statusUpdateData.lead_temperature} 
                    onChange={e => setStatusUpdateData({...statusUpdateData, lead_temperature: e.target.value})}
                    className="w-full h-11 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] text-[#0F172A] outline-none focus:border-[#2563EB]"
                  >
                    <option>Hot Lead</option>
                    <option>Warm Lead</option>
                    <option>Cold Lead</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#475569] mb-1.5 uppercase">Reason</label>
                <textarea 
                  value={statusUpdateData.reason}
                  onChange={e => setStatusUpdateData({...statusUpdateData, reason: e.target.value})}
                  placeholder="Enter reason..." 
                  className="w-full h-20 p-3 rounded-[10px] border border-[#E2E8F0] text-[14px] text-[#0F172A] outline-none focus:border-[#2563EB]"></textarea>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#475569] mb-1.5 uppercase">Next Follow-up</label>
                <input 
                  type="date" 
                  value={statusUpdateData.followup}
                  onChange={e => setStatusUpdateData({...statusUpdateData, followup: e.target.value})}
                  className="w-full h-11 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] text-[#0F172A] outline-none focus:border-[#2563EB]" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="notify" className="w-4 h-4 rounded text-[#2563EB] border-[#E2E8F0]" />
                <label htmlFor="notify" className="text-[13px] text-[#475569]">Notify Assigned Executive</label>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowStatusModal(null)} className="h-10 px-6 rounded-[12px] border border-[#E2E8F0] bg-white text-[14px] font-bold text-[#475569] hover:bg-gray-100 transition">Cancel</button>
              <button onClick={handleUpdateStatus} className="h-10 px-6 rounded-[12px] bg-[#2563EB] text-[14px] font-bold text-white hover:bg-[#1D4ED8] transition">Update Status</button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Executive Modal Placeholder */}
      {showAssignModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-[400px] bg-white rounded-[20px] shadow-2xl p-6">
            <h2 className="text-[20px] font-bold text-[#0F172A] mb-4">Assign Executive</h2>
            <div className="relative mb-4">
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#64748B] text-xl" />
              <input type="text" placeholder="Search employee..." className="w-full pl-10 pr-4 h-11 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none focus:border-[#2563EB]" />
            </div>
            <div className="space-y-2 mb-6 max-h-[200px] overflow-y-auto">
              <div className="p-3 rounded-[10px] border border-[#E2E8F0] flex items-center gap-3 cursor-pointer hover:border-[#2563EB]">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 text-[12px]">JS</div>
                <div>
                  <p className="text-[14px] font-bold text-[#0F172A]">John Smith</p>
                  <p className="text-[12px] text-[#64748B]">Senior Sales Executive</p>
                </div>
              </div>
              {/* More employees can go here */}
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowAssignModal(false)} className="h-10 px-6 rounded-[12px] border border-[#E2E8F0] bg-white text-[14px] font-bold text-[#475569] hover:bg-gray-100 transition">Cancel</button>
              <button onClick={() => setShowAssignModal(false)} className="h-10 px-6 rounded-[12px] bg-[#2563EB] text-[14px] font-bold text-white hover:bg-[#1D4ED8] transition">Assign</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-[400px] bg-white rounded-[20px] shadow-[0_20px_60px_rgba(15,23,42,0.2)] p-6 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-[#DC2626] text-3xl mx-auto mb-4">
              <MdDeleteOutline />
            </div>
            <h2 className="text-[20px] font-bold text-[#0F172A] mb-2">Delete Lead?</h2>
            <p className="text-[14px] text-[#64748B] mb-6">Are you sure you want to delete <strong>{showDeleteModal.name}</strong>? This action cannot be undone.</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setShowDeleteModal(null)} className="flex-1 h-11 rounded-[12px] border border-[#E2E8F0] bg-white text-[14px] font-bold text-[#475569] hover:bg-gray-100 transition">Cancel</button>
              <button onClick={() => handleDeleteLead(showDeleteModal.id)} className="flex-1 h-11 rounded-[12px] bg-[#DC2626] text-[14px] font-bold text-white hover:bg-red-700 transition shadow-md">Delete Lead</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CRMLeads;
