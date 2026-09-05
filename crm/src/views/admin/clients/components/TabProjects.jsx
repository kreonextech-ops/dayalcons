import React, { useState, useEffect } from "react";
import Card from "components/card";
import { createClient } from "@supabase/supabase-js";
import { MdBusinessCenter, MdArrowForward, MdDesignServices, MdLocationCity, MdClose } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);

const TabProjects = ({ clientData }) => {
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
       setLoading(true);
       if (clientData?.id) {
          const [servicesRes, projectsRes] = await Promise.all([
             supabase.from("services").select("*").eq("client_id", clientData.id).order("created_at", { ascending: false }),
             supabase.from("projects").select("*").eq("client_id", clientData.id).order("created_at", { ascending: false })
          ]);
          
          if (!servicesRes.error && servicesRes.data) setServices(servicesRes.data);
          if (!projectsRes.error && projectsRes.data) setProjects(projectsRes.data);
       }
       setLoading(false);
    };
    fetchData();
  }, [clientData?.id]);

  const handleCreateSelection = (type) => {
     setShowCreateModal(false);
     if (type === 'service') {
        navigate('/admin/services', { state: { createForClient: clientData } });
     } else {
        navigate('/admin/projects', { state: { createForClient: clientData } });
     }
  };

  if (loading) {
     return <div className="p-12 text-center text-[#64748B]">Loading projects...</div>;
  }

  return (
    <div className="animate-fade-in flex flex-col gap-6">
       
       <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-[#E2E8F0]">
          <div>
             <h3 className="text-[18px] font-bold text-[#0F172A]">Client Portfolio</h3>
             <p className="text-[13px] text-[#64748B]">Manage all services and execution projects for {clientData.name || "this client"}</p>
          </div>
          <button onClick={() => setShowCreateModal(true)} className="px-5 py-2.5 rounded-xl bg-[#2563EB] text-white font-bold text-sm shadow-md hover:bg-[#1D4ED8] transition">
             + Create New
          </button>
       </div>

       {/* Design & Legal Services */}
       <Card extra="p-6 border border-[#E2E8F0] shadow-sm">
          <div className="flex justify-between items-center mb-4">
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-blue-50 text-[#2563EB] flex items-center justify-center"><MdDesignServices size={18}/></div>
                <h3 className="text-[16px] font-bold text-[#0F172A]">Design & Legal Services</h3>
             </div>
             <button onClick={() => navigate('/admin/services')} className="text-[13px] font-bold text-[#2563EB] hover:underline">View Module</button>
          </div>
          
          {services.length === 0 ? (
             <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <p className="text-[13px] text-[#64748B]">No active design or legal services.</p>
             </div>
          ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map(srv => {
                   let amount = 0;
                   let reqs = 0;
                   try {
                      const meta = JSON.parse(srv.description || "{}");
                      amount = meta.financials?.total || 0;
                      reqs = (meta.requirements || []).length;
                   } catch(e) {}
                   
                   return (
                      <div key={srv.id} className="border border-[#E2E8F0] rounded-xl p-4 hover:border-[#2563EB] hover:shadow-md transition bg-white flex flex-col cursor-pointer" onClick={() => navigate('/admin/services')}>
                         <div className="flex justify-between items-start mb-2">
                            <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">SRV-{srv.id.substring(0,5)}</span>
                            <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-[10px] font-bold">{srv.status}</span>
                         </div>
                         <h4 className="text-[14px] font-bold text-[#0F172A] mb-2 leading-tight">{srv.title}</h4>
                         <div className="text-[12px] text-[#64748B] mt-auto space-y-1">
                            <div className="flex justify-between"><span>Value:</span><span className="font-bold text-[#0F172A]">₹ {parseFloat(amount).toLocaleString()}</span></div>
                            <div className="flex justify-between"><span>Requirements:</span><span className="font-bold text-[#0F172A]">{reqs}</span></div>
                         </div>
                      </div>
                   );
                })}
             </div>
          )}
       </Card>

       {/* Execution Projects */}
       <Card extra="p-6 border border-[#E2E8F0] shadow-sm">
          <div className="flex justify-between items-center mb-4">
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center"><MdLocationCity size={18}/></div>
                <h3 className="text-[16px] font-bold text-[#0F172A]">Execution Projects</h3>
             </div>
             <button onClick={() => navigate('/admin/projects')} className="text-[13px] font-bold text-emerald-600 hover:underline">View Module</button>
          </div>
          
          {projects.length === 0 ? (
             <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <p className="text-[13px] text-[#64748B]">No active execution projects.</p>
             </div>
          ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map(proj => {
                   return (
                      <div key={proj.id} className="border border-[#E2E8F0] rounded-xl p-4 hover:border-emerald-500 hover:shadow-md transition bg-white flex flex-col cursor-pointer" onClick={() => navigate('/admin/projects')}>
                         <div className="flex justify-between items-start mb-2">
                            <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">PRJ-{proj.id.substring(0,5)}</span>
                            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold">{proj.status}</span>
                         </div>
                         <h4 className="text-[14px] font-bold text-[#0F172A] mb-2 leading-tight">{proj.title || proj.name}</h4>
                         <div className="text-[12px] text-[#64748B] mt-auto">
                            <div className="flex justify-between"><span>Location:</span><span className="font-bold text-[#0F172A] truncate max-w-[120px]">{proj.location || 'N/A'}</span></div>
                         </div>
                      </div>
                   );
                })}
             </div>
          )}
       </Card>

       {/* Selection Modal */}
       {showCreateModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
             <div className="w-full max-w-[500px] bg-white rounded-[20px] shadow-2xl overflow-hidden animate-slide-up">
                <div className="flex justify-between items-center p-6 border-b border-[#E2E8F0]">
                   <h3 className="text-[18px] font-bold text-[#0F172A]">Create New for {clientData.name}</h3>
                   <MdClose className="text-2xl cursor-pointer text-gray-500 hover:text-black transition" onClick={() => setShowCreateModal(false)} />
                </div>
                
                <div className="p-6 space-y-4 bg-gray-50">
                   <p className="text-[14px] text-[#475569] mb-2">What would you like to create for this client?</p>
                   
                   <div 
                      onClick={() => handleCreateSelection('service')}
                      className="p-4 bg-white border border-[#E2E8F0] rounded-[12px] cursor-pointer hover:border-[#2563EB] hover:shadow-md transition flex items-center gap-4 group"
                   >
                      <div className="w-12 h-12 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center group-hover:bg-[#2563EB] group-hover:text-white transition">
                         <MdDesignServices size={24}/>
                      </div>
                      <div className="flex-1">
                         <h4 className="text-[16px] font-bold text-[#0F172A]">Design & Legal Service</h4>
                         <p className="text-[12px] text-[#64748B]">Architectural design, interior planning, legal approvals, consultancy.</p>
                      </div>
                      <MdArrowForward className="text-gray-300 group-hover:text-[#2563EB]" size={20}/>
                   </div>

                   <div 
                      onClick={() => handleCreateSelection('project')}
                      className="p-4 bg-white border border-[#E2E8F0] rounded-[12px] cursor-pointer hover:border-emerald-500 hover:shadow-md transition flex items-center gap-4 group"
                   >
                      <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition">
                         <MdLocationCity size={24}/>
                      </div>
                      <div className="flex-1">
                         <h4 className="text-[16px] font-bold text-[#0F172A]">Execution Project</h4>
                         <p className="text-[12px] text-[#64748B]">On-site construction, turnkey projects, physical execution works.</p>
                      </div>
                      <MdArrowForward className="text-gray-300 group-hover:text-emerald-500" size={20}/>
                   </div>
                </div>
             </div>
          </div>
       )}
    </div>
  );
};

export default TabProjects;
