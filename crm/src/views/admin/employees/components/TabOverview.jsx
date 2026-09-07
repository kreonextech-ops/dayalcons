import React, { useState, useEffect } from "react";
import Card from "components/card";
import { MdCheckCircle, MdAssignment, MdLocationCity, MdOutlineArchitecture } from "react-icons/md";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);

const TabOverview = ({ empData }) => {
  const [metrics, setMetrics] = useState({
    activeProjects: 0,
    designCases: 0,
    pendingTasks: 0,
    siteVisits: 0
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!empData?.id) return;

      try {
        const empIdStr = String(empData.id);
        
        const [projRes, servRes, tasksRes] = await Promise.all([
          supabase.from('projects').select('id, assigned_to').like('assigned_to', `%${empIdStr}%`),
          supabase.from('services').select('id, assigned_to').like('assigned_to', `%${empIdStr}%`),
          supabase.from('tasks').select('*').eq('assignee_id', empData.id)
        ]);

        const activeProjects = projRes.data ? projRes.data.length : 0;
        const designCases = servRes.data ? servRes.data.length : 0;
        
        let pendingTasks = 0;
        let siteVisits = 0;

        if (tasksRes.data) {
          pendingTasks = tasksRes.data.filter(t => t.status !== 'Completed').length;
          
          const currentMonth = new Date().getMonth();
          const currentYear = new Date().getFullYear();
          
          siteVisits = tasksRes.data.filter(t => {
             if (t.category !== 'Site Visit') return false;
             const d = new Date(t.created_at);
             return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
          }).length;
        }

        setMetrics({ activeProjects, designCases, pendingTasks, siteVisits });
      } catch (e) {
        console.error("Error fetching metrics:", e);
      }
    };

    fetchMetrics();
  }, [empData]);

  return (
    <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-6">
       
       <Card extra="p-6 border border-[#E2E8F0]">
         <h3 className="text-[16px] font-bold text-[#0F172A] mb-5">Personal Information</h3>
         <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
               <div><label className="text-[11px] font-bold text-[#64748B] uppercase">DOB</label><p className="text-[14px] font-medium text-[#0F172A]">Select date</p></div>
               <div><label className="text-[11px] font-bold text-[#64748B] uppercase">Blood Group</label><p className="text-[14px] font-medium text-[#0F172A]">—</p></div>
            </div>
            <div><label className="text-[11px] font-bold text-[#64748B] uppercase">Residential Address</label><p className="text-[14px] font-medium text-[#0F172A]">Enter address</p></div>
            <div><label className="text-[11px] font-bold text-[#64748B] uppercase">Emergency Contact</label><p className="text-[14px] font-medium text-[#0F172A]">—</p></div>
         </div>
       </Card>

       <Card extra="p-6 border border-[#E2E8F0]">
         <h3 className="text-[16px] font-bold text-[#0F172A] mb-5">Professional Information</h3>
         <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
               <div><label className="text-[11px] font-bold text-[#64748B] uppercase">Joining Date</label><p className="text-[14px] font-medium text-[#0F172A]">Select date</p></div>
               <div><label className="text-[11px] font-bold text-[#64748B] uppercase">Work Location</label><p className="text-[14px] font-medium text-[#0F172A]">—</p></div>
            </div>
            <div><label className="text-[11px] font-bold text-[#64748B] uppercase">Department</label><p className="text-[14px] font-medium text-[#0F172A]">{empData.department}</p></div>
            <div><label className="text-[11px] font-bold text-[#64748B] uppercase">Employment Type</label><p className="text-[14px] font-medium text-[#0F172A]">—</p></div>
         </div>
       </Card>

       <div className="md:col-span-2">
          <h3 className="text-[16px] font-bold text-[#0F172A] mb-4">Live Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {[
                { label: "Active Projects", value: metrics.activeProjects, icon: <MdLocationCity className="text-[#2563EB]"/>, bg: "bg-blue-50" },
                { label: "Design Cases", value: metrics.designCases, icon: <MdOutlineArchitecture className="text-gray-500"/>, bg: "bg-gray-50" },
                { label: "Pending Tasks", value: metrics.pendingTasks, icon: <MdAssignment className="text-[#F59E0B]"/>, bg: "bg-yellow-50" },
                { label: "Site Visits (Month)", value: metrics.siteVisits, icon: <MdCheckCircle className="text-[#10B981]"/>, bg: "bg-green-50" },
             ].map((s, i) => (
                <div key={i} className={\p-4 rounded-xl border border-[#E2E8F0] \$\{s.bg\} flex flex-col justify-between\}>
                   <div className="flex justify-between items-start mb-2">
                      <span className="text-2xl">{s.icon}</span>
                      <span className="text-[24px] font-bold text-[#0F172A] leading-none">{s.value}</span>
                   </div>
                   <p className="text-[11px] font-bold text-[#64748B] uppercase">{s.label}</p>
                </div>
             ))}
          </div>
       </div>

    </div>
  );
};

export default TabOverview;
