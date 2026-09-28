import React, { useState, useEffect } from "react";
import Card from "components/card";
import { MdAdd, MdMoreVert, MdEngineering, MdClose, MdCheckCircle, MdDelete } from "react-icons/md";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);

const TabDesignations = () => {
  const [desigs, setDesigs] = useState([]);
  const [empCounts, setEmpCounts] = useState({});
  const [depts, setDepts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newDesig, setNewDesig] = useState({ title: "", department: "", level: "Junior" });
  const [loading, setLoading] = useState(true);

  const fetchDesigs = async () => {
     setLoading(true);
     const { data: dData, error: dError } = await supabase.from('designations').select('*').order('created_at', { ascending: true });
     const { data: eData, error: eError } = await supabase.from('employees').select('designation');
     const { data: deptData } = await supabase.from('departments').select('name');
     
     if (deptData) setDepts(deptData.map(d => d.name));
     if (!dError && dData) setDesigs(dData);
     if (!eError && eData) {
        const counts = {};
        eData.forEach(e => {
           if (e.designation) counts[e.designation] = (counts[e.designation] || 0) + 1;
        });
        setEmpCounts(counts);
     }
     setLoading(false);
  };

  useEffect(() => { fetchDesigs(); }, []);

  const handleSave = async () => {
     if (!newDesig.title) { alert("Title is required."); return; }
     const { error } = await supabase.from('designations').insert([{ 
         title: newDesig.title, 
         department: newDesig.department, 
         level: newDesig.level 
     }]);
     if (error) alert("Failed to save. It may already exist.");
     else {
        setNewDesig({ title: "", department: "", level: "Junior" });
        setShowModal(false);
        fetchDesigs();
     }
  };

  const handleDelete = async (id, title) => {
     if (empCounts[title] > 0) {
        alert(`Cannot delete ${title} because there are ${empCounts[title]} employees assigned to it.`);
        return;
     }
     if (!window.confirm(`Are you sure you want to delete ${title}?`)) return;
     const { error } = await supabase.from('designations').delete().eq('id', id);
     if (error) alert("Failed to delete.");
     else fetchDesigs();
  };

  return (
    <div className="animate-fade-in relative">
       <div className="flex justify-between items-center mb-6">
          <div>
             <h3 className="text-[18px] font-bold text-[#0F172A] dark:text-white">Designations ({desigs.length})</h3>
             <p className="text-[14px] text-[#64748B] dark:text-gray-400">Define job titles and hierarchy levels.</p>
          </div>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-[#10B981] text-white px-4 py-2 rounded-[10px] text-[13px] font-bold shadow-md hover:bg-[#059669] transition">
             <MdAdd className="text-lg" /> Add Designation
          </button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? <p className="p-4">Loading...</p> : desigs.map((d) => (
             <Card key={d.id} extra="p-5 border border-[#E2E8F0] dark:border-navy-700 shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-start mb-4">
                   <div className="w-10 h-10 bg-green-50 dark:bg-navy-800 rounded-full flex items-center justify-center text-[#10B981] text-xl">
                      <MdEngineering />
                   </div>
                   <button onClick={() => handleDelete(d.id, d.title)} className="text-[#64748B] hover:text-red-500 transition p-1"><MdDelete className="text-xl" /></button>
                </div>
                <h4 className="text-[15px] font-bold text-[#0F172A] dark:text-white mb-1">{d.title}</h4>
                <p className="text-[12px] text-[#64748B] dark:text-gray-400 mb-1">Dept: {d.department || "General"}</p>
                <div className="flex justify-between items-end mt-4 pt-4 border-t border-[#E2E8F0] dark:border-navy-700">
                   <span className="bg-gray-100 dark:bg-navy-700 text-[#475569] dark:text-gray-300 px-2 py-1 rounded-[6px] text-[10px] font-bold">{d.level}</span>
                   <div className="text-right">
                      <p className="text-[10px] font-bold text-[#64748B] uppercase">Employees</p>
                      <p className="text-[13px] font-bold text-[#0F172A] dark:text-white">{empCounts[d.title] || 0}</p>
                   </div>
                </div>
             </Card>
          ))}
          {desigs.length === 0 && !loading && <p className="p-4 text-gray-500">No designations configured yet.</p>}
       </div>

       {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
             <div className="w-full max-w-[400px] bg-white dark:bg-navy-800 rounded-[20px] shadow-xl p-6">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-[18px] font-bold text-[#0F172A] dark:text-white">New Designation</h3>
                   <button onClick={() => setShowModal(false)} className="text-[#64748B] hover:text-[#0F172A]"><MdClose className="text-xl" /></button>
                </div>
                <div className="space-y-4">
                   <div>
                      <label className="text-[12px] font-bold text-[#1E293B] dark:text-gray-300">Job Title*</label>
                      <input type="text" className="w-full h-11 mt-1 px-4 border border-[#E2E8F0] dark:border-navy-700 rounded-[10px] text-[13px] outline-none focus:border-[#10B981]" placeholder="e.g. Senior Architect" value={newDesig.title} onChange={e => setNewDesig({...newDesig, title: e.target.value})} />
                   </div>
                   <div>
                      <label className="text-[12px] font-bold text-[#1E293B] dark:text-gray-300">Department</label>
                      <select className="w-full h-11 mt-1 px-4 border border-[#E2E8F0] dark:border-navy-700 rounded-[10px] text-[13px] outline-none focus:border-[#10B981]" value={newDesig.department} onChange={e => setNewDesig({...newDesig, department: e.target.value})}>
                         <option value="">Select Department</option>
                         {depts.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                   </div>
                   <div>
                      <label className="text-[12px] font-bold text-[#1E293B] dark:text-gray-300">Seniority Level</label>
                      <select className="w-full h-11 mt-1 px-4 border border-[#E2E8F0] dark:border-navy-700 rounded-[10px] text-[13px] outline-none focus:border-[#10B981]" value={newDesig.level} onChange={e => setNewDesig({...newDesig, level: e.target.value})}>
                         <option>Entry</option>
                         <option>Junior</option>
                         <option>Standard</option>
                         <option>Senior</option>
                         <option>Lead / Manager</option>
                         <option>Executive</option>
                      </select>
                   </div>
                </div>
                <div className="mt-8 flex gap-3">
                   <button onClick={() => setShowModal(false)} className="flex-1 h-11 border border-[#E2E8F0] dark:border-navy-700 rounded-[10px] text-[13px] font-bold text-[#64748B] hover:bg-gray-50">Cancel</button>
                   <button onClick={handleSave} className="flex-1 h-11 bg-[#10B981] text-white rounded-[10px] text-[13px] font-bold shadow-md hover:bg-[#059669] flex items-center justify-center gap-2">
                      <MdCheckCircle /> Save Designation
                   </button>
                </div>
             </div>
          </div>
       )}
    </div>
  );
};
export default TabDesignations;
