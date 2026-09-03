import React, { useState, useEffect } from "react";
import Card from "components/card";
import { MdAdd } from "react-icons/md";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);

const TabTimeLog = ({ task }) => {
  const [logs, setLogs] = useState([]);
  const [isLoggingTime, setIsLoggingTime] = useState(false);
  const [newLog, setNewLog] = useState({ hours: "", description: "" });

  useEffect(() => {
    fetchLogs();
  }, [task]);

  const fetchLogs = async () => {
    if (!task) return;
    const { data } = await supabase.from('task_activity_logs').select('*').eq('task_id', task.id).order('created_at', { ascending: false });
    if (data) setLogs(data);
  };

  const handleLogTime = async () => {
    if (!newLog.hours || !task) return;
    const userStr = localStorage.getItem("dayal_user");
    const user = userStr ? JSON.parse(userStr) : { name: "Admin" };

    const { data, error } = await supabase.from('task_activity_logs').insert([{
       task_id: task.id,
       employee_name: user.name || "Admin",
       activity_type: "Time Log",
       description: newLog.description || "Logged time",
       hours: parseFloat(newLog.hours)
    }]).select();

    if (error) {
       alert("Failed to save time log: " + error.message);
       return;
    }

    if (data) {
       setLogs([data[0], ...logs]);
       setIsLoggingTime(false);
       setNewLog({ hours: "", description: "" });
    }
  };

  return (
    <div className="animate-fade-in max-w-4xl">
       <div className="flex justify-between items-center mb-6">
         <div>
            <h3 className="text-[18px] font-bold text-[#0F172A]">Activity & Time Log</h3>
            <p className="text-[13px] text-[#64748B]">History of task progress, events, and hours logged.</p>
         </div>
         <button onClick={() => setIsLoggingTime(!isLoggingTime)} className="flex items-center gap-1 bg-[#10B981] text-white px-4 py-2 rounded-lg text-[13px] font-bold shadow-sm hover:bg-green-600">
            <MdAdd /> {isLoggingTime ? "Cancel" : "Log Hours"}
         </button>
       </div>

       {isLoggingTime && (
          <Card extra="border border-[#E2E8F0] overflow-hidden shadow-sm p-6 mb-6 bg-green-50/30">
             <h4 className="text-[14px] font-bold text-[#0F172A] mb-4">New Time Log</h4>
             <div className="flex gap-4">
                <div className="w-32">
                   <label className="text-[11px] font-bold text-[#64748B] uppercase mb-1 block">Hours</label>
                   <input type="number" step="0.5" min="0" value={newLog.hours} onChange={e => setNewLog({...newLog, hours: e.target.value})} className="w-full h-10 px-3 rounded-lg border border-gray-300 outline-none focus:border-green-500 text-[14px]" placeholder="e.g. 2.5" />
                </div>
                <div className="flex-1">
                   <label className="text-[11px] font-bold text-[#64748B] uppercase mb-1 block">Description of Work</label>
                   <input type="text" value={newLog.description} onChange={e => setNewLog({...newLog, description: e.target.value})} className="w-full h-10 px-3 rounded-lg border border-gray-300 outline-none focus:border-green-500 text-[14px]" placeholder="What did you do?" />
                </div>
                <div className="flex items-end">
                   <button onClick={handleLogTime} className="h-10 px-6 bg-[#10B981] text-white font-bold rounded-lg hover:bg-green-600 text-[13px]">Save Log</button>
                </div>
             </div>
          </Card>
       )}

       <Card extra="border border-[#E2E8F0] overflow-hidden shadow-sm">
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                   <th className="py-4 px-6 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Date & Time</th>
                   <th className="py-4 px-4 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">User</th>
                   <th className="py-4 px-4 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Activity</th>
                   <th className="py-4 px-4 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Details</th>
                 </tr>
               </thead>
               <tbody>
                  {logs.length === 0 ? (
                     <tr>
                        <td colSpan="4" className="py-16 text-center">
                           <h3 className="text-[16px] font-bold text-[#0F172A] mb-2">No Activity Recorded</h3>
                           <p className="text-[14px] text-[#64748B]">Task progress, status changes, and time logs will appear here.</p>
                        </td>
                     </tr>
                  ) : (
                     logs.map(log => (
                        <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                           <td className="py-3 px-6 text-[13px] text-gray-500 whitespace-nowrap">{new Date(log.created_at).toLocaleString()}</td>
                           <td className="py-3 px-4 text-[13px] font-bold text-[#0F172A]">{log.employee_name}</td>
                           <td className="py-3 px-4 text-[13px] font-bold">
                              {log.activity_type === "Time Log" ? (
                                 <span className="text-green-600 bg-green-50 px-2 py-1 rounded">Time Log ({log.hours}h)</span>
                              ) : (
                                 <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded">{log.activity_type}</span>
                              )}
                           </td>
                           <td className="py-3 px-4 text-[13px] text-gray-700">{log.description}</td>
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

export default TabTimeLog;
