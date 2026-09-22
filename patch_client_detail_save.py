import os

filepath = 'crm/src/views/admin/clients/ClientDetail.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

import_target = "const supabase = createClient(supabaseUrl, supabaseKey);"
import_new = """const supabase = createClient(supabaseUrl, supabaseKey);

const DESIGN_SERVICES_LIST = [
  "Land Registration & Mutation", "Building Plan Approval", "2D Floor Plan Design", 
  "3D Floor Plan Design", "3D Elevation Design", "Soil Testing", "Structural Design", 
  "Vastu Consultation", "Interior Design"
];
const CONSTRUCTION_SERVICES_LIST = [
  "Residential Construction", "Commercial Construction", "Industrial Construction", 
  "Painting & Epoxy Flooring", "Renovation & Remodeling", "Turnkey Projects", "Electrical & Plumbing"
];"""

content = content.replace(import_target, import_new)

func_target = "const fetchEmployees = async () => {"
func_new = """const handleSaveServiceRequirements = async () => {
    try {
      const selected = clientData.leadData?.selectedServices || [];
      if (!selected.length) return;
      
      const toDesign = selected.filter(s => DESIGN_SERVICES_LIST.includes(s));
      const toConstruct = selected.filter(s => CONSTRUCTION_SERVICES_LIST.includes(s));
      
      // We should check if they already exist to prevent dupes, but for now we just insert missing
      
      // Fetch existing
      const { data: exServices } = await supabase.from("services").select("name").eq("client_id", clientData.id);
      const { data: exProjects } = await supabase.from("projects").select("name").eq("client_id", clientData.id);
      
      const exServiceNames = exServices?.map(s => s.name) || [];
      const exProjectNames = exProjects?.map(p => p.name) || [];
      
      const newServices = toDesign.filter(s => !exServiceNames.includes(s)).map(s => ({
         name: s, client_id: clientData.id, status: "Active"
      }));
      const newProjects = toConstruct.filter(p => !exProjectNames.includes(p)).map(p => ({
         name: p, client_id: clientData.id, status: "Active"
      }));
      
      if (newServices.length > 0) await supabase.from("services").insert(newServices);
      if (newProjects.length > 0) await supabase.from("projects").insert(newProjects);
      
      alert("Service requirements saved & created successfully!");
    } catch (err) {
      alert("Error saving service requirements: " + err.message);
    }
  };

  const fetchEmployees = async () => {"""
content = content.replace(func_target, func_new)

tab_target = """            {activeTab === "Service Requirement" && (
              <TabServiceRequirement leadData={clientData.leadData} setLeadData={(newData) => setClientData({...clientData, leadData: newData})} />
            )}"""
            
tab_new = """            {activeTab === "Service Requirement" && (
              <TabServiceRequirement 
                leadData={clientData.leadData} 
                setLeadData={(newData) => setClientData({...clientData, leadData: newData})} 
                handleSaveToDB={handleSaveServiceRequirements}
              />
            )}"""

content = content.replace(tab_target, tab_new)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Patched ClientDetail.jsx")
