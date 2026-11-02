import React, { useState, useEffect } from "react";
import { MdAdd, MdDelete, MdVpnKey, MdPerson, MdClose } from "react-icons/md";
import Card from "components/card";
import { createClient } from "@supabase/supabase-js";
import ClientChat from "components/chat/ClientChat";
import R2Image from "components/R2Image";
import TabSteps from "../services/components/TabSteps";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function ClientLogins() {
  const [logins, setLogins] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null); // Added for Profile/Chat
  const [clientProjects, setClientProjects] = useState([]);
  const [clientServices, setClientServices] = useState([]);
  const [milestoneModal, setMilestoneModal] = useState(null); // { item, type: 'services' | 'projects' }

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

  if (selectedClient) {
    return (
      <div className="mt-3 flex h-full w-full flex-col gap-5">
         {/* Top Header */}
         <div className="flex items-center gap-4 bg-white p-6 rounded-[20px] shadow-sm border border-[#E2E8F0]">
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

         {/* 2-Column Layout */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Communication (Chat) */}
            <div className="lg:col-span-2 flex flex-col h-full">
              <h4 className="font-bold text-navy-700 mb-3 text-xl">Direct Messaging & Files</h4>
              <ClientChat clientId={selectedClient.id} userType="admin" />
            </div>

            {/* Linked Assets */}
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
                    {clientProjects.map(p => {
                      let stepCount = 0;
                      let completedCount = 0;
                      try {
                        const meta = JSON.parse(p.description || "{}");
                        if (Array.isArray(meta.steps)) {
                          stepCount = meta.steps.length;
                          completedCount = meta.steps.filter(st => st.completed).length;
                        }
                      } catch(e) {}
                      const pct = stepCount > 0 ? Math.round((completedCount / stepCount) * 100) : 0;

                      return (
                        <div 
                          key={p.id} 
                          onClick={() => setMilestoneModal({ item: p, type: "projects" })}
                          className="bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-brand-400 transition cursor-pointer group"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-md font-bold text-navy-700 group-hover:text-brand-500 transition">{p.name}</p>
                              <p className="text-xs text-brand-500 font-semibold mt-0.5">{p.status || "Pending"}</p>
                            </div>
                            <span className="text-xs bg-brand-50 text-brand-600 font-bold px-2.5 py-1 rounded-full border border-brand-200 group-hover:bg-brand-500 group-hover:text-white transition">
                              Milestones →
                            </span>
                          </div>

                          <div className="mt-3">
                            <div className="flex justify-between text-xs text-gray-500 font-medium mb-1">
                              <span>{stepCount > 0 ? `${completedCount}/${stepCount} Steps` : "No steps defined"}</span>
                              <span className="font-bold text-brand-600">{pct}%</span>
                            </div>
                            <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-brand-500 h-full rounded-full transition-all duration-300" style={{ width: `${pct}%` }}></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
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
                    {clientServices.map(s => {
                      let stepCount = 0;
                      let completedCount = 0;
                      try {
                        const meta = JSON.parse(s.description || "{}");
                        if (Array.isArray(meta.steps)) {
                          stepCount = meta.steps.length;
                          completedCount = meta.steps.filter(st => st.completed).length;
                        }
                      } catch(e) {}
                      const pct = stepCount > 0 ? Math.round((completedCount / stepCount) * 100) : 0;

                      return (
                        <div 
                          key={s.id} 
                          onClick={() => setMilestoneModal({ item: s, type: "services" })}
                          className="bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-brand-400 transition cursor-pointer group"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-md font-bold text-navy-700 group-hover:text-brand-500 transition">
                                {s.title || s.name || "Design / Legal Service"}
                              </p>
                              <p className="text-xs text-brand-500 font-semibold mt-0.5">{s.status || "Pending"}</p>
                            </div>
                            <span className="text-xs bg-brand-50 text-brand-600 font-bold px-2.5 py-1 rounded-full border border-brand-200 group-hover:bg-brand-500 group-hover:text-white transition">
                              Milestones →
                            </span>
                          </div>

                          <div className="mt-3">
                            <div className="flex justify-between text-xs text-gray-500 font-medium mb-1">
                              <span>{stepCount > 0 ? `${completedCount}/${stepCount} Steps` : "No steps defined"}</span>
                              <span className="font-bold text-brand-600">{pct}%</span>
                            </div>
                            <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-brand-500 h-full rounded-full transition-all duration-300" style={{ width: `${pct}%` }}></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>

         </div>

         {/* MILESTONE / STEPS MODAL */}
         {milestoneModal && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
             <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl relative my-8 max-h-[92vh] overflow-y-auto">
               <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-100">
                 <div>
                   <span className="text-xs font-bold text-brand-500 uppercase tracking-wider">
                     {milestoneModal.type === "projects" ? "Construction Project" : "Design / Legal Service"}
                   </span>
                   <h3 className="text-2xl font-bold text-navy-700">
                     Milestones & Steps: {milestoneModal.item.title || milestoneModal.item.name}
                   </h3>
                   <p className="text-sm text-gray-500 mt-0.5">
                     Load templates, add/delete steps, check off milestones, and attach documents.
                   </p>
                 </div>
                 <button 
                   onClick={() => setMilestoneModal(null)} 
                   className="text-gray-400 hover:text-gray-700 text-2xl font-bold p-1 rounded-lg hover:bg-gray-100 transition"
                 >
                   <MdClose size={24} />
                 </button>
               </div>

               <TabSteps 
                 serviceCase={milestoneModal.item} 
                 tableName={milestoneModal.type}
                 onUpdate={(updatedItem) => {
                   if (milestoneModal.type === "services") {
                     setClientServices(prev => prev.map(s => s.id === updatedItem.id ? updatedItem : s));
                   } else {
                     setClientProjects(prev => prev.map(p => p.id === updatedItem.id ? updatedItem : p));
                   }
                   setMilestoneModal(prev => prev ? { ...prev, item: updatedItem } : null);
                 }} 
               />
             </div>
           </div>
         )}
      </div>
    );
  }

  return (
    <div className="mt-3 flex h-full w-full flex-col gap-5">
      <div className="flex justify-between items-center mb-4 mt-2">
        <div>
          <h2 className="text-2xl font-bold text-navy-700 dark:text-white">Client Logins</h2>
          <p className="text-sm text-gray-500">Manage portal access and communicate directly with clients.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 transition"
        >
          <MdAdd size={20} /> Create Client Login
        </button>
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
              ) : logins.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500">
                    No client logins created yet.
                  </td>
                </tr>
              ) : (
                logins.map((login) => {
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
                            <p className="text-xs text-gray-500">ID: CLIENT-{login.department?.toString().substring(0,4)?.toUpperCase() || "NEW"}</p>
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

      {/* CREATE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-xl font-bold text-navy-700 mb-4 flex items-center gap-2">
              <MdVpnKey className="text-brand-500" /> Create Access Credentials
            </h3>
            <form onSubmit={handleCreate}>
              <div className="mb-4">
                <label className="mb-1 block text-sm font-bold text-gray-600">Link to Client Record</label>
                <select
                  required
                  className="w-full rounded-lg border border-gray-200 p-3 text-sm outline-none focus:border-brand-500 text-navy-700 font-semibold"
                  value={formData.clientId}
                  onChange={(e) => setFormData({...formData, clientId: e.target.value})}
                >
                  <option value="">-- Select Client --</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.phone || c.email})</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="mb-1 block text-sm font-bold text-gray-600">Login ID (Username)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. client123"
                  className="w-full rounded-lg border border-gray-200 p-3 text-sm outline-none focus:border-brand-500"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="mb-6">
                <label className="mb-1 block text-sm font-bold text-gray-600">Password</label>
                <input
                  type="text"
                  required
                  placeholder="Generated/Set Password"
                  className="w-full rounded-lg border border-gray-200 p-3 text-sm outline-none focus:border-brand-500"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-lg bg-gray-100 py-3 text-sm font-bold text-gray-600 hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 rounded-lg bg-brand-500 py-3 text-sm font-bold text-white hover:bg-brand-600 transition disabled:opacity-50"
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
