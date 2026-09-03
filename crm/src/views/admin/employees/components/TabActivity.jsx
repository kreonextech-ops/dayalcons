import React, { useState, useEffect } from "react";
import Card from "components/card";
import { MdTimeline, MdPerson, MdWork } from "react-icons/md";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);

const TabActivity = ({ employee }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (employee?.name) {
      fetchActivities();
    }
  }, [employee]);

  const fetchActivities = async () => {
    setLoading(true);
    // Fetch any activity performed by this employee across the CRM
    const { data } = await supabase.from('lead_activities')
                                   .select('*')
                                   .ilike('employee_name', `%${employee.name}%`)
                                   .order('created_at', { ascending: false });
    
    if (data) setActivities(data);
    setLoading(false);
  };

  return (
    <div className="animate-fade-in relative">
      <div className="flex justify-between items-center mb-6">
         <div>
            <h3 className="text-[18px] font-bold text-[#0F172A]">Global Activity & Audit Trail</h3>
            <p className="text-[13px] text-[#64748B]">A chronological timeline of actions performed by {employee?.name}.</p>
         </div>
      </div>

      <div className="space-y-4">
         {loading ? (
           <p className="text-sm text-gray-500">Loading timeline...</p>
         ) : activities.length === 0 ? (
           <Card extra="p-10 text-center border border-[#E2E8F0] shadow-none">
              <MdTimeline className="mx-auto text-4xl text-gray-300 mb-2" />
              <p className="text-gray-500">No activity logged for this employee yet.</p>
           </Card>
         ) : (
           <div className="relative border-l-2 border-[#E2E8F0] ml-4 space-y-6 pb-6">
              {activities.map((act) => (
                 <div key={act.id} className="relative pl-6">
                    <div className="absolute left-[-9px] top-1 w-4 h-4 rounded-full bg-blue-500 ring-4 ring-white"></div>
                    <Card extra="p-4 border border-[#E2E8F0] shadow-sm hover:shadow-md transition">
                       <p className="text-[14px] text-[#0F172A]"><span className="font-bold">{act.employee_name}</span> {act.action}</p>
                       {act.metadata && act.metadata.notes && (
                          <p className="text-[13px] text-gray-600 mt-2 bg-gray-50 p-2 rounded border border-gray-100">"{act.metadata.notes}"</p>
                       )}
                       <p className="text-[11px] font-bold text-[#64748B] mt-2">{new Date(act.created_at).toLocaleString()}</p>
                    </Card>
                 </div>
              ))}
           </div>
         )}
      </div>
    </div>
  );
};

export default TabActivity;
