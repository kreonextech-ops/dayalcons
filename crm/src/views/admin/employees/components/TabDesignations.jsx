import React, { useState, useEffect } from "react";
import Card from "components/card";
import { MdAdd, MdMoreVert, MdWork, MdClose, MdCheckCircle } from "react-icons/md";

const TabDesignations = () => {
  const [designations, setDesignations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newDesig, setNewDesig] = useState({ title: "", department: "", reportsTo: "" });
  const [availableDepts, setAvailableDepts] = useState([]);

  useEffect(() => {
     const saved = localStorage.getItem("dayal_designations");
     if (saved) setDesignations(JSON.parse(saved));
     
     const depts = localStorage.getItem("dayal_departments");
     if (depts) setAvailableDepts(JSON.parse(depts));
  }, []);

  const handleSave = () => {
     if (!newDesig.title) return;
     const updated = [...designations, { ...newDesig, empCount: 0 }];
     localStorage.setItem("dayal_designations", JSON.stringify(updated));
     setDesignations(updated);
     setNewDesig({ title: "", department: "", reportsTo: "" });
     setShowModal(false);
  };

  return (
    <div className="animate-fade-in relative">
       <div className="flex justify-between items-center mb-6">
          <div>
             <h3 className="text-[18px] font-bold text-[#0F172A]">Designations</h3>
             <p className="text-[13px] text-[#64748B]">Custom organizational hierarchy mapped to departments.</p>
          </div>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-1 bg-[#2563EB] text-white px-4 py-2 rounded-lg text-[13px] font-bold shadow-sm hover:bg-[#1D4ED8]">
             <MdAdd /> Create Designation
          </button>
       </div>

       <Card extra="border border-[#E2E8F0] overflow-hidden shadow-sm">
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse min-w-[800px]">
               <thead>
                 <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                   <th className="py-4 px-6 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Designation</th>
                   <th className="py-4 px-4 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Department</th>
                   <th className="py-4 px-4 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Reports To</th>
                   <th className="py-4 px-4 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Employees</th>
                   <th className="py-4 px-6 text-[11px] font-bold text-[#64748B] uppercase tracking-wider text-right">Actions</th>
                 </tr>
               </thead>
               <tbody>
                  {designations.length === 0 ? (
                     <tr>
                        <td colSpan="5" className="py-16 text-center">
                           <h3 className="text-[16px] font-bold text-[#0F172A] mb-2">No designations created.</h3>
                           <p className="text-[14px] text-[#64748B]">Click "Create Designation" to set up hierarchy.</p>
                        </td>
                     </tr>
                  ) : (
                     designations.map((d, i) => (
                        <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition">
                           <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center text-sm"><MdWork /></div>
                                 <p className="text-[14px] font-bold text-[#0F172A]">{d.title}</p>
                              </div>
                           </td>
                           <td className="py-4 px-4 text-[13px] font-medium text-[#475569]">{d.department || "—"}</td>
                           <td className="py-4 px-4 text-[13px] text-[#64748B]">{d.reportsTo || "—"}</td>
                           <td className="py-4 px-4"><span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full text-[11px] font-bold">{d.empCount}</span></td>
                           <td className="py-4 px-6 text-right"><button className="text-gray-400 hover:text-[#0F172A]"><MdMoreVert size={20} /></button></td>
                        </tr>
                     ))
                  )}
               </tbody>
             </table>
           </div>
        </Card>

       {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
             <div className="w-full max-w-[500px] bg-white rounded-[20px] shadow-2xl flex flex-col animate-fade-in">
                <div className="p-6 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC] rounded-t-[20px]">
                   <h2 className="text-[18px] font-bold text-[#0F172A]">Create Designation</h2>
                   <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center text-gray-500 transition"><MdClose size={20} /></button>
                </div>
                <div className="p-6 space-y-4">
                   <div>
                      <label className="block text-[11px] font-bold text-[#475569] mb-1.5 uppercase">Designation Title *</label>
                      <input type="text" value={newDesig.title} onChange={e => setNewDesig({...newDesig, title: e.target.value})} placeholder="e.g. Lead Architect" className="w-full h-11 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none focus:border-[#2563EB]"/>
                   </div>
                   <div>
                      <label className="block text-[11px] font-bold text-[#475569] mb-1.5 uppercase">Assign to Department</label>
                      <select value={newDesig.department} onChange={e => setNewDesig({...newDesig, department: e.target.value})} className="w-full h-11 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none focus:border-[#2563EB] bg-white">
                         <option value="">Select Department</option>
                         {availableDepts.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
                      </select>
                   </div>
                   <div>
                      <label className="block text-[11px] font-bold text-[#475569] mb-1.5 uppercase">Reports To (Optional)</label>
                      <input type="text" value={newDesig.reportsTo} onChange={e => setNewDesig({...newDesig, reportsTo: e.target.value})} placeholder="e.g. Project Manager" className="w-full h-11 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none focus:border-[#2563EB]"/>
                   </div>
                </div>
                <div className="p-6 border-t border-[#E2E8F0] flex justify-end gap-3 bg-white rounded-b-[20px]">
                   <button onClick={() => setShowModal(false)} className="px-5 h-10 rounded-[10px] font-bold text-sm text-[#64748B] hover:bg-gray-100 transition">Cancel</button>
                   <button onClick={handleSave} className="flex items-center gap-2 px-6 h-10 rounded-[10px] bg-[#2563EB] text-white font-bold text-sm hover:bg-[#1D4ED8] transition shadow-md"><MdCheckCircle size={18}/> Save Designation</button>
                </div>
             </div>
          </div>
       )}
    </div>
  );
};

export default TabDesignations;
