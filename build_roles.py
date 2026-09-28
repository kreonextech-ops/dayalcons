with open('crm/src/views/admin/employees/components/TabRoles.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

new_content = """import React, { useState, useEffect } from "react";
import Card from "components/card";
import { MdAdd, MdMoreVert, MdSecurity, MdClose, MdCheckCircle, MdDelete } from "react-icons/md";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);

const ALL_PERMISSIONS = [
  "view_leads", "edit_leads", "delete_leads",
  "view_clients", "edit_clients", "delete_clients",
  "view_projects", "edit_projects", "delete_projects",
  "view_services", "edit_services", "delete_services",
  "view_tasks", "edit_tasks", "delete_tasks",
  "all"
];

const TabRoles = () => {
  const [roles, setRoles] = useState([]);
  const [empCounts, setEmpCounts] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [newRole, setNewRole] = useState({ name: "", permissions: [] });
  const [loading, setLoading] = useState(true);

  const fetchRoles = async () => {
     setLoading(true);
     const { data: rData, error: rError } = await supabase.from('roles').select('*').order('created_at', { ascending: true });
     const { data: eData, error: eError } = await supabase.from('employees').select('role');
     
     if (!rError && rData) setRoles(rData);
     if (!eError && eData) {
        const counts = {};
        eData.forEach(e => {
           if (e.role) counts[e.role] = (counts[e.role] || 0) + 1;
        });
        setEmpCounts(counts);
     }
     setLoading(false);
  };

  useEffect(() => { fetchRoles(); }, []);

  const handleSave = async () => {
     if (!newRole.name) { alert("Role name is required."); return; }
     const { error } = await supabase.from('roles').insert([{ 
         name: newRole.name, 
         permissions: newRole.permissions 
     }]);
     if (error) alert("Failed to save. It may already exist.");
     else {
        setNewRole({ name: "", permissions: [] });
        setShowModal(false);
        fetchRoles();
     }
  };

  const handleDelete = async (id, name) => {
     if (empCounts[name] > 0) {
        alert(`Cannot delete ${name} because there are ${empCounts[name]} employees assigned to it.`);
        return;
     }
     if (["Admin", "CRO", "OAS", "Engineers", "Others"].includes(name)) {
        alert("Cannot delete default system roles.");
        return;
     }
     if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
     const { error } = await supabase.from('roles').delete().eq('id', id);
     if (error) alert("Failed to delete.");
     else fetchRoles();
  };

  const togglePermission = (perm) => {
     if (newRole.permissions.includes(perm)) {
         setNewRole({ ...newRole, permissions: newRole.permissions.filter(p => p !== perm) });
     } else {
         setNewRole({ ...newRole, permissions: [...newRole.permissions, perm] });
     }
  };

  return (
    <div className="animate-fade-in relative">
       <div className="flex justify-between items-center mb-6">
          <div>
             <h3 className="text-[18px] font-bold text-[#0F172A] dark:text-white">Roles & Permissions ({roles.length})</h3>
             <p className="text-[14px] text-[#64748B] dark:text-gray-400">Control system access boundaries.</p>
          </div>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-[#F59E0B] text-white px-4 py-2 rounded-[10px] text-[13px] font-bold shadow-md hover:bg-[#D97706] transition">
             <MdAdd className="text-lg" /> Create Role
          </button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? <p className="p-4">Loading...</p> : roles.map((r) => (
             <Card key={r.id} extra="p-5 border border-[#E2E8F0] dark:border-navy-700 shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-start mb-4">
                   <div className="w-10 h-10 bg-orange-50 dark:bg-navy-800 rounded-full flex items-center justify-center text-[#F59E0B] text-xl">
                      <MdSecurity />
                   </div>
                   <button onClick={() => handleDelete(r.id, r.name)} className="text-[#64748B] hover:text-red-500 transition p-1"><MdDelete className="text-xl" /></button>
                </div>
                <h4 className="text-[16px] font-bold text-[#0F172A] dark:text-white mb-1">{r.name}</h4>
                <div className="mt-4 pt-4 border-t border-[#E2E8F0] dark:border-navy-700 flex justify-between items-center">
                   <span className="text-[12px] text-[#64748B]">{r.permissions.length} Permissions</span>
                   <div className="text-right">
                      <p className="text-[10px] font-bold text-[#64748B] uppercase">Users</p>
                      <p className="text-[13px] font-bold text-[#0F172A] dark:text-white">{empCounts[r.name] || 0}</p>
                   </div>
                </div>
             </Card>
          ))}
       </div>

       {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
             <div className="w-full max-w-[600px] bg-white dark:bg-navy-800 rounded-[20px] shadow-xl p-6">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-[18px] font-bold text-[#0F172A] dark:text-white">Create Custom Role</h3>
                   <button onClick={() => setShowModal(false)} className="text-[#64748B] hover:text-[#0F172A]"><MdClose className="text-xl" /></button>
                </div>
                
                <div className="mb-6">
                   <label className="text-[12px] font-bold text-[#1E293B] dark:text-gray-300">Role Name*</label>
                   <input type="text" className="w-full h-11 mt-1 px-4 border border-[#E2E8F0] dark:border-navy-700 rounded-[10px] text-[13px] outline-none focus:border-[#F59E0B]" placeholder="e.g. Sales Manager" value={newRole.name} onChange={e => setNewRole({...newRole, name: e.target.value})} />
                </div>

                <div>
                   <label className="text-[12px] font-bold text-[#1E293B] dark:text-gray-300 block mb-3">Module Permissions</label>
                   <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto p-2 bg-gray-50 rounded-lg">
                      {ALL_PERMISSIONS.map(perm => (
                         <label key={perm} className="flex items-center gap-2 text-[12px] text-[#475569] cursor-pointer">
                            <input type="checkbox" checked={newRole.permissions.includes(perm)} onChange={() => togglePermission(perm)} className="rounded border-gray-300 text-[#F59E0B] focus:ring-[#F59E0B]" />
                            {perm}
                         </label>
                      ))}
                   </div>
                </div>

                <div className="mt-8 flex gap-3">
                   <button onClick={() => setShowModal(false)} className="flex-1 h-11 border border-[#E2E8F0] dark:border-navy-700 rounded-[10px] text-[13px] font-bold text-[#64748B] hover:bg-gray-50">Cancel</button>
                   <button onClick={handleSave} className="flex-1 h-11 bg-[#F59E0B] text-white rounded-[10px] text-[13px] font-bold shadow-md hover:bg-[#D97706] flex items-center justify-center gap-2">
                      <MdCheckCircle /> Create Role
                   </button>
                </div>
             </div>
          </div>
       )}
    </div>
  );
};
export default TabRoles;
"""

with open('crm/src/views/admin/employees/components/TabRoles.jsx', 'w', encoding='utf-8') as f:
    f.write(new_content)
