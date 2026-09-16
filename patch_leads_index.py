import sys

with open('crm/src/views/admin/crm/index.jsx', 'r') as f:
    content = f.read()

# Add EXECUTION_PROJECTS and DESIGN_SERVICES
projects_services_str = """
import { MdFoundation, MdLocationCity, MdEngineering, MdOutlineArchitecture, MdBusinessCenter, MdCloudDownload, MdDomainVerification, MdLayers, MdHouse, MdWaterDrop, MdPhotoSizeSelectSmall } from "react-icons/md";
import { FiFileText, FiMap } from "react-icons/fi";

const DESIGN_SERVICES = [
  { id: "Land Registration & Mutation", icon: <FiFileText /> },
  { id: "L.U.C.C", icon: <FiFileText /> },
  { id: "Building Plan Approval", icon: <MdDomainVerification /> },
  { id: "2D Floor Plan Design", icon: <MdLayers /> },
  { id: "3D Floor Plan Design", icon: <MdLayers /> },
  { id: "3D Elevation Design", icon: <MdHouse /> },
  { id: "Soil Testing", icon: <MdWaterDrop /> },
  { id: "Structural Design", icon: <MdOutlineFoundation /> },
  { id: "Vastu Consultation", icon: <FiMap /> },
  { id: "Interior Design", icon: <MdPhotoSizeSelectSmall /> }
];

const EXECUTION_PROJECTS = [
  { id: "Turnkey Construction", icon: <MdFoundation /> },
  { id: "Commercial Construction", icon: <MdLocationCity /> },
  { id: "Industrial Setup", icon: <MdEngineering /> },
  { id: "Renovation & Remodeling", icon: <MdOutlineArchitecture /> },
  { id: "Interior Execution", icon: <MdBusinessCenter /> },
  { id: "Landscaping", icon: <MdCloudDownload /> },
];
"""
if "const DESIGN_SERVICES" not in content:
    content = content.replace('import React, { useState, useEffect } from "react";', 'import React, { useState, useEffect } from "react";\n' + projects_services_str)


# Update newLead state
content = content.replace(
    'service_type: "", source: "",',
    'service_type: [], source: "",'
)

# Update form elements for multi-select
old_service = """<select value={newLead.service_type} onChange={e=>setNewLead({...newLead, service_type: e.target.value})} className="w-full h-11 px-3 rounded-[10px] border border-[#E2E8F0] dark:border-navy-700 text-[14px] text-[#0F172A] dark:text-white outline-none focus:border-[#2563EB] transition-colors cursor-pointer bg-white dark:bg-navy-800">
                      <option value="">Select service</option>
                      <option value="Residential">Residential</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Industrial">Industrial</option>
                    </select>"""
new_service = """<div className="flex flex-col gap-2 max-h-48 overflow-y-auto p-2 border rounded-[10px] dark:border-navy-700 custom-scrollbar">
                        <div className="text-xs font-bold text-brand-500 mb-1">Services</div>
                        {DESIGN_SERVICES.map(s => (
                           <label key={s.id} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-navy-700 p-1 rounded">
                              <input type="checkbox" checked={Array.isArray(newLead.service_type) && newLead.service_type.includes(s.id)} onChange={(e) => {
                                 let st = Array.isArray(newLead.service_type) ? [...newLead.service_type] : [];
                                 if (e.target.checked) st.push(s.id);
                                 else st = st.filter(x => x !== s.id);
                                 setNewLead({...newLead, service_type: st});
                              }} /> {s.id}
                           </label>
                        ))}
                        <div className="text-xs font-bold text-brand-500 mt-2 mb-1">Projects</div>
                        {EXECUTION_PROJECTS.map(p => (
                           <label key={p.id} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-navy-700 p-1 rounded">
                              <input type="checkbox" checked={Array.isArray(newLead.service_type) && newLead.service_type.includes(p.id)} onChange={(e) => {
                                 let st = Array.isArray(newLead.service_type) ? [...newLead.service_type] : [];
                                 if (e.target.checked) st.push(p.id);
                                 else st = st.filter(x => x !== p.id);
                                 setNewLead({...newLead, service_type: st});
                              }} /> {p.id}
                           </label>
                        ))}
                    </div>"""
content = content.replace(old_service, new_service)

# handleCreateLead serialization
old_create = "service_type: newLead.service_type,"
new_create = "service_type: Array.isArray(newLead.service_type) ? newLead.service_type.join(', ') : newLead.service_type,"
content = content.replace(old_create, new_create)

# Status Update
content = content.replace('<option>New</option>', '<option>Ongoing</option>')
content = content.replace('<option>Contacted</option>', '')
content = content.replace('<option>Site Visit</option>', '<option>Success</option>')
content = content.replace('<option>Proposal Sent</option>', '')
content = content.replace('<option>Won</option>', '')
content = content.replace('<option>Lost</option>', '<option>Closed</option>')

# Direct Status Change Won -> Success
content = content.replace('if (newStatus === "Won") {', 'if (newStatus === "Success") {')

# Color coding for status in list
old_status_color = """"""
new_status_color = """"""
content = content.replace(old_status_color, new_status_color)

with open('crm/src/views/admin/crm/index.jsx', 'w') as f:
    f.write(content)
print("Updated leads index")
