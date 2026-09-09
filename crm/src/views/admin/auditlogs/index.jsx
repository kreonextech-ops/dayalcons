import React, { useState, useEffect } from "react";
import Card from "components/card";
import { createClient } from "@supabase/supabase-js";
import { MdMonitor, MdRefresh, MdExpandMore, MdExpandLess } from "react-icons/md";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedEmps, setExpandedEmps] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch logs
    const { data: logsData } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1500);
      
    // Fetch employees
    const { data: empData } = await supabase
      .from('employees')
      .select('id, name, designation')
      .order('name', { ascending: true });
      
    if (logsData) setLogs(logsData);
    if (empData) setEmployees(empData);
    
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleExpand = (empName) => {
     setExpandedEmps(prev => prev.includes(empName) ? prev.filter(e => e !== empName) : [...prev, empName]);
  };

  const filteredLogs = logs.filter(log => 
    (log.employee_name && log.employee_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (log.action_type && log.action_type.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (log.description && log.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (log.module && log.module.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Group logs by employee name
  const grouped = {};
  
  // Initialize with all employees so everyone shows up
  employees.forEach(emp => {
     grouped[emp.name] = { logs: [], details: emp };
  });

  filteredLogs.forEach(log => {
     const empName = log.employee_name || 'System / Unknown User';
     if (!grouped[empName]) {
        grouped[empName] = { logs: [], details: { name: empName, designation: 'System' } };
     }
     grouped[empName].logs.push(log);
  });

  const employeeNames = Object.keys(grouped).sort((a,b) => {
     const aLogs = grouped[a].logs;
     const bLogs = grouped[b].logs;
     // Sort by most recent log, then by name
     if (aLogs.length === 0 && bLogs.length === 0) return a.localeCompare(b);
     if (aLogs.length === 0) return 1;
     if (bLogs.length === 0) return -1;
     return new Date(bLogs[0].created_at) - new Date(aLogs[0].created_at);
  });

  const timeAgo = (dateStr) => {
    if (!dateStr) return "Never";
    const diff = new Date() - new Date(dateStr);
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="mt-5 w-full pb-12">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h4 className="text-[32px] font-bold text-navy-700 dark:text-white leading-tight">
            System Audit Logs
          </h4>
          <p className="mt-1 text-base text-gray-600">
            Monitor employee activities, logins, and system changes organized by user.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
           <input
             type="text"
             placeholder="Search logs..."
             className="h-11 w-full md:w-64 rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-brand-500 shadow-sm transition dark:bg-navy-900 dark:border-white/10 dark:text-white"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
           <button onClick={fetchData} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 shadow-sm transition dark:bg-navy-700 dark:border-white/10 dark:text-white dark:hover:bg-navy-600">
             <MdRefresh size={20} />
           </button>
        </div>
      </div>

      {loading ? (
         <div className="py-20 text-center text-gray-500 font-medium">Loading activity logs...</div>
      ) : (
         <div className="space-y-6">
            {employeeNames.map(empName => {
               const empData = grouped[empName];
               const empLogs = empData.logs;
               const isExpanded = expandedEmps.includes(empName);
               const displayLogs = isExpanded ? empLogs : empLogs.slice(0, 5);
               
               return (
                  <Card key={empName} extra="w-full p-0 overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition dark:border-white/10">
                     <div 
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-gray-50/50 cursor-pointer border-b border-gray-100 dark:bg-navy-800/50 dark:border-white/10"
                        onClick={() => toggleExpand(empName)}
                     >
                        <div className="flex items-center gap-4">
                           <div className="h-12 w-12 bg-[#2563EB] text-white rounded-full flex items-center justify-center font-bold text-xl shadow-inner shrink-0">
                              {empName.charAt(0).toUpperCase()}
                           </div>
                           <div>
                              <h3 className="text-lg font-bold text-navy-700 dark:text-white">{empName}</h3>
                              <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                 <span>{empLogs.length} total activities</span>
                                 <span className="w-1 h-1 bg-gray-300 rounded-full dark:bg-gray-600"></span>
                                 <span>Last active: <span className="text-navy-700 dark:text-gray-300">{empLogs.length > 0 ? timeAgo(empLogs[0].created_at) : 'Never'}</span></span>
                              </p>
                           </div>
                        </div>
                        {empLogs.length > 0 && (
                           <button className="mt-4 sm:mt-0 px-4 py-2 text-sm font-bold text-[#2563EB] bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center justify-center gap-1 transition dark:bg-navy-700 dark:text-white dark:hover:bg-navy-600 shrink-0">
                              {isExpanded ? <><MdExpandLess size={18} /> Show Less</> : <><MdExpandMore size={18} /> View All</>}
                           </button>
                        )}
                     </div>

                     {empLogs.length > 0 ? (
                        <div className="overflow-x-auto">
                           <table className="w-full text-left min-w-[700px]">
                              <thead>
                                 <tr className="bg-white border-b border-gray-100 dark:bg-navy-800 dark:border-white/10">
                                    <th className="py-3 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider w-[180px]">Timestamp</th>
                                    <th className="py-3 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider w-[120px]">Action</th>
                                    <th className="py-3 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider w-[150px]">Module</th>
                                    <th className="py-3 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Description</th>
                                    <th className="py-3 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider w-[180px]">System Info</th>
                                 </tr>
                              </thead>
                              <tbody className="bg-white dark:bg-navy-900">
                                 {displayLogs.map(log => (
                                    <tr key={log.id} onClick={() => setSelectedLog(log)} className="cursor-pointer border-b border-gray-50 hover:bg-blue-50/50 transition last:border-0 dark:border-white/5 dark:hover:bg-navy-800">
                                       <td className="py-3 px-6 text-[13px] text-gray-600 font-medium dark:text-gray-300">
                                          {new Date(log.created_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                       </td>
                                       <td className="py-3 px-6">
                                          <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide
                                             ${log.action_type === 'LOGIN' ? 'bg-green-100 text-green-700' : 
                                               log.action_type === 'CREATE' ? 'bg-blue-100 text-blue-700' : 
                                               log.action_type === 'UPDATE' ? 'bg-orange-100 text-orange-700' : 
                                               log.action_type === 'DELETE' ? 'bg-red-100 text-red-700' : 
                                               'bg-gray-100 text-gray-700'}`}>
                                             {log.action_type}
                                          </span>
                                       </td>
                                       <td className="py-3 px-6 text-[13px] text-navy-700 font-bold dark:text-white">
                                          {log.module}
                                       </td>
                                       <td className="py-3 px-6 text-[13px] text-gray-600 dark:text-gray-300">
                                          {log.description}
                                       </td>
                                       <td className="py-3 px-6">
                                          <div className="flex flex-col">
                                             <span className="text-[12px] font-bold text-navy-700 flex items-center gap-1.5 dark:text-white">
                                                <MdMonitor className="text-gray-400" /> {log.ip_address || '—'}
                                             </span>
                                             <span className="text-[10px] font-medium text-gray-400 w-36 truncate" title={log.device_info}>
                                                {log.device_info || '—'}
                                             </span>
                                          </div>
                                       </td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                           {!isExpanded && empLogs.length > 5 && (
                              <div className="bg-gray-50/50 border-t border-gray-100 p-2.5 text-center dark:bg-navy-800 dark:border-white/10 cursor-pointer" onClick={() => toggleExpand(empName)}>
                                 <p className="text-[12px] font-bold text-gray-400 hover:text-blue-500 transition">
                                    + {empLogs.length - 5} more activities. Click to view all.
                                 </p>
                              </div>
                           )}
                        </div>
                     ) : (
                        <div className="p-8 text-center bg-white dark:bg-navy-900 border-t border-gray-100 dark:border-white/10">
                           <p className="text-sm font-medium text-gray-400">No log activity yet.</p>
                        </div>
                     )}
                  </Card>
               );
            })}
         </div>
      )}
    </div>
  );
}
