import React, { useState, useEffect } from "react";
import Card from "components/card";
import { createClient } from "@supabase/supabase-js";
import { MdCheckCircle, MdSave } from "react-icons/md";
import { FiFileText, FiMap } from "react-icons/fi";
import { 
  MdDomainVerification, MdLayers, MdHouse, MdOutlineFoundation,
  MdPhotoSizeSelectSmall, MdWaterDrop
} from "react-icons/md";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);

const DESIGN_SERVICES = [
  { id: "Land Registration & Mutation", icon: <FiFileText /> },
  { id: "Building Plan Approval", icon: <MdDomainVerification /> },
  { id: "2D Floor Plan Design", icon: <MdLayers /> },
  { id: "3D Floor Plan Design", icon: <MdLayers /> },
  { id: "3D Elevation Design", icon: <MdHouse /> },
  { id: "Soil Testing", icon: <MdWaterDrop /> },
  { id: "Structural Design", icon: <MdOutlineFoundation /> },
  { id: "Vastu Consultation", icon: <FiMap /> },
  { id: "Interior Design", icon: <MdPhotoSizeSelectSmall /> }
];

const TabRequirements = ({ serviceCase, onUpdate }) => {
  const [selectedServices, setSelectedServices] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
     try {
       const metadata = JSON.parse(serviceCase.description || "{}");
       if (metadata.requirements && Array.isArray(metadata.requirements)) {
          setSelectedServices(metadata.requirements);
       }
     } catch (e) {}
  }, [serviceCase]);

  const toggleService = (id) => {
      setSelectedServices(prev => {
          if (prev.includes(id)) return prev.filter(x => x !== id);
          return [...prev, id];
      });
  };

  const handleSave = async () => {
     setIsSaving(true);
     try {
       const metadata = JSON.parse(serviceCase.description || "{}");
       metadata.requirements = selectedServices;
       
       await supabase.from("services").update({
          description: JSON.stringify(metadata),
          title: selectedServices.length > 0 ? selectedServices[0] + (selectedServices.length > 1 ? ' & Others' : '') : "Unnamed Service"
       }).eq("id", serviceCase.id);
       
       if (onUpdate) onUpdate({ ...serviceCase, description: JSON.stringify(metadata) });
       alert("Requirements saved successfully!");
     } catch (e) {
       alert("Failed to save: " + e.message);
     }
     setIsSaving(false);
  };

  return (
    <div className="animate-fade-in">
       <Card extra="p-6">
          <div className="flex justify-between items-center mb-6">
             <div>
                <h3 className="text-[18px] font-bold text-[#0F172A]">Service Requirements</h3>
                <p className="text-[13px] text-[#64748B] mt-1">Select the specific services required for this project.</p>
             </div>
             <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563EB] text-white font-bold text-sm hover:bg-[#1D4ED8] transition shadow-md">
                <MdSave size={18} /> {isSaving ? "Saving..." : "Save Changes"}
             </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DESIGN_SERVICES.map(srv => {
               const checked = selectedServices.includes(srv.id);
               return (
                 <div 
                   key={srv.id} 
                   onClick={() => toggleService(srv.id)}
                   className={`cursor-pointer flex flex-col p-5 rounded-2xl border-2 transition shadow-sm ${checked ? 'border-[#2563EB] bg-blue-50/50' : 'border-[#E2E8F0] hover:border-gray-300'}`}
                 >
                   <div className="flex justify-between items-start mb-3">
                     <div className={`p-3 rounded-xl shadow-sm ${checked ? 'bg-[#2563EB] text-white' : 'bg-white text-[#64748B] border border-[#E2E8F0]'}`}>{srv.icon}</div>
                     {checked && <MdCheckCircle className="text-[#2563EB] text-2xl" />}
                   </div>
                   <h4 className={`text-[15px] font-bold mt-2 ${checked ? 'text-[#0F172A]' : 'text-[#475569]'}`}>{srv.id}</h4>
                 </div>
               );
            })}
          </div>
       </Card>
    </div>
  );
};

export default TabRequirements;
