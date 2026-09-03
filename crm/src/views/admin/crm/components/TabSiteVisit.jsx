import React, { useState } from "react";
import Card from "components/card";
import { 
  MdMap, MdCheckCircle, MdCloudUpload, MdImage,
  MdLocationOn, MdAccessTime, MdPerson, MdCalendarToday, MdWbSunny
} from "react-icons/md";

const TabSiteVisit = ({ leadData }) => {
  const [checklist, setChecklist] = useState({
    measured: false,
    client: false,
    soil: false,
    photos: false,
    neighbor: false,
    utility: false,
    structure: false,
    signature: false
  });

  const toggleCheck = (key) => setChecklist(prev => ({ ...prev, [key]: !prev[key] }));

  const measurements = [
    { item: "Length", value: "", unit: "ft" },
    { item: "Width", value: "", unit: "ft" },
    { item: "Area", value: "", unit: "sq.ft" },
    { item: "Front Setback", value: "", unit: "ft" },
    { item: "Rear Setback", value: "", unit: "ft" },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* 1. Status Card */}
      <Card extra="p-6 bg-gradient-to-r from-[#EFF6FF] to-white border border-[#E2E8F0]">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-[20px] font-semibold text-[#0F172A]">Site Visit</h2>
          <span className="bg-[#2563EB] text-white px-3 py-1 rounded-full text-xs font-bold tracking-wide">PENDING</span>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full text-sm">
            <div className="flex flex-col"><span className="text-[#64748B] flex items-center gap-1"><MdPerson /> Engineer</span><span className="font-semibold text-[#0F172A]">Unassigned</span></div>
            <div className="flex flex-col"><span className="text-[#64748B] flex items-center gap-1"><MdCalendarToday /> Date</span><span className="font-semibold text-[#0F172A]">TBD</span></div>
            <div className="flex flex-col"><span className="text-[#64748B] flex items-center gap-1"><MdAccessTime /> Time</span><span className="font-semibold text-[#0F172A]">TBD</span></div>
            <div className="flex flex-col"><span className="text-[#64748B] flex items-center gap-1"><MdWbSunny /> Weather</span><span className="font-semibold text-[#0F172A]">N/A</span></div>
            <div className="flex flex-col col-span-2"><span className="text-[#64748B] flex items-center gap-1"><MdLocationOn /> GPS / Address</span><span className="font-semibold text-[#0F172A]">{leadData?.address || "Not Recorded"}</span></div>
          </div>
          <div className="flex-shrink-0 flex items-center justify-center h-24 w-24 rounded-full border-[6px] border-[#E2E8F0] text-[#64748B]">
            <span className="text-xl font-bold">0%</span>
          </div>
        </div>
      </Card>

      {/* 2. Site Information Card (Connected to Overview) */}
      <Card extra="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[16px] font-semibold text-[#0F172A]">Site Information (Synced from Overview)</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="space-y-4">
            <div className="flex justify-between border-b border-[#EDF2F7] pb-2"><span className="text-[#64748B]">Plot Size</span><span className="font-semibold text-[#0F172A]">{leadData?.plotSize || "N/A"}</span></div>
            <div className="flex justify-between border-b border-[#EDF2F7] pb-2"><span className="text-[#64748B]">Front Road Width</span><span className="font-semibold text-[#0F172A]">{leadData?.frontRoadWidth || "N/A"}</span></div>
            <div className="flex justify-between border-b border-[#EDF2F7] pb-2"><span className="text-[#64748B]">Orientation</span><span className="font-semibold text-[#0F172A]">{leadData?.orientation || "N/A"}</span></div>
            <div className="flex justify-between border-b border-[#EDF2F7] pb-2"><span className="text-[#64748B]">Planned Floors</span><span className="font-semibold text-[#0F172A]">{leadData?.plannedFloors || "N/A"}</span></div>
            <div className="flex justify-between border-b border-[#EDF2F7] pb-2"><span className="text-[#64748B]">Soil Type</span><span className="font-semibold text-[#0F172A]">{leadData?.soilType || "N/A"}</span></div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between border-b border-[#EDF2F7] pb-2"><span className="text-[#64748B]">Water Source</span><span className="font-semibold text-[#0F172A]">{leadData?.waterSource || "N/A"}</span></div>
            <div className="flex justify-between border-b border-[#EDF2F7] pb-2"><span className="text-[#64748B]">Electricity</span><span className="font-semibold text-[#0F172A]">{leadData?.electricity || "N/A"}</span></div>
            <div className="flex justify-between border-b border-[#EDF2F7] pb-2"><span className="text-[#64748B]">Municipal Approval</span><span className="font-semibold text-[#0F172A]">{leadData?.municipalApproval || "N/A"}</span></div>
            <div className="flex justify-between border-b border-[#EDF2F7] pb-2"><span className="text-[#64748B]">Vastu Required</span><span className="font-semibold text-[#0F172A]">{leadData?.vastu || "N/A"}</span></div>
            <div className="flex justify-between border-b border-[#EDF2F7] pb-2"><span className="text-[#64748B]">Boundary Wall</span><span className="font-semibold text-[#0F172A]">{leadData?.boundaryWall || "N/A"}</span></div>
          </div>
        </div>
      </Card>

      {/* 3. Inspection Checklist */}
      <Card extra="p-6">
        <h3 className="text-[16px] font-semibold text-[#0F172A] mb-4">Inspection Checklist</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: "measured", label: "Plot measured" },
            { key: "client", label: "Client present" },
            { key: "soil", label: "Soil sample collected" },
            { key: "photos", label: "Site photos uploaded" },
            { key: "neighbor", label: "Neighbor access verified" },
            { key: "utility", label: "Utility lines checked" },
            { key: "structure", label: "Existing structure inspected" },
            { key: "signature", label: "Engineer signature completed" }
          ].map(item => (
            <label key={item.key} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleCheck(item.key)}>
              <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors border-2 ${checklist[item.key] ? 'bg-[#2563EB] border-[#2563EB]' : 'border-[#E2E8F0] group-hover:border-[#2563EB]'}`}>
                {checklist[item.key] && <MdCheckCircle className="text-white w-4 h-4" />}
              </div>
              <span className={`text-sm ${checklist[item.key] ? 'text-[#0F172A] font-medium' : 'text-[#475569]'}`}>{item.label}</span>
            </label>
          ))}
        </div>
      </Card>

      {/* 4. Measurements */}
      <Card extra="p-6">
        <h3 className="text-[16px] font-semibold text-[#0F172A] mb-4">Site Measurements</h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E2E8F0] text-sm text-[#64748B]">
              <th className="pb-2 font-medium">Item</th>
              <th className="pb-2 font-medium">Value</th>
              <th className="pb-2 font-medium">Unit</th>
            </tr>
          </thead>
          <tbody>
            {measurements.map((m, i) => (
              <tr key={i} className="border-b border-[#EDF2F7]">
                <td className="py-3 text-sm text-[#0F172A] font-medium">{m.item}</td>
                <td className="py-3">
                  <input type="text" placeholder="--" className="bg-gray-50 border border-[#E2E8F0] rounded-lg px-3 py-1 w-24 text-sm text-[#0F172A] outline-none focus:border-[#2563EB]" />
                </td>
                <td className="py-3 text-sm text-[#64748B]">{m.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* 5. Photo Gallery */}
      <Card extra="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[16px] font-semibold text-[#0F172A]">Photo Gallery</h3>
          <button className="flex items-center gap-2 text-[#2563EB] text-sm font-bold hover:opacity-80 transition">
            <MdCloudUpload className="text-lg" /> Upload Photos
          </button>
        </div>
        <div className="w-full border-2 border-dashed border-[#E2E8F0] rounded-[14px] p-8 flex flex-col items-center justify-center text-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
          <MdCloudUpload className="text-3xl text-[#64748B] mb-2" />
          <p className="text-sm font-medium text-[#0F172A]">Drag files here or browse</p>
          <p className="text-xs text-[#64748B]">Support JPG, PNG</p>
        </div>
      </Card>

      {/* 6. Record Site Visit (Form) */}
      <Card extra="p-6 border-l-4 border-[#06B6D4]">
        <h3 className="text-[16px] font-semibold text-[#0F172A] mb-4">Record Site Visit</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
           <div className="flex flex-col">
             <label className="text-xs text-gray-500 mb-1">Date of Visit</label>
             <input type="date" className="border border-[#E2E8F0] rounded p-2 text-sm outline-none focus:border-[#2563EB]" />
           </div>
           <div className="flex flex-col">
             <label className="text-xs text-gray-500 mb-1">Conducted By</label>
             <input type="text" placeholder="Employee Name" className="border border-[#E2E8F0] rounded p-2 text-sm outline-none focus:border-[#2563EB]" />
           </div>
        </div>
        <div className="flex flex-col mb-4">
             <label className="text-xs text-gray-500 mb-1">Visit Type</label>
             <select className="border border-[#E2E8F0] rounded p-2 text-sm outline-none focus:border-[#2563EB]">
               <option>Initial Inspection</option>
               <option>Soil Testing</option>
               <option>Measurement Verification</option>
               <option>Other</option>
             </select>
        </div>

        <label className="text-xs text-gray-500 mb-1 block">Visit Record & Observations</label>
        <textarea 
          className="w-full min-h-[120px] rounded-[10px] border border-[#E2E8F0] p-4 text-[14px] text-[#475569] outline-none focus:border-[#2563EB]"
          placeholder="Document what was done, what is the record, and everything important..."
        ></textarea>
        
        <div className="mt-4 flex justify-end">
           <button className="rounded-[10px] bg-[#2563EB] px-6 py-2 text-sm font-bold text-white hover:opacity-90 transition">Save Record</button>
        </div>
      </Card>

      {/* 7. Action */}
      <Card extra="p-6">
        <div className="flex flex-wrap gap-4">
          <button className="h-12 flex-1 rounded-[12px] bg-gradient-to-r from-[#2563EB] to-[#06B6D4] px-6 font-bold text-white hover:opacity-90 transition" onClick={() => window.alert("Schedule Revisit feature opens calendar modal (To be implemented)")}>Schedule Revisit</button>
        </div>
      </Card>
    </div>
  );
};

export default TabSiteVisit;
