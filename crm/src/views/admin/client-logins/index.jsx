import React, { useState, useEffect } from "react";
import { MdAdd, MdDelete, MdVpnKey, MdPerson, MdClose } from "react-icons/md";
import Card from "components/card";
import { createClient } from "@supabase/supabase-js";
import ClientChat from "components/chat/ClientChat";

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

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const selectedC = clients.find(c => String(c.id) === String(formData.clientId));
    
    const newLogin = {
      name: selectedC?.name || "Client Portal",
      email: formData.email,
      password: formData.password,
      role: "Client",
      department: formData.clientId // We store clientId in department field to link them
    };

    await supabase.from("employees").insert([newLogin]);
    setFormData({ clientId: "", email: "", password: "" });
    setShowModal(false);
    setIsSaving(false);
    fetchData();
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation(); // Stop row click
    if (window.confirm("Are you sure you want to revoke this client's portal access?")) {
      await supabase.from("employees").delete().eq("id", id);
      fetchData();
    }
  };

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
                               <img src={linkedClient.profile_picture} alt="Profile" className="w-full h-full object-cover" />
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

      {/* CLIENT PROFILE MODAL */}
      {selectedClient && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={() => setSelectedClient(null)}>
          <div className="w-full max-w-3xl rounded-[20px] bg-white shadow-2xl flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-100 border-2 border-brand-500">
                  {selectedClient.profile_picture ? (
                     <img src={selectedClient.profile_picture} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                     <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl font-bold bg-gray-100">
                        {selectedClient.name?.charAt(0) || "U"}
                     </div>
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-navy-700">{selectedClient.name}</h3>
                  <p className="text-gray-500">{selectedClient.email} • {selectedClient.phone}</p>
                </div>
              </div>
              <button onClick={() => setSelectedClient(null)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition">
                <MdClose size={24} />
              </button>
            </div>
            <div className="p-6 bg-gray-50 flex-1 overflow-hidden">
               <h4 className="font-bold text-navy-700 mb-3 text-lg">Direct Messaging & Files</h4>
               <ClientChat clientId={selectedClient.id} userType="admin" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
