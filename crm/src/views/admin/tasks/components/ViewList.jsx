import React from "react";
import Card from "components/card";
import { MdDelete } from "react-icons/md";

const ViewList = ({ onSelect, onDelete, tasks = [] }) => {
  return (
    <div className="animate-fade-in">
       <Card extra="border border-[#E2E8F0] overflow-hidden shadow-sm">
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse min-w-[1200px]">
               <thead>
                 <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                   <th className="py-4 px-6 text-[11px] font-bold text-[#64748B] uppercase tracking-wider w-10">
                      <input type="checkbox" className="w-4 h-4 rounded border-gray-300" disabled />
                   </th>
                   <th className="py-4 px-4 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Task</th>
                   <th className="py-4 px-4 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Module</th>
                   <th className="py-4 px-4 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Linked Record</th>
                   <th className="py-4 px-4 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Employee</th>
                   <th className="py-4 px-4 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Priority</th>
                   <th className="py-4 px-4 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Due Date</th>
                   <th className="py-4 px-4 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Status</th>
                   <th className="py-4 px-6 text-[11px] font-bold text-[#64748B] uppercase tracking-wider text-right">Actions</th>
                 </tr>
               </thead>
               <tbody>
                  {tasks.length === 0 ? (
                     <tr>
                        <td colSpan="9" className="py-20 text-center">
                           <div className="w-16 h-16 bg-gray-50 rounded-full border border-gray-200 flex items-center justify-center text-gray-300 text-3xl mx-auto mb-4">
                           </div>
                           <h3 className="text-[18px] font-bold text-[#0F172A] mb-2">No Tasks Found</h3>
                           <p className="text-[14px] text-[#64748B] mb-4">Click "New Task" to create one.</p>
                        </td>
                     </tr>
                  ) : (
                     tasks.map(t => (
                        <tr key={t.id} className="border-b border-[#E2E8F0] hover:bg-gray-50 transition cursor-pointer" onClick={() => onSelect(t)}>
                           <td className="py-3 px-4"><input type="checkbox" className="w-4 h-4 rounded border-gray-300" /></td>
                           <td className="py-3 px-4">
                              <p className="text-[13px] font-bold text-[#0F172A]">{t.title}</p>
                              <p className="text-[11px] text-[#64748B]">{t.id}</p>
                           </td>
                           <td className="py-3 px-4 text-[13px] font-bold text-[#64748B]">{t.module}</td>
                           <td className="py-3 px-4 text-[13px] text-[#0F172A]">{t.linkedRecordName || '—'}</td>
                           <td className="py-3 px-4 text-[13px] text-[#0F172A]">{t.assigneeName || '—'}</td>
                           <td className="py-3 px-4">
                              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${t.priority === 'High' || t.priority === 'Critical' ? 'bg-red-50 text-red-600' : t.priority === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-gray-100 text-gray-600'}`}>
                                 {t.priority}
                              </span>
                           </td>
                           <td className="py-3 px-4 text-[13px] text-[#64748B]">{t.dueDate || '—'}</td>
                           <td className="py-3 px-6">
                              <span className={`text-[12px] font-bold ${t.status === 'Completed' ? 'text-green-600' : t.status === 'In Progress' ? 'text-blue-600' : 'text-gray-500'}`}>{t.status}</span>
                           </td>
                           <td className="py-3 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                              <button onClick={() => onDelete && onDelete(t.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition inline-flex items-center" title="Delete Task">
                                 <MdDelete size={18} />
                              </button>
                           </td>
                        </tr>
                     ))
                  )}
               </tbody>
             </table>
           </div>
        </Card>
    </div>
  );
};

export default ViewList;
