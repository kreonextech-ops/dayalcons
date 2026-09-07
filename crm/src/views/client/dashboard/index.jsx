import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import ClientSteps from "./ClientSteps";
import ClientChat from "components/chat/ClientChat";
import { MdCameraAlt } from "react-icons/md";
import { uploadFileToR2 } from "utils/r2Storage";
import R2Image from "components/R2Image";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function ClientDashboard() {
  const [activeProject, setActiveProject] = useState(null);
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clientProfile, setClientProfile] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
     const fetchData = async () => {
        setLoading(true);
        const userStr = localStorage.getItem("dayal_user");
        const loggedInUser = userStr ? JSON.parse(userStr) : null;
        
        if (loggedInUser && loggedInUser.department) {
            const clientId = loggedInUser.department;
            
            // Fetch Client Profile
            const { data: clientData } = await supabase.from('clients').select('*').eq('id', clientId).single();
            if (clientData) setClientProfile(clientData);

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

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !clientProfile) return;
    setUploadingPhoto(true);

    try {
      const fileKey = await uploadFileToR2(file, 'client_profiles');
      await supabase.from('clients').update({ profile_picture: fileKey }).eq('id', clientProfile.id);
      setClientProfile({ ...clientProfile, profile_picture: fileKey });
    } catch (err) {
      console.error(err);
      alert("Failed to upload photo to R2.");
    }
    setUploadingPhoto(false);
  };

  if (loading) {
     return <div className="flex justify-center items-center h-full pt-20"><div className="text-xl text-gray-500 font-bold">Loading your dashboard...</div></div>;
  }

  return (
    <div className="flex flex-col gap-5 mt-5">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Card */}
        <div className="bg-white p-6 rounded-[20px] shadow-sm border border-[#E2E8F0] flex flex-col items-center text-center">
          <div className="relative group mb-4">
            <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden shadow-md border-4 border-white">
              {clientProfile?.profile_picture ? (
                <R2Image fileKey={clientProfile.profile_picture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-3xl font-bold bg-gray-100">
                  {clientProfile?.name?.charAt(0) || "U"}
                </div>
              )}
            </div>
            <label className="absolute bottom-0 right-0 bg-brand-500 text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-brand-600 transition">
              <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} disabled={uploadingPhoto} />
              <MdCameraAlt size={16} />
            </label>
          </div>
          <h2 className="text-xl font-bold text-navy-700">{clientProfile?.name || "Client Name"}</h2>
          <p className="text-sm text-gray-500 mb-2">{clientProfile?.email || "No Email Provided"}</p>
          <p className="text-sm text-gray-500">{clientProfile?.phone || "No Phone Provided"}</p>
        </div>

        {/* Communication Hub */}
        <div className="lg:col-span-2">
          <h3 className="text-lg font-bold text-navy-700 mb-3">Communication & Files</h3>
          {clientProfile && (
            <ClientChat clientId={clientProfile.id} userType="client" />
          )}
        </div>
      </div>

      {allProjects.length === 0 ? (
        <div className="bg-white p-8 rounded-[20px] text-center shadow-sm border border-[#E2E8F0] mt-4">
           <h2 className="text-2xl font-bold text-navy-700 mb-2">Welcome to Dayal Construction!</h2>
           <p className="text-gray-500">You currently do not have any active projects or services linked to this account, but you can use the chat above to communicate with our team!</p>
        </div>
      ) : (
        <>
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
             <h1 className="text-3xl font-bold mb-2">{activeProject?.name}</h1>
             <p className="text-white/80 font-medium tracking-wide uppercase text-sm">
                {activeProject?._type === 'projects' ? 'Execution Project' : 'Design/Legal Service'} 
                {activeProject?.status ? ` • ${activeProject.status}` : ''}
             </p>
          </div>

          {/* Steps Viewer */}
          <div className="mt-2">
             <ClientSteps entityData={activeProject} tableType={activeProject?._type} />
          </div>
        </>
      )}
    </div>
  );
}
