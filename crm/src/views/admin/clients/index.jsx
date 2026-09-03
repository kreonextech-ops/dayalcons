import React, { useState, useEffect } from "react";
import Card from "components/card";
import { createClient } from "@supabase/supabase-js";
import * as XLSX from "xlsx";
import { useRef } from "react";
import ClientDetail from "./ClientDetail";
import { 
  MdSearch, MdPerson, MdCheckCircle, MdCloudDownload, MdAdd, 
  MdMoreVert, MdKeyboardArrowLeft, MdKeyboardArrowRight,
  MdOutlineRefresh, MdDeleteOutline, MdEdit, MdBusinessCenter, MdAttachMoney
} from "react-icons/md";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);

const Clients = () => {
  const userStr = localStorage.getItem('dayal_user');
  const loggedInUser = userStr ? JSON.parse(userStr) : null;
  const isAdmin = loggedInUser?.role === 'Admin';

  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState(null);

  // Modals
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(null);

  // New Client Form State
  const [newClient, setNewClient] = useState({
    name: "", phone: "", email: "", address: "", company: "", gst: ""
  });

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
             
             let status = row["STATUS"] || "Active";
             
             let createdAt = new Date().toISOString();
             if (row["CLIENT DATE"]) {
                 const parsed = new Date(row["CLIENT DATE"]);
                 if (!isNaN(parsed)) createdAt = parsed.toISOString();
             } else if (row["LEAD ARRIVING DATE"]) {
                 const parsed = new Date(row["LEAD ARRIVING DATE"]);
                 if (!isNaN(parsed)) createdAt = parsed.toISOString();
             }
             
             inserts.push({
                name: clientName,
                phone: row["PHONE NO."] || null,
                address: row["ADDRESS"] || null,
                company: row["COMPANY"] || null,
                created_at: createdAt,
                status: status,
                notes: row["REMARKS"] || null,
                assigned_to: (row["FOLLOW BY"] && empMap[row["FOLLOW BY"].toLowerCase().trim()]) ? empMap[row["FOLLOW BY"].toLowerCase().trim()] : null
             });
          }
          
          const { error } = await supabase.from('clients').insert(inserts);
          if (error) {
             alert("Import failed (Make sure you ran the SQL query to add missing columns!): " + error.message);
          } else {
             alert('Successfully imported ' + inserts.length + ' clients!');
             fetchClients();
          }
        } catch (innerErr) {
          alert("Parse error: " + innerErr.message);
        }
        setImporting(false);
        e.target.value = null;
      };
      reader.readAsBinaryString(file);
    } catch(err) {
      alert("Error reading file.");
      setImporting(false);
      e.target.value = null;
    }
  };

  const handleExport = () => {
      const dataToExport = clients.map(c => ({
         "CLIENT DETAILS": c.name,
         "ADDRESS": c.address || "",
         "PHONE NO.": c.phone || "",
         "COMPANY": c.company || "",
         "CLIENT DATE": c.created_at ? new Date(c.created_at).toLocaleDateString() : "",
         "STATUS": c.status,
         "REMARKS": c.notes || ""
      }));
      const ws = XLSX.utils.json_to_sheet(dataToExport);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Clients");
      XLSX.writeFile(wb, "Clients_Export.xlsx");
  };

  const fetchClients = async () => {
    setLoading(true);
    let query = supabase.from("clients").select("*").order('created_at', { ascending: false });
      if (!isAdmin && loggedInUser?.id) {
         query = query.like('assigned_to', `%${loggedInUser.id}%`);
      }
      const { data, error } = await query;
    if (!error && data) {
      // Merge with localStorage to bypass Supabase schema limits
      const merged = data.map(client => {
         const localData = JSON.parse(localStorage.getItem(`client_${client.id}`) || "{}");
         return { ...client, ...localData };
      });
      setClients(merged);
    }
    setLoading(false);
  };

  useEffect(() => { fetchClients(); }, []);

  const handleCreateClient = async (e) => {
    e.preventDefault();
    const { data: newClientData, error } = await supabase.from("clients").insert([{
      name: newClient.name,
      status: 'active'
    }]).select();
    
    if (!error && newClientData && newClientData.length > 0) {
      // Save extra fields to local storage
      const clientId = newClientData[0].id;
      localStorage.setItem(`client_${clientId}`, JSON.stringify({
         phone: newClient.phone,
         email: newClient.email,
         address: newClient.address,
         company: newClient.company,
         gst: newClient.gst
      }));

      setShowNewClientModal(false);
      setNewClient({ name: "", phone: "", email: "", address: "", company: "", gst: "" });
      fetchClients();
    } else {
      console.error(error);
      alert("Failed to add client. Check console.");
    }
  };

  const handleDeleteClient = async (id) => {
    const { error } = await supabase.from("clients").delete().eq("id", id);
    if (!error) {
      setShowDeleteModal(null);
      fetchClients();
    }
  };

  if (selectedClient) {
    return <ClientDetail client={selectedClient} onBack={() => { setSelectedClient(null); fetchClients(); }} />;
  }

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen pt-12 pb-24">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 font-sans text-[#475569]">
        
        {/* 1. Breadcrumb & Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 mt-8 md:mt-2">
          <div>
            <p className="text-[12px] font-medium text-[#64748B] mb-1">Pages / Clients</p>
            <h1 className="text-[32px] font-bold text-[#0F172A] leading-tight">Clients & Entities</h1>
          </div>
          <div className="flex gap-3 z-10 relative">
            <input type="file" ref={fileInputRef} onChange={handleImport} accept=".csv, .xlsx, .xls" className="hidden" />
            <button onClick={() => fileInputRef.current.click()} disabled={importing} className="h-10 px-4 rounded-[12px] border border-[#E2E8F0] bg-white text-[14px] font-bold text-[#0F172A] hover:bg-gray-50 flex items-center gap-2 transition disabled:opacity-50">
              <MdCloudDownload /> {importing ? "Importing..." : "Import Excel"}
            </button>
            <button onClick={handleExport} className="h-10 px-4 rounded-[12px] border border-[#E2E8F0] bg-white text-[14px] font-bold text-[#0F172A] hover:bg-gray-50 flex items-center gap-2 transition">
              <MdCloudDownload /> Export Data
            </button>
            <button onClick={() => setShowNewClientModal(true)} className="h-10 px-5 rounded-[12px] bg-[#2563EB] text-[14px] font-bold text-white hover:bg-[#1D4ED8] flex items-center gap-2 transition shadow-[0_2px_10px_rgba(37,99,235,0.2)]">
              <MdAdd /> New Client
            </button>
          </div>
        </div>

        {/* 2. KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
             { title: "Total Clients", val: clients.length || "0", icon: <MdPerson className="text-[#2563EB]" />, bg: "bg-blue-50" },
             { title: "Active Projects", val: "0", icon: <MdBusinessCenter className="text-[#06B6D4]" />, bg: "bg-cyan-50" },
             { title: "Total Lifetime Value", val: "₹0", icon: <MdAttachMoney className="text-[#16A34A]" />, bg: "bg-green-50" },
             { title: "Outstanding Dues", val: "₹0", icon: <MdAttachMoney className="text-[#DC2626]" />, bg: "bg-red-50" }
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
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="h-10 px-4 rounded-[10px] border border-[#E2E8F0] text-[14px] text-[#475569] outline-none focus:border-[#2563EB] bg-white cursor-pointer"
                >
                  <option value="">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Converted">Converted</option>
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

        {/* 4. Clients Data Table */}
        <Card extra="border border-[#E2E8F0] overflow-hidden shadow-sm">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <th className="py-4 px-6 w-12"><input type="checkbox" className="w-4 h-4 rounded text-[#2563EB] border-[#E2E8F0] cursor-pointer" /></th>
                  <th className="py-4 px-4 text-[12px] font-medium text-[#64748B] uppercase tracking-wider">Client Entity</th>
                  <th className="py-4 px-4 text-[12px] font-medium text-[#64748B] uppercase tracking-wider">Contact Info</th>
                  <th className="py-4 px-4 text-[12px] font-medium text-[#64748B] uppercase tracking-wider">Active Projects</th>
                  <th className="py-4 px-4 text-[12px] font-medium text-[#64748B] uppercase tracking-wider">LTV / Value</th>
                  <th className="py-4 px-6 text-[12px] font-medium text-[#64748B] uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                  {(() => {
                     let filtered = clients;
                     if (filterStatus) {
                        filtered = filtered.filter(x => x.status === filterStatus);
                     }
                     if (sortOrder === "oldest") {
                        filtered.sort((a,b) => new Date(a.created_at) - new Date(b.created_at));
                     } else {
                        filtered.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
                     }
                     if (searchTerm) {
                        const lower = searchTerm.toLowerCase();
                        filtered = filtered.filter(c => 
                           (c.name && c.name.toLowerCase().includes(lower)) || 
                           (c.email && c.email.toLowerCase().includes(lower)) || 
                           (c.phone && c.phone.toLowerCase().includes(lower)) || 
                           (c.company && c.company.toLowerCase().includes(lower)) ||
                           (c.address && c.address.toLowerCase().includes(lower))
                        );
                     }
                     if (loading) return <tr><td colSpan="6" className="py-12 text-center text-gray-500">Loading clients...</td></tr>;
                     if (filtered.length === 0) return <tr><td colSpan="6" className="py-12 text-center text-gray-500">No clients found.</td></tr>;
                     return filtered.map(client => (
                        <tr key={client.id} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedClient(client)}>
                           <td className="py-4 px-6" onClick={(e) => e.stopPropagation()}>
                              <input type="checkbox" className="w-4 h-4 rounded text-[#2563EB] border-[#E2E8F0] cursor-pointer" />
                           </td>
                           <td className="py-4 px-4">
                              <p className="text-sm text-gray-800 font-bold">{client.name}</p>
                              {client.company && <p className="text-[12px] text-gray-500">{client.company}</p>}
                           </td>
                           <td className="py-4 px-4">
                              {client.email && <p className="text-sm text-gray-600">{client.email}</p>}
                              {client.phone && <p className="text-[12px] text-gray-500">{client.phone}</p>}
                           </td>
                           <td className="py-4 px-4 text-sm text-gray-600">
                              0
                           </td>
                           <td className="py-4 px-4 text-sm text-gray-600 font-bold text-green-600">
                              ₹0
                           </td>
                           <td className="py-4 px-6 text-right">
                              <button onClick={(e) => { e.stopPropagation(); handleDeleteClient(client.id); }} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition" title="Delete Client">
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
             <span className="text-[13px] font-medium text-[#64748B]">Showing {clients.length > 0 ? `1 - ${clients.length}` : '—'} of {clients.length > 0 ? clients.length : '—'} clients</span>
             <div className="flex gap-1">
               <button className="h-8 px-3 rounded border border-[#E2E8F0] text-[13px] font-medium text-[#64748B] hover:bg-gray-50 flex items-center transition"><MdKeyboardArrowLeft /> Prev</button>
               <button className="h-8 px-3 rounded bg-[#2563EB] text-white text-[13px] font-medium shadow-sm">1</button>
               <button className="h-8 px-3 rounded border border-[#E2E8F0] text-[13px] font-medium text-[#64748B] hover:bg-gray-50 flex items-center transition">Next <MdKeyboardArrowRight /></button>
             </div>
          </div>
        </Card>

      </div>

      {/* New Client Modal */}
      {showNewClientModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-[600px] bg-white rounded-[20px] shadow-[0_20px_60px_rgba(15,23,42,0.2)] flex flex-col max-h-[90vh] animate-fade-in">
            <div className="p-6 border-b border-[#E2E8F0] flex justify-between items-center bg-white rounded-t-[20px]">
              <h2 className="text-[20px] font-bold text-[#0F172A]">Add New Client</h2>
            </div>
            <div className="p-6 overflow-y-auto flex-1 bg-white">
              <form id="newClientForm" onSubmit={handleCreateClient} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-[12px] font-bold text-[#475569] mb-1.5 uppercase tracking-wide">Company / Legal Name</label>
                  <input value={newClient.company} onChange={e=>setNewClient({...newClient, company: e.target.value})} type="text" placeholder="Enter company name (or leave blank for individual)" className="w-full h-11 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] text-[#0F172A] outline-none focus:border-[#2563EB] transition-colors" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[12px] font-bold text-[#475569] mb-1.5 uppercase tracking-wide">Primary Contact Name *</label>
                  <input required value={newClient.name} onChange={e=>setNewClient({...newClient, name: e.target.value})} type="text" placeholder="Enter full name" className="w-full h-11 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] text-[#0F172A] outline-none focus:border-[#2563EB] transition-colors" />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#475569] mb-1.5 uppercase tracking-wide">Phone Number</label>
                  <input required value={newClient.phone} onChange={e=>setNewClient({...newClient, phone: e.target.value})} type="text" placeholder="Enter phone" className="w-full h-11 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] text-[#0F172A] outline-none focus:border-[#2563EB] transition-colors" />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#475569] mb-1.5 uppercase tracking-wide">Email Address</label>
                  <input value={newClient.email} onChange={e=>setNewClient({...newClient, email: e.target.value})} type="email" placeholder="Enter email" className="w-full h-11 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] text-[#0F172A] outline-none focus:border-[#2563EB] transition-colors" />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#475569] mb-1.5 uppercase tracking-wide">GST / PAN (Tax ID)</label>
                  <input value={newClient.gst} onChange={e=>setNewClient({...newClient, gst: e.target.value})} type="text" placeholder="Enter tax ID" className="w-full h-11 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] text-[#0F172A] outline-none focus:border-[#2563EB] transition-colors" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[12px] font-bold text-[#475569] mb-1.5 uppercase tracking-wide">Billing Address</label>
                  <textarea value={newClient.address} onChange={e=>setNewClient({...newClient, address: e.target.value})} placeholder="Enter full billing address..." className="w-full min-h-[80px] p-3 rounded-[10px] border border-[#E2E8F0] text-[14px] text-[#0F172A] outline-none focus:border-[#2563EB] transition-colors resize-y"></textarea>
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-[#E2E8F0] flex justify-end gap-3 bg-[#F8FAFC] rounded-b-[20px]">
              <button onClick={() => setShowNewClientModal(false)} className="h-10 px-6 rounded-[12px] border border-[#E2E8F0] bg-white text-[14px] font-bold text-[#475569] hover:bg-gray-100 hover:text-[#0F172A] transition">Cancel</button>
              <button form="newClientForm" type="submit" className="h-10 px-6 rounded-[12px] bg-[#2563EB] text-[14px] font-bold text-white hover:bg-[#1D4ED8] transition shadow-md">Add Client</button>
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
            <h2 className="text-[20px] font-bold text-[#0F172A] mb-2">Delete Client?</h2>
            <p className="text-[14px] text-[#64748B] mb-6">Are you sure you want to delete <strong>{showDeleteModal.company || showDeleteModal.name}</strong>? This action cannot be undone.</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setShowDeleteModal(null)} className="flex-1 h-11 rounded-[12px] border border-[#E2E8F0] bg-white text-[14px] font-bold text-[#475569] hover:bg-gray-100 transition">Cancel</button>
              <button onClick={() => handleDeleteClient(showDeleteModal.id)} className="flex-1 h-11 rounded-[12px] bg-[#DC2626] text-[14px] font-bold text-white hover:bg-red-700 transition shadow-md">Delete</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Clients;
