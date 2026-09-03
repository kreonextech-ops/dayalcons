import React, { useState, useEffect } from "react";
import Card from "components/card";
import { MdWork, MdAssignment, MdBusinessCenter, MdPerson } from "react-icons/md";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);

const TabAssignedWork = ({ employee }) => {
  const [work, setWork] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (employee?.id) {
      fetchWork();
    }
  }, [employee]);

  const fetchWork = async () => {
    setLoading(true);
    let allWork = [];

    try {
      // Fetch Leads
      const { data: leads } = await supabase.from('leads').select('*').like('assigned_to', `%${employee.id}%`);
      if (leads) allWork.push(...leads.map(l => ({ ...l, workType: 'Lead' })));

      // Fetch Clients
      const { data: clients } = await supabase.from('clients').select('*').like('assigned_to', `%${employee.id}%`);
      if (clients) allWork.push(...clients.map(c => ({ ...c, workType: 'Client' })));

      // Fetch Projects
      const { data: projects } = await supabase.from('projects').select('*').like('assigned_to', `%${employee.id}%`);
      if (projects) allWork.push(...projects.map(p => ({ ...p, workType: 'Execution Project', name: p.title || p.name })));

      // Fetch Services
      const { data: services } = await supabase.from('services').select('*').like('assigned_to', `%${employee.id}%`);
      if (services) allWork.push(...services.map(s => ({ ...s, workType: 'Design/Legal Service', name: s.title || s.name })));

      // Sort by recent
      allWork.sort((a, b) => new Date(b.created_at || b.updated_at) - new Date(a.created_at || a.updated_at));
      setWork(allWork);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const getIcon = (type) => {
    if (type === 'Lead') return <MdPerson className="text-orange-500" />;
    if (type === 'Client') return <MdBusinessCenter className="text-green-500" />;
    if (type === 'Execution Project') return <MdWork className="text-blue-500" />;
    return <MdAssignment className="text-purple-500" />;
  };

  return (
    <div className="animate-fade-in relative">
      <div className="flex justify-between items-center mb-6">
         <div>
            <h3 className="text-[18px] font-bold text-[#0F172A]">Assigned Workload</h3>
            <p className="text-[13px] text-[#64748B]">All Leads, Clients, and Projects currently assigned to {employee?.name}.</p>
         </div>
      </div>

      <Card extra="border border-[#E2E8F0] overflow-hidden shadow-sm">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                     <th className="py-4 px-6 text-[11px] font-bold text-[#64748B] uppercase">Type</th>
                     <th className="py-4 px-4 text-[11px] font-bold text-[#64748B] uppercase">Name / Title</th>
                     <th className="py-4 px-4 text-[11px] font-bold text-[#64748B] uppercase">Status</th>
                     <th className="py-4 px-4 text-[11px] font-bold text-[#64748B] uppercase">Created</th>
                  </tr>
               </thead>
               <tbody>
                  {loading ? (
                    <tr><td colSpan="4" className="py-16 text-center text-sm text-gray-500">Loading workload...</td></tr>
                  ) : work.length === 0 ? (
                    <tr>
                       <td colSpan="4" className="py-16 text-center">
                          <p className="text-[14px] text-[#64748B]">No work currently assigned to this employee.</p>
                       </td>
                    </tr>
                  ) : (
                    work.map(item => (
                      <tr key={`${item.workType}-${item.id}`} className="border-b border-gray-100 hover:bg-gray-50 transition">
                         <td className="py-4 px-6 flex items-center gap-2 text-sm font-bold text-gray-700">
                           {getIcon(item.workType)} {item.workType}
                         </td>
                         <td className="py-4 px-4 text-sm font-semibold text-[#0F172A]">{item.name || "Unnamed"}</td>
                         <td className="py-4 px-4 text-sm">
                           <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold">{item.status || "Active"}</span>
                         </td>
                         <td className="py-4 px-4 text-sm text-gray-500">{new Date(item.created_at).toLocaleDateString()}</td>
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

export default TabAssignedWork;
