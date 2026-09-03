import React from "react";
import Card from "components/card";

const TabOverview = ({ projData }) => {
  const milestones = [
    { name: "Planning", status: "completed" },
    { name: "Mobilization", status: "current" },
    { name: "Foundation", status: "pending" },
    { name: "Structure", status: "pending" },
    { name: "Brick & MEP", status: "pending" },
    { name: "Finishing", status: "pending" },
    { name: "Quality Check", status: "pending" },
    { name: "Handover", status: "pending" },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      
      {/* Milestone Tracker */}
      <Card extra="p-6 overflow-hidden">
         <h3 className="text-[16px] font-bold text-[#0F172A] mb-8">Project Milestones</h3>
         <div className="relative flex justify-between items-center w-full px-4">
            <div className="absolute left-8 right-8 top-1/2 transform -translate-y-1/2 h-1 bg-gray-200 -z-10"></div>
            {milestones.map((ms, idx) => (
               <div key={idx} className="flex flex-col items-center gap-3 relative bg-white px-2 cursor-pointer group">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-[3px] transition-all duration-300 ${
                     ms.status === 'completed' ? 'bg-[#10B981] border-[#10B981] text-white shadow-[0_0_10px_rgba(16,185,129,0.5)]' :
                     ms.status === 'current' ? 'bg-white border-[#2563EB] text-[#2563EB] shadow-[0_0_15px_rgba(37,99,235,0.3)] ring-4 ring-blue-50' :
                     'bg-white border-gray-300 text-gray-400 group-hover:border-gray-400'
                  }`}>
                     {ms.status === 'completed' ? '✓' : (idx + 1)}
                  </div>
                  <span className={`text-[11px] font-bold uppercase tracking-wider text-center w-20 leading-tight ${
                     ms.status === 'current' ? 'text-[#2563EB]' :
                     ms.status === 'completed' ? 'text-[#0F172A]' : 'text-[#64748B]'
                  }`}>{ms.name}</span>
               </div>
            ))}
         </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* Project Summary */}
         <Card extra="p-6">
           <h3 className="text-[16px] font-bold text-[#0F172A] mb-5">Project Summary</h3>
           <div className="space-y-5">
             <div><label className="text-[11px] font-bold text-[#64748B] uppercase">Client</label><p className="text-[15px] font-bold text-[#0F172A]">{projData.clientName}</p></div>
             <div><label className="text-[11px] font-bold text-[#64748B] uppercase">Site Address</label><p className="text-[14px] font-medium text-[#0F172A]">{projData.address}</p></div>
             <div className="grid grid-cols-2 gap-4">
                <div><label className="text-[11px] font-bold text-[#64748B] uppercase">Start Date</label><p className="text-[14px] font-medium text-[#0F172A]">{projData.startDate || '—'}</p></div>
                <div><label className="text-[11px] font-bold text-[#64748B] uppercase">Expected Completion</label><p className="text-[14px] font-medium text-[#0F172A]">{projData.completionDate || '—'}</p></div>
             </div>
           </div>
         </Card>

         {/* Weather & Site Conditions (Mock Widget) */}
         <Card extra="p-6 bg-gradient-to-br from-blue-50 to-white border border-blue-100">
           <h3 className="text-[16px] font-bold text-[#0F172A] mb-5">Live Site Conditions</h3>
           <div className="flex items-center gap-6 mb-6">
              <div className="text-5xl text-yellow-500">☀️</div>
              <div>
                 <p className="text-[32px] font-bold text-[#0F172A] leading-none">32°C</p>
                 <p className="text-[13px] font-medium text-[#64748B]">Clear Sunny Day</p>
              </div>
           </div>
           <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded-xl shadow-sm border border-[#E2E8F0]">
                 <p className="text-[11px] font-bold text-[#64748B] uppercase">Humidity</p>
                 <p className="text-[16px] font-bold text-[#0F172A]">45%</p>
              </div>
              <div className="bg-white p-3 rounded-xl shadow-sm border border-[#E2E8F0]">
                 <p className="text-[11px] font-bold text-[#64748B] uppercase">Wind Speed</p>
                 <p className="text-[16px] font-bold text-[#0F172A]">12 km/h</p>
              </div>
           </div>
         </Card>
      </div>
    </div>
  );
};

export default TabOverview;
