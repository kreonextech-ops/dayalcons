import React, { useState, useEffect } from "react";
import Card from "components/card";
import { createClient } from "@supabase/supabase-js";
import { MdEdit } from "react-icons/md";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);

const TabOverview = ({ task, contextData = {} }) => {
    
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [descVal, setDescVal] = useState("");

  const [isEditingDate, setIsEditingDate] = useState(false);
  const [dateVal, setDateVal] = useState("");

  useEffect(() => {
    if (task) {
      setDescVal(task.description || "");
      setDateVal(task.due_date || "");
    }
  }, [task]);

  const handleSaveDesc = async () => {
    await supabase.from("tasks").update({ description: descVal }).eq("id", task.id);
    setIsEditingDesc(false);
    task.description = descVal;
  };

  const handleSaveDate = async () => {
    await supabase.from("tasks").update({ due_date: dateVal }).eq("id", task.id);
    setIsEditingDate(false);
    task.due_date = dateVal;
  };

  if (!task) return null;

  return (
    <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-6">
       
       {/* Details */}
       <Card extra="p-6 border border-[#E2E8F0]">
         <h3 className="text-[16px] font-bold text-[#0F172A] mb-5">Task Details</h3>
         <div className="space-y-4">
            <div>
               <label className="text-[11px] font-bold text-[#64748B] uppercase mb-1 flex items-center justify-between">
                  Description 
                  {!isEditingDesc && <MdEdit className="cursor-pointer hover:text-blue-500" onClick={() => setIsEditingDesc(true)} />}
               </label>
               {isEditingDesc ? (
                  <div className="mt-1">
                     <textarea 
                        className="w-full p-2 border border-blue-500 rounded outline-none text-[14px]"
                        rows="3"
                        autoFocus
                        value={descVal}
                        onChange={e => setDescVal(e.target.value)}
                     ></textarea>
                     <div className="flex gap-2 mt-2">
                        <button onClick={handleSaveDesc} className="bg-blue-600 text-white px-3 py-1 text-xs rounded font-bold">Save</button>
                        <button onClick={() => { setIsEditingDesc(false); setDescVal(task.description || ""); }} className="bg-gray-100 text-gray-600 px-3 py-1 text-xs rounded font-bold">Cancel</button>
                     </div>
                  </div>
               ) : (
                  <p 
                     className="text-[14px] font-medium text-[#0F172A] whitespace-pre-wrap cursor-pointer hover:bg-gray-50 rounded p-1 -ml-1 transition"
                     onClick={() => setIsEditingDesc(true)}
                  >
                     {task.description || "No description provided. Click to add one."}
                  </p>
               )}
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
               <div>
                  <label className="text-[11px] font-bold text-[#64748B] uppercase flex justify-between items-center pr-2">
                     Due Date
                     {!isEditingDate && <MdEdit className="cursor-pointer hover:text-blue-500" onClick={() => setIsEditingDate(true)} />}
                  </label>
                  {isEditingDate ? (
                     <div className="mt-1 flex gap-2 flex-col">
                        <input 
                           type="date"
                           className="w-full p-1.5 border border-blue-500 rounded outline-none text-[13px]"
                           autoFocus
                           value={dateVal}
                           onChange={e => setDateVal(e.target.value)}
                        />
                        <div className="flex gap-2">
                           <button onClick={handleSaveDate} className="bg-blue-600 text-white px-3 py-1 text-xs rounded font-bold">Save</button>
                           <button onClick={() => { setIsEditingDate(false); setDateVal(task.due_date || ""); }} className="bg-gray-100 text-gray-600 px-3 py-1 text-xs rounded font-bold">Cancel</button>
                        </div>
                     </div>
                  ) : (
                     <p 
                        className="text-[14px] font-medium text-[#0F172A] cursor-pointer hover:bg-gray-50 rounded p-1 -ml-1 transition"
                        onClick={() => setIsEditingDate(true)}
                     >
                        {task.due_date ? new Date(task.due_date).toLocaleDateString('en-GB') : "No due date"}
                     </p>
                  )}
               </div>
               <div><label className="text-[11px] font-bold text-[#64748B] uppercase">Task Category</label><p className="text-[14px] font-medium text-[#0F172A] p-1 -ml-1">{task.category || "General"}</p></div>
            </div>
         </div>
       </Card>

       {/* Linked Record Card */}
       <Card extra="p-6 border border-[#E2E8F0]">
         <h3 className="text-[16px] font-bold text-[#0F172A] mb-5">Linked To</h3>
         <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
             <div className="text-[14px] font-medium text-[#0F172A]">
                 {!contextData.client && !contextData.lead && !contextData.project && !contextData.service ? (
                    <span className="text-gray-500 italic">No valid linked record found</span>
                 ) : contextData.project ? (
                    <>
                       {contextData.client && (
                          <>Client: <a href={`/admin/clients?clientId=${contextData.client.id}`} className="text-[#2563EB] hover:underline font-bold mr-2">{contextData.client.name}</a> &bull; </>
                       )}
                       Project ID: <a href={`/admin/projects?projectId=${contextData.project.id}`} className="text-[#2563EB] hover:underline font-bold ml-1">PRJ-{contextData.project.id.substring(0,5).toUpperCase()}</a>
                    </>
                 ) : contextData.service ? (
                    <>
                       {contextData.client && (
                          <>Client: <a href={`/admin/clients?clientId=${contextData.client.id}`} className="text-[#2563EB] hover:underline font-bold mr-2">{contextData.client.name}</a> &bull; </>
                       )}
                       Service ID: <a href={`/admin/services?serviceId=${contextData.service.id}`} className="text-[#2563EB] hover:underline font-bold ml-1">SER-{contextData.service.id.substring(0,5).toUpperCase()}</a>
                    </>
                 ) : contextData.lead ? (
                    <>Lead: <a href={`/admin/crm?leadId=${contextData.lead.id}`} className="text-[#2563EB] hover:underline font-bold ml-1">{contextData.lead.name}</a></>
                 ) : contextData.client ? (
                    <>Client: <a href={`/admin/clients?clientId=${contextData.client.id}`} className="text-[#2563EB] hover:underline font-bold ml-1">{contextData.client.name}</a></>
                 ) : null}
             </div>
         </div>
       </Card>
    </div>
  );
};

export default TabOverview;
