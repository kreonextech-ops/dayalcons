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

// Generic Form Elements
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
const TurnkeyWorkspace = () => (
  <WorkspaceSection title="Turnkey Construction Workspace">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <InputField label="Total Plot Area (Sq Ft)" />
      <InputField label="Total Built-up Area" />
      <InputField label="No. of Floors" />
      <SelectField label="Approval Status" options={["Pending", "Approved", "Not Required"]} />
    </div>
    <DragDropUpload label="Upload Architecture & Structural Plans" />
  </WorkspaceSection>
);

const CommercialWorkspace = () => (
  <WorkspaceSection title="Commercial Construction Workspace">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <SelectField label="Building Type" options={["Office Space", "Retail / Mall", "Warehouse", "Mixed Use"]} />
      <InputField label="Floor Plate Size (Sq Ft)" />
      <SelectField label="Fire Safety Status" options={["NOC Pending", "NOC Received"]} />
    </div>
    <DragDropUpload label="Upload Commercial Blueprints & Clearances" />
  </WorkspaceSection>
);

const IndustrialWorkspace = () => (
  <WorkspaceSection title="Industrial Setup Workspace">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <SelectField label="Zone Classification" options={["Light Industrial", "Heavy Industrial", "SEZ"]} />
      <InputField label="Shed / Factory Area" />
      <InputField label="Heavy Machinery Load Req." />
    </div>
    <DragDropUpload label="Upload Industrial Layouts" />
  </WorkspaceSection>
);

const RenovationWorkspace = () => (
  <WorkspaceSection title="Renovation & Remodeling Workspace">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <SelectField label="Structure Condition" options={["Needs Major Repair", "Good", "Excellent"]} />
      <SelectField label="Demolition Required" options={["Yes", "No", "Partial"]} />
      <InputField label="Renovation Area (Sq Ft)" />
      <InputField label="Estimated Duration (Days)" />
    </div>
    <DragDropUpload label="Upload Existing Photos & Proposed Plans" />
  </WorkspaceSection>
);

const InteriorWorkspace = () => (
  <WorkspaceSection title="Interior Execution Workspace">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <SelectField label="Interior Theme" options={["Modern", "Classic", "Minimalist", "Industrial", "Bohemian"]} />
      <InputField label="Total Carpet Area" />
      <InputField label="Ceiling Height (ft)" />
      <SelectField label="Vastu Compliant" options={["Yes", "No"]} />
    </div>
    <DragDropUpload label="Upload 3D Renders & False Ceiling Layouts" />
  </WorkspaceSection>
);

const LandscapingWorkspace = () => (
  <WorkspaceSection title="Landscaping Workspace">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <InputField label="Garden Area (Sq Ft)" />
      <SelectField label="Soil Type" options={["Red Soil", "Clay", "Sandy", "Peaty"]} />
      <SelectField label="Irrigation System" options={["Manual", "Sprinklers", "Drip", "Automated"]} />
    </div>
    <DragDropUpload label="Upload Landscaping Layout & Reference Images" />
  </WorkspaceSection>
);

const TabWorkspace = ({ projData }) => {
  let selected = [];
  try {
    const meta = JSON.parse(projData.description || "{}");
    selected = meta.requirements || [];
  } catch (e) {
    selected = [];
  }

  if (selected.length === 0) {
    return (
      <Card extra="p-12 text-center border border-[#E2E8F0]">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-[#2563EB] text-3xl mx-auto mb-4">
          <MdLayers />
        </div>
        <h3 className="text-[18px] font-bold text-[#0F172A] mb-2">No Scope Selected</h3>
        <p className="text-[14px] text-[#64748B] max-w-[400px] mx-auto">
          Please go to the <strong>Scope</strong> tab and select one or more project requirements to automatically generate the appropriate workspace here.
        </p>
      </Card>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center gap-3">
        <h2 className="text-[24px] font-bold text-[#0F172A]">Generated Execution Workspace</h2>
        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Intelligent Layout</span>
      </div>

      {selected.includes("Turnkey Construction") && <TurnkeyWorkspace />}
      {selected.includes("Commercial Construction") && <CommercialWorkspace />}
      {selected.includes("Industrial Setup") && <IndustrialWorkspace />}
      {selected.includes("Renovation & Remodeling") && <RenovationWorkspace />}
      {selected.includes("Interior Execution") && <InteriorWorkspace />}
      {selected.includes("Landscaping") && <LandscapingWorkspace />}
    </div>
  );
};

export default TabWorkspace;
