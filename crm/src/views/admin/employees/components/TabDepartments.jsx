import React, { useState, useEffect } from "react";
import Card from "components/card";
import { MdAdd, MdMoreVert, MdFolder, MdClose, MdCheckCircle, MdDelete } from "react-icons/md";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);

const TabDepartments = () => {
  const [depts, setDepts] = useState([]);
  const [empCounts, setEmpCounts] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [newDept, setNewDept] = useState({ name: "", head: "" });
  const [loading, setLoading] = useState(true);

  const fetchDepts = async () => {
     setLoading(true);
     const { data: deptData, error: deptError } = await supabase.from('departments').select('*').order('created_at', { ascending: true });
     const { data: empData, error: empError } = await supabase.from('employees').select('department');
     
     if (!deptError && deptData) {
        setDepts(deptData);
     }
     
     if (!empError && empData) {
        const counts = {};
        empData.forEach(e => {
           if (e.department) {
              counts[e.department] = (counts[e.department] || 0) + 1;
           }
        });
        setEmpCounts(counts);
     }
     setLoading(false);
  };

  useEffect(() => {
     fetchDepts();
  }, []);

  const handleSave = async () => {
     if (!newDept.name) { alert("Department name is required."); return; }
     
     const { error } = await supabase.from('departments').insert([{ name: newDept.name, head: newDept.head }]);
     if (error) {
        alert("Failed to create department. It may already exist.");
     } else {
        setNewDept({ name: "", head: "" });
        setShowModal(false);
        fetchDepts();
     }
  };
  
  const handleDelete = async (id, name) => {
     if (empCounts[name] > 0) {
        alert(`Cannot delete ${name} because there are ${empCounts[name]} employees assigned to it.`);
        return;
     }
     if (!window.confirm(`Are you sure you want to delete the ${name} department?`)) return;
     const { error } = await supabase.from('departments').delete().eq('id', id);
     if (error) alert("Failed to delete.");
     else fetchDepts();
  };

  return (
    <div className="animate-fade-in relative">
       <div className="flex justify-between items-center mb-6">
          <div>
             <h3 className="text-[18px] font-bold text-[#0F172A] dark:text-white">Departments ({depts.length})</h3>
             <p className="text-[14px] text-[#64748B] dark:text-gray-400">Organize your workforce into functional teams.</p>
          </div>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-[#2563EB] text-white px-4 py-2 rounded-[10px] text-[13px] font-bold shadow-md hover:bg-[#1D4ED8] transition">
             <MdAdd className="text-lg" /> Add Department
          </button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? <p className="p-4">Loading departments...</p> : depts.map((d) => (
             <Card key={d.id} extra="p-5 border border-[#E2E8F0] dark:border-navy-700 shadow-sm hover:shadow-md transition group">
                <div className="flex justify-between items-start mb-4">
                   <div className="w-12 h-12 bg-blue-50 dark:bg-navy-800 rounded-full flex items-center justify-center text-[#2563EB] text-2xl">
                      <MdFolder />
                   </div>
                   <button onClick={() => handleDelete(d.id, d.name)} className="text-[#64748B] hover:text-red-500 transition p-1">
                      <MdDelete className="text-xl" />
                   </button>
                </div>
                <h4 className="text-[16px] font-bold text-[#0F172A] dark:text-white mb-1">{d.name}</h4>
                <p className="text-[13px] text-[#64748B] dark:text-gray-400 mb-4">Head: {d.head || "Not Assigned"}</p>
                <div className="flex items-center justify-between pt-4 border-t border-[#E2E8F0] dark:border-navy-700">
                   <div className="text-center">
                      <p className="text-[11px] font-bold text-[#64748B] uppercase">Employees</p>
                      <p className="text-[14px] font-bold text-[#0F172A] dark:text-white">{empCounts[d.name] || 0}</p>
                   </div>
                </div>
             </Card>
          ))}
          {depts.length === 0 && !loading && <p className="p-4 text-gray-500">No departments configured yet.</p>}
       </div>

       {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
             <div className="w-full max-w-[400px] bg-white dark:bg-navy-800 rounded-[20px] shadow-xl p-6">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-[18px] font-bold text-[#0F172A] dark:text-white">New Department</h3>
                   <button onClick={() => setShowModal(false)} className="text-[#64748B] hover:text-[#0F172A]"><MdClose className="text-xl" /></button>
                </div>
                <div className="space-y-4">
                   <div>
                      <label className="text-[12px] font-bold text-[#1E293B] dark:text-gray-300">Department Name*</label>
                      <input type="text" className="w-full h-11 mt-1 px-4 border border-[#E2E8F0] dark:border-navy-700 rounded-[10px] text-[13px] outline-none focus:border-[#2563EB]" placeholder="e.g. Design Team" value={newDept.name} onChange={e => setNewDept({...newDept, name: e.target.value})} />
                   </div>
                   <div>
                      <label className="text-[12px] font-bold text-[#1E293B] dark:text-gray-300">Department Head (Optional)</label>
                      <input type="text" className="w-full h-11 mt-1 px-4 border border-[#E2E8F0] dark:border-navy-700 rounded-[10px] text-[13px] outline-none focus:border-[#2563EB]" placeholder="Name of Manager" value={newDept.head} onChange={e => setNewDept({...newDept, head: e.target.value})} />
                   </div>
                </div>
                <div className="mt-8 flex gap-3">
                   <button onClick={() => setShowModal(false)} className="flex-1 h-11 border border-[#E2E8F0] dark:border-navy-700 rounded-[10px] text-[13px] font-bold text-[#64748B] hover:bg-gray-50">Cancel</button>
                   <button onClick={handleSave} className="flex-1 h-11 bg-[#2563EB] text-white rounded-[10px] text-[13px] font-bold shadow-md hover:bg-[#1D4ED8] flex items-center justify-center gap-2">
                      <MdCheckCircle /> Save Department
                   </button>
                </div>
             </div>
          </div>
       )}
    </div>
  );
};
export default TabDepartments;
