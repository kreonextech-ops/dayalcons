import React, { useState, useEffect } from "react";
import { MdAdd, MdDelete, MdVpnKey, MdPerson } from "react-icons/md";
import Card from "components/card";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function ClientLogins() {
  const [logins, setLogins] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [newLogin, setNewLogin] = useState({
    clientId: "",
    userId: "",
    password: ""
  });

  const fetchData = async () => {
    setLoading(true);
    // Fetch logins (stored in employees table with role Client)
    const { data: loginsData } = await supabase
      .from("employees")
      .select("*")
      .eq("role", "Client")
      .order("created_at", { ascending: false });

    // Fetch clients for the dropdown
    const { data: clientsData } = await supabase
      .from("clients")
      .select("id, name, phone")
      .order("created_at", { ascending: false });

    if (loginsData) setLogins(loginsData);
    if (clientsData) setClients(clientsData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateLogin = async (e) => {
    e.preventDefault();
    if (!newLogin.clientId || !newLogin.userId || !newLogin.password) {
      alert("Please fill all fields.");
      return;
    }

    setIsSaving(true);
    
    // Check if userid already exists
    const { data: existing } = await supabase
      .from("employees")
      .select("id")
      .eq("email", newLogin.userId);
      
    if (existing && existing.length > 0) {
      alert("This User ID is already taken. Please choose another.");
      setIsSaving(false);
      return;
    }

    const selectedClient = clients.find(c => c.id === newLogin.clientId);

    const payload = {
      name: selectedClient?.name || "Client User",
      email: newLogin.userId, // Storing User ID in the email column
      password: newLogin.password,
      role: "Client",
      department: newLogin.clientId, // Storing strict client connection here
      status: "Active",
      join_date: new Date().toISOString()
    };

    const { error } = await supabase.from("employees").insert([payload]);

    if (error) {
      alert("Failed to create login: " + error.message);
    } else {
      setShowModal(false);
      setNewLogin({ clientId: "", userId: "", password: "" });
      fetchData();
    }
    setIsSaving(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to revoke and delete this client login?")) {
      await supabase.from("employees").delete().eq("id", id);
      fetchData();
    }
  };

  return (
    <div className="mt-3 flex h-full w-full flex-col gap-5">
      <div className="flex justify-between items-center mb-4 mt-2">
        <div>
          <h2 className="text-2xl font-bold text-navy-700 dark:text-white">Client Logins</h2>
          <p className="text-sm text-gray-500">Manage portal access credentials for your clients.</p>
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
                    No client logins created yet. Click above to create one.
                  </td>
                </tr>
              ) : (
                logins.map((login) => {
                  const linkedClient = clients.find(c => c.id === login.department);
                  return (
                    <tr key={login.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-brand-500">
                            <MdPerson size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-navy-700">{linkedClient?.name || login.name}</p>
                            <p className="text-xs text-gray-500">ID: CLIENT-{login.department?.substring(0,4)?.toUpperCase()}</p>
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
                          onClick={() => handleDelete(login.id)}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="w-[500px] rounded-[20px] bg-white p-6 shadow-2xl">
            <h3 className="mb-4 text-xl font-bold text-navy-700">Create Client Login</h3>
            <form onSubmit={handleCreateLogin} className="flex flex-col gap-4">
              
              <div>
                <label className="mb-1 block text-sm font-bold text-gray-600">Select Client *</label>
                <select 
                  required
                  value={newLogin.clientId}
                  onChange={(e) => setNewLogin({...newLogin, clientId: e.target.value})}
                  className="w-full rounded-lg border border-gray-200 p-3 text-sm outline-none focus:border-brand-500"
                >
                  <option value="">-- Select Client from Database --</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name} {c.phone ? `(${c.phone})` : ''}</option>
                  ))}
                </select>
                <p className="mt-1 text-[11px] text-gray-500">This strictly links the login to their CRM profile.</p>
              </div>

              <div>
                <label className="mb-1 block text-sm font-bold text-gray-600">User ID *</label>
                <input 
                  required
                  type="text"
                  placeholder="e.g. rahul_villa123"
                  value={newLogin.userId}
                  onChange={(e) => setNewLogin({...newLogin, userId: e.target.value.toLowerCase().trim()})}
                  className="w-full rounded-lg border border-gray-200 p-3 text-sm outline-none focus:border-brand-500"
                />
                <p className="mt-1 text-[11px] text-gray-500">Can be a username or phone number (no spaces).</p>
              </div>

              <div>
                <label className="mb-1 block text-sm font-bold text-gray-600">Password *</label>
                <input 
                  required
                  type="text"
                  placeholder="Create a strong password"
                  value={newLogin.password}
                  onChange={(e) => setNewLogin({...newLogin, password: e.target.value})}
                  className="w-full rounded-lg border border-gray-200 p-3 text-sm outline-none focus:border-brand-500"
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
                  {isSaving ? "Creating..." : "Create Login"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
