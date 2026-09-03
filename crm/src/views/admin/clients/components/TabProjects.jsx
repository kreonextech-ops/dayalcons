import React, { useState, useEffect } from "react";
import Card from "components/card";
import { createClient } from "@supabase/supabase-js";
import { MdBusinessCenter, MdArrowForward, MdDesignServices } from "react-icons/md";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);

const TabProjects = ({ clientData }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
       setLoading(true);
       if (clientData?.id) {
          const { data, error } = await supabase
             .from("services")
             .select("*")
             .eq("client_id", clientData.id)
             .order("created_at", { ascending: false });
          
          if (!error && data) {
             setProjects(data);
          }
       }
       setLoading(false);
    };
    fetchProjects();
  }, [clientData?.id]);

  if (loading) {
     return <div className="p-12 text-center text-[#64748B]">Loading projects...</div>;
  }

  if (projects.length === 0) {
     return (
        <Card extra="p-12 text-center border border-[#E2E8F0] shadow-sm">
           <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-[#2563EB] text-3xl mx-auto mb-4">
              <MdDesignServices />
           </div>
           <h3 className="text-[18px] font-bold text-[#0F172A] mb-2">No active projects</h3>
           <p className="text-[14px] text-[#64748B] mb-6">This client does not have any design or legal service cases yet.</p>
           <button onClick={() => window.location.href = '/admin/services'} className="px-6 py-2 rounded-xl bg-[#2563EB] text-white font-bold text-sm shadow-md hover:bg-[#1D4ED8] transition">
              Create New Service Case
           </button>
        </Card>
     );
  }

  return (
    <div className="animate-fade-in flex flex-col gap-4">
       <Card extra="p-6 border border-[#E2E8F0] shadow-sm mb-2">
          <div className="flex justify-between items-center mb-2">
             <h3 className="text-[18px] font-bold text-[#0F172A]">Service Projects</h3>
             <button onClick={() => window.location.href = '/admin/services'} className="text-sm font-bold text-[#2563EB] hover:underline">View All in Services</button>
          </div>
          <p className="text-[13px] text-[#64748B] mb-6">List of active projects for {clientData.name || "this client"}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {projects.map(proj => {
                let amount = 0;
                let reqs = 0;
                try {
                   const meta = JSON.parse(proj.description || "{}");
                   amount = meta.financials?.total || 0;
                   reqs = (meta.requirements || []).length;
                } catch(e) {}
                
                return (
                   <div key={proj.id} className="border border-[#E2E8F0] rounded-2xl p-5 hover:border-[#2563EB] hover:shadow-md transition bg-white flex flex-col cursor-pointer" onClick={() => window.location.href = '/admin/services'}>
                      <div className="flex justify-between items-start mb-3">
                         <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider">SRV-{proj.id.substring(0,5)}</span>
                         <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-[10px] font-bold">{proj.status}</span>
                      </div>
                      <h4 className="text-[15px] font-bold text-[#0F172A] mb-1 leading-tight">{proj.title}</h4>
                      <div className="text-[12px] text-[#64748B] mt-2 mb-4 space-y-1">
                         <div className="flex justify-between"><span>Value:</span><span className="font-bold text-[#0F172A]">₹ {parseFloat(amount).toLocaleString()}</span></div>
                         <div className="flex justify-between"><span>Requirements:</span><span className="font-bold text-[#0F172A]">{reqs} Selected</span></div>
                      </div>
                      <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center text-[#2563EB] text-sm font-bold">
                         <span>Go to Project Details</span>
                         <MdArrowForward size={16} />
                      </div>
                   </div>
                );
             })}
          </div>
       </Card>
    </div>
  );
};

export default TabProjects;
