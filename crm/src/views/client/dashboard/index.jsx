import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import ClientMilestoneManager from "components/milestones/ClientMilestoneManager";
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
        const userStr = sessionStorage.getItem("dayal_user");
        const loggedInUser = userStr ? JSON.parse(userStr) : null;
        
        if (loggedInUser && loggedInUser.department) {
            const clientId = loggedInUser.department;
            
            // Fetch Client Profile
            const { data: clientData } = await supabase.from('clients').select('*').eq('id', clientId).single();
            if (clientData) setClientProfile(clientData);

            // Fetch construction projects
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
               servicesData.forEach(s => combined.push({ ...s, name: s.title || s.name || 'Design/Legal Service', _type: 'services' }));
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
    <div className="flex flex-col gap-6 mt-4">
      {/* Top 2-Column: Profile + Communication */}
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
          <p className="text-sm font-semibold text-brand-500 mb-1">Client Portal Access</p>
          <p className="text-xs text-gray-500">{clientProfile?.phone || "No Phone Provided"}</p>
          {clientProfile?.email && <p className="text-xs text-gray-400 mt-0.5">{clientProfile.email}</p>}
        </div>

        {/* Communication Hub */}
        <div className="lg:col-span-2">
          <h3 className="text-lg font-bold text-navy-700 mb-3">Communication & Direct Messages</h3>
          {clientProfile && (
            <ClientChat clientId={clientProfile.id} userType="client" />
          )}
        </div>
      </div>

      {/* Linked Project/Service Banner */}
      {activeProject && (
        <div className="bg-gradient-to-r from-brand-500 to-brand-300 p-6 rounded-[20px] text-white shadow-md flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-white/80">
              {activeProject?._type === 'projects' ? 'Execution Project' : 'Design & Legal Service'}
            </span>
            <h2 className="text-2xl font-bold">{activeProject?.name}</h2>
            <p className="text-white/90 text-xs font-semibold mt-0.5">
              Status: {activeProject?.status || 'In Progress'}
            </p>
          </div>

          {allProjects.length > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white/90">Switch:</span>
              <select 
                className="bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-xl px-3 py-1.5 text-xs font-semibold outline-none cursor-pointer"
                value={activeProject?.id || ""}
                onChange={(e) => setActiveProject(allProjects.find(p => String(p.id) === String(e.target.value)))}
              >
                {allProjects.map(p => (
                  <option key={p.id} value={p.id} className="text-navy-700">
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Dedicated Client Milestones */}
      <div className="w-full">
        <ClientMilestoneManager 
          clientId={clientProfile?.id} 
          clientName={clientProfile?.name} 
          isAdmin={false} 
        />
      </div>
    </div>
  );
}
