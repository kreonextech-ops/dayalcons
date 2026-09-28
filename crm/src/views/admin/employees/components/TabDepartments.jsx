import React, { useState, useEffect } from "react";
import Card from "components/card";
import { MdAdd, MdMoreVert, MdFolder, MdClose, MdCheckCircle } from "react-icons/md";

const TabDepartments = () => {
  const [depts, setDepts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newDept, setNewDept] = useState({ name: "", head: "" });

  useEffect(() => {
     const saved = localStorage.getItem("dayal_departments");
     if (saved) setDepts(JSON.parse(saved));
  }, []);

  const handleSave = () => {
     if (!newDept.name) return;
     const updated = [...depts, { ...newDept, empCount: 0, projects: 0 }];
     localStorage.setItem("dayal_departments", JSON.stringify(updated));
     setDepts(updated);
     setNewDept({ name: "", head: "" });
     setShowModal(false);
  };

  return (
    <div className="animate-fade-in relative">
       <div className="flex justify-between items-center mb-6">
          <div>
             <h3 className="text-[18px] font-bold text-[#0F172A]">Company Departments</h3>
             <p className="text-[13px] text-[#64748B]">Create and manage internal departments dynamically.</p>
          </div>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-1 bg-[#2563EB] text-white px-4 py-2 rounded-lg text-[13px] font-bold shadow-sm hover:bg-[#1D4ED8]">
             <MdAdd /> New Department
          </button>
       </div>

       {depts.length === 0 ? (
          <div className="w-full py-16 text-center bg-white rounded-xl border border-[#E2E8F0]">
             <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-[#2563EB] text-3xl mx-auto mb-4"><MdFolder /></div>
             <h3 className="text-[18px] font-bold text-[#0F172A] mb-2">No Departments Configured</h3>
             <p className="text-[14px] text-[#64748B] mb-4">Create your first department to start organizing your workforce.</p>
          </div>
       ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             {depts.map(d => (
                <Card key={d.name} extra="p-5 border border-[#E2E8F0] shadow-sm hover:shadow-md transition group">
                   <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center text-xl"><MdFolder /></div>
                      <button className="text-gray-400 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition"><MdMoreVert size={20}/></button>
                   </div>
                   <h4 className="text-[16px] font-bold text-[#0F172A] mb-1">{d.name}</h4>
                   <p className="text-[12px] font-medium text-[#64748B] mb-4">Head: <span className="text-[#0F172A]">{d.head || "—"}</span></p>
                   
                   <div className="flex justify-between items-center pt-3 border-t border-[#E2E8F0]">
                      <span className="text-[12px] font-bold text-[#475569]">{d.empCount} Employees</span>
                      {d.projects > 0 && <span className="bg-blue-100 text-[#2563EB] px-2 py-0.5 rounded text-[11px] font-bold">{d.projects} Active</span>}
                   </div>
                </Card>
             ))}
          </div>
       )}

       {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
             <div className="w-full max-w-[500px] bg-white rounded-[20px] shadow-2xl flex flex-col animate-fade-in">
                <div className="p-6 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC] rounded-t-[20px]">
                   <h2 className="text-[18px] font-bold text-[#0F172A]">Create New Department</h2>
                   <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center text-gray-500 transition"><MdClose size={20} /></button>
                </div>
                <div className="p-6 space-y-4">
                   <div>
                      <label className="block text-[11px] font-bold text-[#475569] mb-1.5 uppercase">Department Name *</label>
                      <input type="text" value={newDept.name} onChange={e => setNewDept({...newDept, name: e.target.value})} placeholder="e.g. Architecture" className="w-full h-11 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none focus:border-[#2563EB]"/>
                   </div>
                   <div>
                      <label className="block text-[11px] font-bold text-[#475569] mb-1.5 uppercase">Department Head (Optional)</label>
                      <input type="text" value={newDept.head} onChange={e => setNewDept({...newDept, head: e.target.value})} placeholder="Enter name" className="w-full h-11 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none focus:border-[#2563EB]"/>
                   </div>
                </div>
                <div className="p-6 border-t border-[#E2E8F0] flex justify-end gap-3 bg-white rounded-b-[20px]">
                   <button onClick={() => setShowModal(false)} className="px-5 h-10 rounded-[10px] font-bold text-sm text-[#64748B] hover:bg-gray-100 transition">Cancel</button>
                   <button onClick={handleSave} className="flex items-center gap-2 px-6 h-10 rounded-[10px] bg-[#2563EB] text-white font-bold text-sm hover:bg-[#1D4ED8] transition shadow-md"><MdCheckCircle size={18}/> Save Department</button>
                </div>
             </div>
          </div>
       )}
    </div>
  );
};

export default TabDepartments;
