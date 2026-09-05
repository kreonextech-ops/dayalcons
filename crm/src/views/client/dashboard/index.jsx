import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import ClientSteps from "./ClientSteps";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function ClientDashboard() {
  const [activeProject, setActiveProject] = useState(null);
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     const fetchData = async () => {
        setLoading(true);
        const userStr = localStorage.getItem("dayal_user");
        const loggedInUser = userStr ? JSON.parse(userStr) : null;
        
        if (loggedInUser && loggedInUser.department) {
            const clientId = loggedInUser.department;
            
            // Fetch execution projects
            const { data: projectsData } = await supabase
               .from("projects")
               .select("*")
               .eq("client_id", clientId);
               
            // Fetch services
            const { data: servicesData } = await supabase
               .from("services")
               .select("*")
               .eq("client_id", clientId);
               
            const combined = [];
            if (projectsData) {
               projectsData.forEach(p => combined.push({ ...p, _type: 'projects' }));
            }
            if (servicesData) {
               servicesData.forEach(s => combined.push({ ...s, _type: 'services' }));
            }
            
            setAllProjects(combined);
            if (combined.length > 0) {
               setActiveProject(combined[0]);
            }
        }
        setLoading(false);
     };
     fetchData();
  }, []);

  if (loading) {
     return <div className="flex justify-center items-center h-full pt-20"><div className="text-xl text-gray-500 font-bold">Loading your dashboard...</div></div>;
  }

  if (allProjects.length === 0) {
     return (
        <div className="flex flex-col justify-center items-center h-full pt-20 text-center">
           <h2 className="text-2xl font-bold text-navy-700 mb-2">Welcome to Dayal Construction!</h2>
           <p className="text-gray-500">You currently do not have any active projects or services linked to this account.</p>
        </div>
     );
  }

  return (
    <div className="flex flex-col gap-5 mt-5">
      {/* Project Selector (if multiple) */}
      {allProjects.length > 1 && (
         <div className="bg-white p-4 rounded-[20px] shadow-sm border border-[#E2E8F0] flex items-center gap-4">
            <span className="font-bold text-gray-600">Select Project:</span>
            <select 
               className="flex-1 max-w-md bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 outline-none font-semibold text-navy-700 focus:border-brand-500"
               value={activeProject?.id || ""}
               onChange={(e) => setActiveProject(allProjects.find(p => p.id === parseInt(e.target.value)))}
            >
               {allProjects.map(p => (
                  <option key={p.id} value={p.id}>
                     {p.name} ({p._type === 'projects' ? 'Execution Project' : 'Design/Legal Service'})
                  </option>
               ))}
            </select>
         </div>
      )}

      {/* Main Project Header */}
      <div className="bg-gradient-to-r from-brand-500 to-brand-300 p-8 rounded-[20px] text-white shadow-md">
         <h1 className="text-3xl font-bold mb-2">{activeProject.name}</h1>
         <p className="text-white/80 font-medium tracking-wide uppercase text-sm">
            {activeProject._type === 'projects' ? 'Execution Project' : 'Design/Legal Service'} 
            {activeProject.status ? ` • ${activeProject.status}` : ''}
         </p>
      </div>

      {/* Steps Viewer */}
      <div className="mt-2">
         <ClientSteps entityData={activeProject} tableType={activeProject._type} />
      </div>
    </div>
  );
}
