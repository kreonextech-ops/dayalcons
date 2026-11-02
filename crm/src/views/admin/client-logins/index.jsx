import React, { useState, useEffect, useRef } from "react";
import { MdAdd, MdDelete, MdVpnKey, MdPerson, MdClose, MdFlag, MdMessage, MdSearch } from "react-icons/md";
import Card from "components/card";
import { createClient } from "@supabase/supabase-js";
import ClientChat from "components/chat/ClientChat";
import R2Image from "components/R2Image";
import ClientMilestoneManager from "components/milestones/ClientMilestoneManager";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function ClientLogins() {
  const [logins, setLogins] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null); // Client opened in Client Hub
  const [clientProjects, setClientProjects] = useState([]);
  const [clientServices, setClientServices] = useState([]);
  const [activeTab, setActiveTab] = useState("milestones"); // "milestones" | "chat"

  // Search states
  const [tableSearch, setTableSearch] = useState("");
  const [modalSearch, setModalSearch] = useState("");
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [selectedClientRecord, setSelectedClientRecord] = useState(null);
  const clientDropdownRef = useRef(null);

  const [formData, setFormData] = useState({
    clientId: "",
    email: "",
    password: ""
  });

  const fetchData = async () => {
    setLoading(true);
    const { data: clientsData } = await supabase.from("clients").select("*").order("name", { ascending: true });
    if (clientsData) setClients(clientsData);

    const { data: loginsData } = await supabase.from("employees").select("*").eq("role", "Client").order("created_at", { ascending: false });
    if (loginsData) setLogins(loginsData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle click outside client search dropdown in create modal
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (clientDropdownRef.current && !clientDropdownRef.current.contains(e.target)) {
        setShowClientDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchClientDetails = async () => {
      if (!selectedClient) return;
      const { data: pData } = await supabase.from("projects").select("id, name, status, description").eq("client_id", selectedClient.id);
      const { data: sData } = await supabase.from("services").select("id, title, status, description").eq("client_id", selectedClient.id);
      if (pData) setClientProjects(pData);
      if (sData) setClientServices(sData);
    };
    fetchClientDetails();
  }, [selectedClient]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.clientId) {
      alert("Please search and select a client record to link.");
      return;
    }
    setIsSaving(true);
    const selectedC = clients.find(c => String(c.id) === String(formData.clientId));
    
    const newLogin = {
      name: selectedC?.name || "Client Portal",
      email: formData.email,
      password: formData.password,
      role: "Client",
      department: formData.clientId // Store the client ID here!
    };

    const { error } = await supabase.from("employees").insert([newLogin]);
    if (error) {
      alert("Error creating login: " + error.message);
    } else {
      setShowModal(false);
      setFormData({ clientId: "", email: "", password: "" });
      setSelectedClientRecord(null);
      setModalSearch("");
      fetchData();
    }
    setIsSaving(false);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to revoke this client's portal access?")) return;
    const { error } = await supabase.from("employees").delete().eq("id", id);
    if (!error) {
      fetchData();
      if (selectedClient) setSelectedClient(null);
    }
  };

  // Filter clients for modal search
  const filteredModalClients = clients.filter(c => {
    if (!modalSearch.trim()) return true;
    const term = modalSearch.toLowerCase().trim();
    return (
      c.name?.toLowerCase().includes(term) ||
      c.phone?.includes(term) ||
      c.email?.toLowerCase().includes(term)
    );
  });

  // Filter logins for main table search
  const filteredLogins = logins.filter(login => {
    if (!tableSearch.trim()) return true;
    const term = tableSearch.toLowerCase().trim();
    const linkedClient = clients.find(c => String(c.id) === String(login.department));
    const nameMatch = (linkedClient?.name || login.name || "").toLowerCase().includes(term);
    const emailMatch = (login.email || "").toLowerCase().includes(term);
    const phoneMatch = (linkedClient?.phone || "").includes(term);
    return nameMatch || emailMatch || phoneMatch;
  });

  if (selectedClient) {
    return (
      <div className="mt-3 flex h-full w-full flex-col gap-5">
         {/* Top Header */}
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[20px] shadow-sm border border-[#E2E8F0]">
            <div className="flex items-center gap-4">
              <button 
                 onClick={() => setSelectedClient(null)} 
                 className="p-2 hover:bg-gray-100 rounded-full transition text-gray-600 font-bold"
                 title="Back to Client Logins"
              >
                 ← Back
              </button>
              <div className="h-16 w-16 rounded-full overflow-hidden bg-brand-50 border-2 border-brand-500 flex items-center justify-center text-brand-500 text-2xl font-bold">
                 {selectedClient.profile_picture ? (
                    <R2Image fileKey={selectedClient.profile_picture} alt="Profile" className="w-full h-full object-cover" />
                 ) : (
                    selectedClient.name?.[0]?.toUpperCase() || <MdPerson />
                 )}
              </div>
              <div>
                 <h2 className="text-2xl font-bold text-navy-700">{selectedClient.name}</h2>
                 <p className="text-sm font-semibold text-gray-500">
                    {selectedClient.phone || "No phone"} {selectedClient.email ? `• ${selectedClient.email}` : ""}
                 </p>
              </div>
            </div>

            {/* Tab Switcher */}
            <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-2xl border border-gray-200">
              <button 
                onClick={() => setActiveTab("milestones")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === "milestones" 
                    ? "bg-white text-brand-600 shadow-sm" 
                    : "text-gray-600 hover:text-navy-700"
                }`}
              >
                <MdFlag size={16} /> Client Milestones
              </button>
              <button 
                onClick={() => setActiveTab("chat")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === "chat" 
                    ? "bg-white text-brand-600 shadow-sm" 
                    : "text-gray-600 hover:text-navy-700"
                }`}
              >
                <MdMessage size={16} /> Direct Messages & Files
              </button>
            </div>
         </div>

         {/* 2-Column Layout */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Main Content (Milestones OR Chat) */}
            <div className="lg:col-span-2 flex flex-col h-full">
              {activeTab === "milestones" ? (
                <ClientMilestoneManager 
                  clientId={selectedClient.id} 
                  clientName={selectedClient.name} 
                  isAdmin={true} 
                />
              ) : (
                <div className="bg-white rounded-[20px] shadow-sm border border-[#E2E8F0] p-6 h-full flex flex-col">
                  <h4 className="font-bold text-navy-700 mb-3 text-xl">Direct Messaging & Files</h4>
                  <ClientChat clientId={selectedClient.id} userType="admin" />
                </div>
              )}
            </div>

            {/* Linked Assets (Right Column) */}
            <div className="flex flex-col gap-6">
              
              {/* Construction Projects */}
              <div className="bg-white rounded-[20px] shadow-sm border border-[#E2E8F0] p-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-navy-700 text-lg">Construction Projects</h4>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-bold">
                    {clientProjects.length}
                  </span>
                </div>
                {clientProjects.length === 0 ? (
                  <div className="text-center py-6 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl text-sm">
                    No active projects.
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {clientProjects.map(p => (
                      <div 
                        key={p.id} 
                        className="bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm transition"
                      >
                        <p className="text-md font-bold text-navy-700">{p.name}</p>
                        <p className="text-xs text-brand-500 font-semibold mt-0.5">{p.status || "Pending"}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Design/Legal Services */}
              <div className="bg-white rounded-[20px] shadow-sm border border-[#E2E8F0] p-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-navy-700 text-lg">Design/Legal Services</h4>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-bold">
                    {clientServices.length}
                  </span>
                </div>
                {clientServices.length === 0 ? (
                  <div className="text-center py-6 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl text-sm">
                    No active services.
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {clientServices.map(s => (
                      <div 
                        key={s.id} 
                        className="bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm transition"
                      >
                        <p className="text-md font-bold text-navy-700">{s.title || s.name || "Design / Legal Service"}</p>
                        <p className="text-xs text-brand-500 font-semibold mt-0.5">{s.status || "Pending"}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

         </div>
      </div>
    );
  }

  return (
    <div className="mt-3 flex h-full w-full flex-col gap-5">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2 mt-2">
        <div>
          <h2 className="text-2xl font-bold text-navy-700 dark:text-white">Client Logins</h2>
          <p className="text-sm text-gray-500">Manage client access, view direct messaging, and update milestones.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Table Search Input */}
          <div className="relative flex-1 sm:w-64">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input 
              type="text"
              placeholder="Search by client or user ID..."
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-brand-500 bg-white shadow-sm"
            />
            {tableSearch && (
              <button 
                onClick={() => setTableSearch("")} 
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Create Button */}
          <button
            onClick={() => {
              setShowModal(true);
              setFormData({ clientId: "", email: "", password: "" });
              setSelectedClientRecord(null);
              setModalSearch("");
            }}
            className="flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-xs font-bold text-white hover:bg-brand-600 transition shadow-sm shrink-0"
          >
            <MdAdd size={18} /> Create Client Login
          </button>
        </div>
      </div>

      <Card extra={"w-full h-full p-4"}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-4 px-4 text-left text-sm font-bold text-gray-600 uppercase">Linked Client</th>
                <th className="py-4 px-4 text-left text-sm font-bold text-gray-600 uppercase">User ID</th>
                <th className="py-4 px-4 text-left text-sm font-bold text-gray-600 uppercase">Password</th>
                <th className="py-4 px-4 text-left text-sm font-bold text-gray-600 uppercase">Created</th>
                <th className="py-4 px-4 text-right text-sm font-bold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="py-8 text-center text-gray-500">Loading...</td></tr>
              ) : filteredLogins.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500 font-medium">
                    {tableSearch ? `No client logins matching "${tableSearch}".` : "No client logins created yet."}
                  </td>
                </tr>
              ) : (
                filteredLogins.map((login) => {
                  const linkedClient = clients.find(c => String(c.id) === String(login.department));
                  return (
                    <tr 
                      key={login.id} 
                      className="border-b border-gray-50 hover:bg-gray-50 transition cursor-pointer"
                      onClick={() => setSelectedClient(linkedClient)}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center text-brand-500 border border-brand-200">
                            {linkedClient?.profile_picture ? (
                               <R2Image fileKey={linkedClient.profile_picture} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                               <MdPerson size={18} />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-navy-700">{linkedClient?.name || login.name}</p>
                            <p className="text-xs text-gray-500">
                              {linkedClient?.phone ? `${linkedClient.phone} • ` : ""}
                              ID: CLIENT-{login.department?.toString().substring(0,4)?.toUpperCase() || "NEW"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm font-bold text-navy-700 bg-gray-100 px-3 py-1 rounded-md">
                          {login.email}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm font-medium text-gray-600">
                          {login.password}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-600">
                          {new Date(login.created_at).toLocaleDateString('en-GB')}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button 
                          onClick={(e) => handleDelete(login.id, e)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                          title="Revoke Access"
                        >
                          <MdDelete size={20} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* CREATE ACCESS CREDENTIALS MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl relative">
            <button 
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition"
            >
              <MdClose size={22} />
            </button>

            <h3 className="text-xl font-bold text-navy-700 mb-4 flex items-center gap-2">
              <MdVpnKey className="text-brand-500" /> Create Access Credentials
            </h3>
            
            <form onSubmit={handleCreate}>
              
              {/* SEARCHABLE CLIENT PICKER */}
              <div className="mb-4 relative" ref={clientDropdownRef}>
                <label className="mb-1 block text-sm font-bold text-gray-600">
                  Link to Client Record <span className="text-red-500">*</span>
                </label>

                {selectedClientRecord ? (
                  <div className="flex items-center justify-between p-3 rounded-xl border-2 border-brand-500 bg-brand-50/40 transition">
                    <div>
                      <p className="text-sm font-bold text-navy-700">{selectedClientRecord.name}</p>
                      <p className="text-xs text-gray-500">
                        {selectedClientRecord.phone || "No phone"} {selectedClientRecord.email ? `• ${selectedClientRecord.email}` : ""}
                      </p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => {
                        setSelectedClientRecord(null);
                        setFormData(prev => ({ ...prev, clientId: "" }));
                        setModalSearch("");
                      }}
                      className="text-gray-400 hover:text-red-500 p-1 rounded-lg hover:bg-white transition"
                      title="Clear selection"
                    >
                      <MdClose size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <MdSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                    <input 
                      type="text"
                      value={modalSearch}
                      onChange={(e) => {
                        setModalSearch(e.target.value);
                        setShowClientDropdown(true);
                      }}
                      onFocus={() => setShowClientDropdown(true)}
                      placeholder="Type client name or phone to search..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs outline-none focus:border-brand-500 font-semibold text-navy-700"
                    />

                    {showClientDropdown && (
                      <div className="absolute top-12 left-0 w-full bg-white border border-gray-200 rounded-xl shadow-2xl max-h-60 overflow-y-auto z-50 divide-y divide-gray-50">
                        {filteredModalClients.length > 0 ? (
                          filteredModalClients.map(c => (
                            <div 
                              key={c.id}
                              onClick={() => {
                                setSelectedClientRecord(c);
                                const defaultUsername = c.phone || c.email?.split("@")[0] || c.name.toLowerCase().replace(/\s+/g, "");
                                setFormData(prev => ({ 
                                  ...prev, 
                                  clientId: c.id,
                                  email: prev.email || defaultUsername
                                }));
                                setShowClientDropdown(false);
                              }}
                              className="p-3 hover:bg-brand-50 cursor-pointer transition text-left"
                            >
                              <p className="text-sm font-bold text-navy-700">{c.name}</p>
                              <p className="text-xs text-gray-500 font-medium">
                                {c.phone || "No phone"} {c.email ? `• ${c.email}` : ""}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-xs text-gray-400 text-center">
                            No clients matching "{modalSearch}"
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* USERNAME */}
              <div className="mb-4">
                <label className="mb-1 block text-sm font-bold text-gray-600">Login ID (Username)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. client phone or username"
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-xs outline-none focus:border-brand-500 font-semibold text-navy-700"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              {/* PASSWORD */}
              <div className="mb-6">
                <label className="mb-1 block text-sm font-bold text-gray-600">Password</label>
                <input
                  type="text"
                  required
                  placeholder="Set or generate password"
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-xs outline-none focus:border-brand-500 font-semibold text-navy-700"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>

              {/* ACTIONS */}
              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-xl bg-gray-100 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || !formData.clientId}
                  className="flex-1 rounded-xl bg-brand-500 py-2.5 text-xs font-bold text-white hover:bg-brand-600 transition disabled:opacity-50 shadow-sm"
                >
                  {isSaving ? "Saving..." : "Create Login"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
