import React, { useState, useEffect } from "react";
import Card from "components/card";
import { 
  MdExpandMore, MdExpandLess, MdOutlineCloudUpload, MdLayers
} from "react-icons/md";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);

const WorkspaceSection = ({ title, defaultOpen = true, children }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [status, setStatus] = useState("Pending");
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const { data } = await supabase.from('employees').select('id, name, role');
    if (data) setEmployees(data);
  };
  
  return (
    <Card extra="mb-6 overflow-hidden border border-[#E2E8F0] shadow-sm">
      <div 
        className="flex flex-col md:flex-row justify-between md:items-center p-5 bg-white border-b border-[#E2E8F0] gap-4"
      >
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
           <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[#475569] hover:bg-gray-200">
             {isOpen ? <MdExpandLess className="text-xl" /> : <MdExpandMore className="text-xl" />}
           </button>
           <h3 className="text-[18px] font-bold text-[#0F172A]">{title}</h3>
        </div>
        <div className="flex gap-3 items-center">
           <select className="text-[13px] border border-[#E2E8F0] rounded-lg px-3 py-1.5 outline-none focus:border-[#2563EB] bg-white text-[#475569]">
              <option value="">Assign Employee...</option>
              {employees.map(emp => (
                 <option key={emp.id} value={emp.id}>{emp.name} ({emp.role})</option>
              ))}
           </select>
           <select 
              value={status} 
              onChange={e => setStatus(e.target.value)}
              className={`text-[13px] border rounded-lg px-3 py-1.5 outline-none font-bold ${status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' : status === 'In Progress' ? 'bg-blue-50 text-[#2563EB] border-blue-200' : 'border-[#E2E8F0] text-[#64748B] bg-white'}`}
           >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
           </select>
        </div>
      </div>
      {isOpen && (
        <div className="p-6 border-t border-[#E2E8F0] bg-[#F8FAFC]">
          {children}
        </div>
      )}
    </Card>
  );
};

// Helper for generic fields
const InputField = ({ label, placeholder }) => (
  <div className="flex flex-col">
    <label className="text-[12px] font-medium text-[#64748B] mb-1">{label}</label>
    <input type="text" placeholder={placeholder || "Enter value"} className="h-10 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none focus:border-[#2563EB] bg-white" />
  </div>
);

const SelectField = ({ label, options }) => (
  <div className="flex flex-col">
    <label className="text-[12px] font-medium text-[#64748B] mb-1">{label}</label>
    <select className="h-10 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none focus:border-[#2563EB] bg-white text-[#475569]">
      <option value="">Choose option</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

const CheckboxField = ({ label }) => (
  <label className="flex items-center gap-2 cursor-pointer text-[14px] font-medium text-[#475569]">
    <input type="checkbox" className="w-4 h-4 rounded text-[#2563EB] border-[#E2E8F0]" />
    {label}
  </label>
);

const DragDropUpload = ({ label }) => (
  <div className="mt-4">
    <label className="text-[12px] font-medium text-[#64748B] mb-2 block">{label}</label>
    <div className="w-full border-2 border-dashed border-[#CBD5E1] rounded-[16px] p-8 flex flex-col items-center justify-center bg-white hover:bg-blue-50 hover:border-[#2563EB] transition-colors cursor-pointer text-center">
      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-[#2563EB] text-2xl mb-3">
        <MdOutlineCloudUpload />
      </div>
      <p className="text-[14px] font-bold text-[#0F172A]">Drag & drop files here</p>
      <p className="text-[12px] text-[#64748B] mt-1">or click to browse</p>
    </div>
  </div>
);

// Individual Workspaces

const ResidentialWorkspace = () => (
  <WorkspaceSection title="Residential Site Survey">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <InputField label="Plot Length (ft)" />
      <InputField label="Plot Width (ft)" />
      <InputField label="Total Area (sq.ft)" />
      <InputField label="Road Width (ft)" />
      <SelectField label="Facing" options={["North", "South", "East", "West", "North-East", "North-West"]} />
      <SelectField label="Corner Plot" options={["Yes", "No"]} />
      <SelectField label="Boundary Wall" options={["Yes", "No"]} />
      <SelectField label="Existing Structure" options={["None", "To be demolished", "To be retained"]} />
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
      <Card extra="p-4 bg-white border border-[#E2E8F0]">
        <h4 className="text-[14px] font-bold text-[#0F172A] mb-3 border-b pb-2">Utilities Available</h4>
        <div className="grid grid-cols-2 gap-3">
          <CheckboxField label="Water Available" />
          <CheckboxField label="Electricity" />
          <CheckboxField label="Sewer Connection" />
          <CheckboxField label="Borewell" />
          <CheckboxField label="Internet" />
        </div>
      </Card>
      
      <Card extra="p-4 bg-white border border-[#E2E8F0]">
        <h4 className="text-[14px] font-bold text-[#0F172A] mb-3 border-b pb-2">Engineering & Setbacks</h4>
        <div className="grid grid-cols-2 gap-4">
          <SelectField label="Soil Type" options={["Red Soil", "Black Cotton", "Sandy", "Clay"]} />
          <InputField label="Number of Floors" />
          <InputField label="Setback Front (ft)" />
          <InputField label="Setback Rear (ft)" />
        </div>
      </Card>
    </div>
    
    <DragDropUpload label="Upload Plot Photos & Location Map" />
    
    <div className="mt-6">
      <label className="text-[12px] font-medium text-[#64748B] mb-2 block">Engineering Observations</label>
      <div className="flex gap-2">
        <input type="text" className="flex-1 rounded-[10px] border border-[#E2E8F0] px-4 h-10 text-[14px] outline-none focus:border-[#2563EB] bg-white" placeholder="Add a new observation..." />
        <button className="h-10 px-4 bg-[#2563EB] text-white rounded-[10px] font-bold text-sm" onClick={() => window.alert('Observation posted!')}>Post</button>
      </div>
      <div className="mt-4 space-y-3">
         <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg text-sm text-gray-700">
           <span className="font-bold text-[#0F172A] text-xs block mb-1">Admin • Just now</span>
           Plot dimensions verified on site. Waiting for soil test results.
         </div>
      </div>
    </div>
  </WorkspaceSection>
);

const InteriorWorkspace = () => (
  <WorkspaceSection title="Interior Design Survey">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <SelectField label="Property Type" options={["Apartment", "Villa", "Office", "Retail"]} />
      <InputField label="Carpet Area (sq.ft)" />
      <InputField label="Ceiling Height (ft)" />
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
      <Card extra="p-4 bg-white border border-[#E2E8F0]">
        <h4 className="text-[14px] font-bold text-[#0F172A] mb-3 border-b pb-2">Room Configuration</h4>
        <div className="grid grid-cols-2 gap-3">
          <CheckboxField label="Living Room" />
          <CheckboxField label="Dining" />
          <CheckboxField label="Kitchen" />
          <CheckboxField label="Master Bedroom" />
          <CheckboxField label="Bedroom 2" />
          <CheckboxField label="Study / Office" />
        </div>
      </Card>
      
      <Card extra="p-4 bg-white border border-[#E2E8F0]">
        <h4 className="text-[14px] font-bold text-[#0F172A] mb-3 border-b pb-2">Interior Scope</h4>
        <div className="grid grid-cols-2 gap-3">
          <CheckboxField label="Modular Kitchen" />
          <CheckboxField label="Wardrobes" />
          <CheckboxField label="TV Unit" />
          <CheckboxField label="False Ceiling" />
          <CheckboxField label="Lighting" />
          <CheckboxField label="Bathroom Design" />
        </div>
      </Card>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <SelectField label="Style" options={["Modern", "Minimalist", "Traditional", "Industrial"]} />
      <SelectField label="Color Theme" options={["Warm", "Cool", "Neutral", "Monochrome"]} />
      <SelectField label="Budget Category" options={["Economy", "Premium", "Luxury"]} />
    </div>

    <DragDropUpload label="Upload Pinterest References & Mood Boards" />
  </WorkspaceSection>
);

const LegalWorkspace = () => (
  <WorkspaceSection title="Legal Verification & Registration">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <InputField label="Mouza" />
      <InputField label="JL Number" />
      <InputField label="Dag Number" />
      <InputField label="Khatian Number" />
      <InputField label="Deed Number" />
      <SelectField label="Mutation Status" options={["Pending", "Completed", "Not Applied"]} />
    </div>
    <DragDropUpload label="Upload Sale Deed & Khatian" />
  </WorkspaceSection>
);

const ApprovalWorkspace = () => (
  <WorkspaceSection title="Building Plan Approval">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <InputField label="Municipality" />
      <InputField label="Architect" />
      <InputField label="Drawing Number" />
      <InputField label="Submission Date" placeholder="Select date" />
      <SelectField label="Approval Status" options={["Preparing", "Submitted", "Query Raised", "Approved"]} />
      <InputField label="Permit Number" />
    </div>
    <DragDropUpload label="Upload Sanction Drawings" />
  </WorkspaceSection>
);

const ArchitecturalWorkspace = () => (
  <WorkspaceSection title="Architectural Brief (Floor Plan & Elevation)">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <InputField label="Plot Size" />
      <InputField label="Floors Required" />
      <InputField label="Bedrooms" />
      <InputField label="Bathrooms" />
      <SelectField label="Elevation Style" options={["Modern", "Contemporary", "Classic", "Sloping Roof"]} />
      <SelectField label="Exterior Finish" options={["Paint", "Texture", "Cladding", "Brick Exposed"]} />
    </div>
    <div className="mt-4">
      <label className="text-[12px] font-medium text-[#64748B] mb-2 block">Special Layout Requirements</label>
      <textarea className="w-full rounded-[10px] border border-[#E2E8F0] p-4 text-[14px] outline-none focus:border-[#2563EB] bg-white" rows="2"></textarea>
    </div>
  </WorkspaceSection>
);

const StructuralWorkspace = () => (
  <WorkspaceSection title="Structural & Soil Input">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <InputField label="SBC (Soil Bearing Capacity)" />
      <SelectField label="Foundation Type" options={["Isolated Footing", "Raft", "Pile"]} />
      <InputField label="Column Grid spacing" />
      <InputField label="Slab Thickness (inch)" />
      <InputField label="Test Agency" />
    </div>
    <DragDropUpload label="Upload Soil Report & Structural Drawings" />
  </WorkspaceSection>
);

const MEPWorkspace = () => (
  <WorkspaceSection title="MEP Survey (Electrical & Plumbing)">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <SelectField label="Plumbing Scope" options={["Internal Only", "External Only", "End-to-End"]} />
      <SelectField label="Electrical Scope" options={["Basic Wiring", "Smart Home", "Industrial Load"]} />
      <InputField label="DB Panels Required" />
      <SelectField label="Earthing Required" options={["Yes", "No"]} />
    </div>
  </WorkspaceSection>
);

const CommercialWorkspace = () => (
  <WorkspaceSection title="Commercial / Industrial Survey">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <SelectField label="Building Use" options={["Office", "Retail", "Warehouse", "Factory"]} />
      <InputField label="Client Capacity / Area" />
      <SelectField label="Fire NOC Required" options={["Yes", "No"]} />
      <InputField label="Crane Capacity (if Industrial)" />
      <InputField label="Electrical Load" />
      <SelectField label="Parking Scope" options={["Basement", "Stilt", "Open"]} />
    </div>
  </WorkspaceSection>
);

const PaintingWorkspace = () => (
  <WorkspaceSection title="Surface Inspection (Painting & Flooring)">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <InputField label="Total Surface Area (sq.ft)" />
      <SelectField label="Wall Condition" options={["New Plaster", "Old Paint", "Dampness/Cracks"]} />
      <SelectField label="Epoxy Grade" options={["Not Required", "Commercial", "Industrial Heavy"]} />
    </div>
    <DragDropUpload label="Upload Surface Condition Images" />
  </WorkspaceSection>
);

const ElevationWorkspace = () => (
  <WorkspaceSection title="3D Elevation & Façade Design">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <SelectField label="Elevation Style" options={["Modern", "Contemporary", "Classic", "Sloping Roof", "Minimalist", "Art Deco"]} />
      <SelectField label="Exterior Finish" options={["Paint", "Texture", "Cladding", "Brick Exposed", "Stone", "Glass"]} />
      <SelectField label="Color Theme" options={["Warm", "Cool", "Neutral", "Monochrome", "Earthy"]} />
      <InputField label="Special Features" placeholder="E.g. Balcony, Terrace Garden..." />
    </div>
    <DragDropUpload label="Upload Reference Elevations" />
  </WorkspaceSection>
);

const VastuWorkspace = () => (
  <WorkspaceSection title="Vastu Consultation & Compliance">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <SelectField label="Plot Facing Direction" options={["North", "South", "East", "West", "North-East", "North-West", "South-East", "South-West"]} />
      <InputField label="Brahmasthan Details" placeholder="Center grid clearance..." />
      <InputField label="Pooja Room Placement" placeholder="Suggested corner/zone..." />
      <InputField label="Kitchen Placement" placeholder="Fire element zone..." />
      <InputField label="Water Body / Tank" placeholder="Water element zone..." />
      <SelectField label="Overall Compliance" options={["100% Compliant", "Majorly Compliant", "Remedies Required"]} />
    </div>
    <div className="mt-4">
      <label className="text-[12px] font-medium text-[#64748B] mb-2 block">Vastu Remedies & Notes</label>
      <textarea className="w-full rounded-[10px] border border-[#E2E8F0] p-4 text-[14px] outline-none focus:border-[#2563EB] bg-white" rows="2" placeholder="List any mirrors, pyramids, or directional changes required..."></textarea>
    </div>
  </WorkspaceSection>
);

// Main Component
const TabServiceWorkspace = ({ leadData, customRequirements }) => {
  let selected = [];
  
  if (customRequirements) {
     selected = customRequirements;
  } else {
     selected = leadData?.selectedServices || [];
  }

  if (selected.length === 0) {
    return (
      <Card extra="p-12 text-center border border-[#E2E8F0]">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-[#2563EB] text-3xl mx-auto mb-4">
          <MdLayers />
        </div>
        <h3 className="text-[18px] font-bold text-[#0F172A] mb-2">No Services Selected</h3>
        <p className="text-[14px] text-[#64748B] max-w-[400px] mx-auto">
          Please go to the <strong>Service Requirement</strong> tab and select one or more services to automatically generate the appropriate workspace here.
        </p>
      </Card>
    );
  }

  // Dynamic Workspace Mapping logic
  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center gap-3">
        <h2 className="text-[24px] font-bold text-[#0F172A]">Generated Workspace</h2>
        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Intelligent Layout</span>
      </div>

      {selected.includes("Residential Construction") && <ResidentialWorkspace />}
      {(selected.includes("Commercial Construction") || selected.includes("Industrial Construction")) && <CommercialWorkspace />}
      {selected.includes("Interior Design") && <InteriorWorkspace />}
      {selected.includes("Renovation & Remodeling") && <ResidentialWorkspace />}
      {selected.includes("Painting & Epoxy Flooring") && <PaintingWorkspace />}
      {selected.includes("Electrical & Plumbing") && <MEPWorkspace />}
      
      {selected.includes("Land Registration & Mutation") && <LegalWorkspace />}
      {selected.includes("Building Plan Approval") && <ApprovalWorkspace />}
      
      {(selected.includes("2D Floor Plan Design") || selected.includes("3D Floor Plan Design")) && <ArchitecturalWorkspace />}
      {selected.includes("3D Elevation Design") && <ElevationWorkspace />}
      {selected.includes("Vastu Consultation") && <VastuWorkspace />}
      
      {(selected.includes("Soil Testing") || selected.includes("Structural Design")) && <StructuralWorkspace />}
      
      <div className="mt-8 flex justify-end">
        <button 
          className="px-6 py-2 bg-[#2563EB] text-white rounded-lg font-bold shadow-md hover:bg-blue-700 transition" 
          onClick={() => alert('Workspace Data Saved!')}
        >
          Save Workspace
        </button>
      </div>
    </div>
  );
};

export default TabServiceWorkspace;
