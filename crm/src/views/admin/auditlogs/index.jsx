import React, { useState, useEffect } from "react";
import Card from "components/card";
import { createClient } from "@supabase/supabase-js";
import { MdMonitor, MdRefresh } from "react-icons/md";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchLogs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);
      
    if (!error && data) {
      setLogs(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => 
    (log.employee_name && log.employee_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (log.action_type && log.action_type.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (log.description && log.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (log.module && log.module.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="mt-5 w-full">
      <Card extra={"w-full h-full p-6"}>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h4 className="text-xl font-bold text-navy-700 dark:text-white">
              System Audit Logs
            </h4>
            <p className="mt-1 text-base text-gray-600">
              Monitor employee activities, logins, and system changes in real-time.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
             <input
               type="text"
               placeholder="Search logs..."
               className="h-10 rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-brand-500 dark:bg-navy-900 dark:border-white/10 dark:text-white"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
             <button onClick={fetchLogs} className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-navy-700 dark:hover:bg-navy-600 transition">
               <MdRefresh size={20} className="text-gray-600 dark:text-white" />
             </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 dark:bg-navy-800 dark:border-white/10">
                <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider dark:text-white">Timestamp</th>
                <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider dark:text-white">Employee</th>
                <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider dark:text-white">Action</th>
                <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider dark:text-white">Module</th>
                <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider dark:text-white">Description</th>
                <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider dark:text-white">IP / Device</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="py-8 text-center text-gray-500">Loading logs...</td></tr>
              ) : filteredLogs.length === 0 ? (
                <tr><td colSpan="6" className="py-8 text-center text-gray-500">No logs found.</td></tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50 transition dark:border-white/10 dark:hover:bg-navy-700/50">
                    <td className="py-4 px-4 text-sm text-gray-600 dark:text-white whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-4 px-4 text-sm font-bold text-navy-700 dark:text-white">
                      {log.employee_name || 'Unknown'}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium 
                        ${log.action_type === 'LOGIN' ? 'bg-green-100 text-green-700' : 
                          log.action_type === 'CREATE' ? 'bg-blue-100 text-blue-700' : 
                          log.action_type === 'DELETE' ? 'bg-red-100 text-red-700' : 
                          'bg-gray-100 text-gray-700'}`}>
                        {log.action_type}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600 dark:text-white font-medium">
                      {log.module}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600 dark:text-white">
                      {log.description}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-navy-700 dark:text-white flex items-center gap-1">
                          <MdMonitor /> {log.ip_address || '-'}
                        </span>
                        <span className="text-[10px] text-gray-500 w-48 truncate" title={log.device_info}>
                          {log.device_info || '-'}
                        </span>
                      </div>
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
}
