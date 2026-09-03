import React, { useState } from "react";
import Card from "components/card";
import { 
  MdArchitecture, MdBusiness, MdCheck, MdSave, MdEdit,
  MdCheckCircle, MdLayers, MdPhotoSizeSelectSmall, MdFormatPaint,
  MdElectricBolt, MdHouse, MdCorporateFare, MdFactory, MdOutlineFoundation,
  MdDomainVerification, MdWaterDrop
} from "react-icons/md";
import { FiFileText, FiMap } from "react-icons/fi";

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

const CONSTRUCTION_SERVICES = [
  { id: "Residential Construction", icon: <MdHouse /> },
  { id: "Commercial Construction", icon: <MdCorporateFare /> },
  { id: "Industrial Construction", icon: <MdFactory /> },
  { id: "Painting & Epoxy Flooring", icon: <MdFormatPaint /> },
  { id: "Renovation & Remodeling", icon: <MdArchitecture /> },
  { id: "Turnkey Projects", icon: <MdBusiness /> },
  { id: "Electrical & Plumbing", icon: <MdElectricBolt /> }
];

const TabServiceRequirement = ({ leadData, setLeadData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Design & Planning");

  const toggleService = (serviceId) => {
    const current = leadData.selectedServices || [];
    if (current.includes(serviceId)) {
      setLeadData({ ...leadData, selectedServices: current.filter(id => id !== serviceId) });
    } else {
      setLeadData({ ...leadData, selectedServices: [...current, serviceId] });
    }
  };

  const isSelected = (serviceId) => (leadData.selectedServices || []).includes(serviceId);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-[20px] border border-[#E2E8F0] shadow-sm">
        <div>
          <h2 className="text-[24px] font-bold text-[#0F172A]">Service Requirement</h2>
          <p className="text-[14px] text-[#64748B] mt-1 max-w-[600px]">
            Select one or multiple services. Dayal CRM will automatically generate the required forms, inspections, BOQ structure, documents, and workflow.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3">
          {isEditing ? (
             <button onClick={() => setIsEditing(false)} className="h-10 px-6 rounded-[12px] bg-[#16A34A] text-white text-[14px] font-bold flex items-center gap-2 hover:bg-[#15803D] transition shadow-md">
               <MdSave /> Save
             </button>
          ) : (
             <button onClick={() => setIsEditing(true)} className="h-10 px-6 rounded-[12px] border border-[#E2E8F0] bg-white text-[#0F172A] text-[14px] font-bold flex items-center gap-2 hover:bg-gray-50 transition">
               <MdEdit /> Edit Form
             </button>
          )}
        </div>
      </div>

      {/* Section A: Category Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          onClick={() => setActiveCategory("Design & Planning")}
          className={`p-6 rounded-[20px] border-2 cursor-pointer transition-all duration-300 ${activeCategory === "Design & Planning" ? 'border-[#2563EB] bg-blue-50/50 shadow-[0_8px_24px_rgba(37,99,235,0.12)]' : 'border-[#E2E8F0] bg-white hover:border-blue-200 hover:shadow-sm'}`}
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-4 ${activeCategory === "Design & Planning" ? 'bg-[#2563EB] text-white' : 'bg-gray-100 text-[#64748B]'}`}>
            <MdArchitecture />
          </div>
          <h3 className="text-[18px] font-bold text-[#0F172A]">Design & Planning</h3>
          <p className="text-[13px] text-[#64748B] mt-1">Planning, approvals, architecture, engineering & consultancy.</p>
        </div>

        <div 
          onClick={() => setActiveCategory("Construction Services")}
          className={`p-6 rounded-[20px] border-2 cursor-pointer transition-all duration-300 ${activeCategory === "Construction Services" ? 'border-[#2563EB] bg-blue-50/50 shadow-[0_8px_24px_rgba(37,99,235,0.12)]' : 'border-[#E2E8F0] bg-white hover:border-blue-200 hover:shadow-sm'}`}
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-4 ${activeCategory === "Construction Services" ? 'bg-[#2563EB] text-white' : 'bg-gray-100 text-[#64748B]'}`}>
            <MdBusiness />
          </div>
          <h3 className="text-[18px] font-bold text-[#0F172A]">Construction Services</h3>
          <p className="text-[13px] text-[#64748B] mt-1">Execution, renovation, interiors, MEP & turnkey construction.</p>
        </div>
      </div>

      {/* Section B: Multi-Service Selector */}
      <Card extra="p-6">
        <h3 className="text-[16px] font-bold text-[#0F172A] mb-4">Select {activeCategory}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(activeCategory === "Design & Planning" ? DESIGN_SERVICES : CONSTRUCTION_SERVICES).map((service) => {
             const selected = isSelected(service.id);
             return (
               <div 
                 key={service.id}
                 onClick={() => toggleService(service.id)}
                 className={`flex items-center gap-4 p-4 rounded-[16px] border-[2px] cursor-pointer transition-all duration-200 hover:-translate-y-1 ${
                   selected 
                   ? 'border-[#2563EB] bg-[#EFF6FF] shadow-sm' 
                   : 'border-[#E2E8F0] bg-white hover:border-[#CBD5E1]'
                 }`}
               >
                 <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[20px] transition-colors ${selected ? 'bg-[#2563EB] text-white' : 'bg-gray-100 text-[#64748B]'}`}>
                   {selected ? <MdCheck /> : service.icon}
                 </div>
                 <div>
                   <p className={`text-[14px] font-bold ${selected ? 'text-[#0F172A]' : 'text-[#475569]'}`}>{service.id}</p>
                   <p className="text-[11px] font-medium text-[#64748B] uppercase tracking-wider">{activeCategory.split(' ')[0]}</p>
                 </div>
               </div>
             )
          })}
        </div>
        
        {/* Quick summary of all selected */}
        {(leadData.selectedServices || []).length > 0 && (
          <div className="mt-8 pt-6 border-t border-[#E2E8F0]">
            <h4 className="text-[13px] font-bold text-[#64748B] uppercase mb-3">Selected Services</h4>
            <div className="flex flex-wrap gap-2">
               {(leadData.selectedServices || []).map(s => (
                 <span key={s} className="px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-[13px] font-semibold flex items-center gap-1">
                   <MdCheckCircle /> {s}
                 </span>
               ))}
            </div>
          </div>
        )}
      </Card>

      {/* Section C: Client Requirement Summary */}
      <Card extra="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[18px] font-bold text-[#0F172A]">Client Requirement Summary</h3>
          {isEditing && <span className="text-[12px] font-bold text-[#2563EB] bg-blue-50 px-3 py-1 rounded-full">Editing Mode</span>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isEditing ? (
             <>
               <div className="flex flex-col"><label className="text-[12px] font-medium text-[#64748B] mb-1">Project Priority</label><input type="text" placeholder="e.g. High" className="h-10 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none focus:border-[#2563EB]" value={leadData.priority || ''} onChange={e => setLeadData({...leadData, priority: e.target.value})} /></div>
               <div className="flex flex-col"><label className="text-[12px] font-medium text-[#64748B] mb-1">Expected Start</label><input type="text" placeholder="e.g. Within 1 month" className="h-10 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none focus:border-[#2563EB]" value={leadData.expectedStart || ''} onChange={e => setLeadData({...leadData, expectedStart: e.target.value})} /></div>
               <div className="flex flex-col"><label className="text-[12px] font-medium text-[#64748B] mb-1">Budget</label><input type="text" placeholder="e.g. ₹50 Lakhs" className="h-10 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none focus:border-[#2563EB]" value={leadData.budget || ''} onChange={e => setLeadData({...leadData, budget: e.target.value})} /></div>
               <div className="flex flex-col"><label className="text-[12px] font-medium text-[#64748B] mb-1">Timeline</label><input type="text" placeholder="e.g. 6 Months" className="h-10 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none focus:border-[#2563EB]" value={leadData.timeline || ''} onChange={e => setLeadData({...leadData, timeline: e.target.value})} /></div>
               <div className="flex flex-col"><label className="text-[12px] font-medium text-[#64748B] mb-1">Preferred Communication</label><input type="text" placeholder="e.g. WhatsApp" className="h-10 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none focus:border-[#2563EB]" value={leadData.preferredComm || ''} onChange={e => setLeadData({...leadData, preferredComm: e.target.value})} /></div>
               <div className="flex flex-col"><label className="text-[12px] font-medium text-[#64748B] mb-1">Decision Maker</label><input type="text" placeholder="e.g. Self" className="h-10 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none focus:border-[#2563EB]" value={leadData.decisionMaker || ''} onChange={e => setLeadData({...leadData, decisionMaker: e.target.value})} /></div>
             </>
          ) : (
             <>
               <div className="flex flex-col"><span className="text-[12px] font-medium text-[#64748B]">Project Priority</span><span className="text-[15px] font-bold text-[#0F172A]">{leadData.priority || '—'}</span></div>
               <div className="flex flex-col"><span className="text-[12px] font-medium text-[#64748B]">Expected Start</span><span className="text-[15px] font-bold text-[#0F172A]">{leadData.expectedStart || '—'}</span></div>
               <div className="flex flex-col"><span className="text-[12px] font-medium text-[#64748B]">Budget</span><span className="text-[15px] font-bold text-[#0F172A]">{leadData.budget || '—'}</span></div>
               <div className="flex flex-col"><span className="text-[12px] font-medium text-[#64748B]">Timeline</span><span className="text-[15px] font-bold text-[#0F172A]">{leadData.timeline || '—'}</span></div>
               <div className="flex flex-col"><span className="text-[12px] font-medium text-[#64748B]">Preferred Communication</span><span className="text-[15px] font-bold text-[#0F172A]">{leadData.preferredComm || '—'}</span></div>
               <div className="flex flex-col"><span className="text-[12px] font-medium text-[#64748B]">Decision Maker</span><span className="text-[15px] font-bold text-[#0F172A]">{leadData.decisionMaker || '—'}</span></div>
             </>
          )}
        </div>
        
        <div className="mt-6">
          <label className="text-[12px] font-medium text-[#64748B] mb-2 block">General Notes</label>
          {isEditing ? (
             <textarea 
               placeholder="Enter detailed client requirements..." 
               className="w-full rounded-[10px] border border-[#E2E8F0] p-4 text-[14px] outline-none focus:border-[#2563EB]"
               rows="4"
               value={leadData.serviceNotes || ''}
               onChange={e => setLeadData({...leadData, serviceNotes: e.target.value})}
             ></textarea>
          ) : (
             <div className="w-full rounded-[10px] bg-[#F8FAFC] p-4 text-[14px] text-[#475569] min-h-[100px] border border-[#E2E8F0]">
               {leadData.serviceNotes || 'No notes provided.'}
             </div>
          )}
        </div>
      </Card>

    </div>
  );
};

export default TabServiceRequirement;
