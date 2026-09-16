import sys

with open('crm/src/views/admin/clients/index.jsx', 'r') as f:
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

# Update newClient state
content = content.replace(
    'work_types: ""',
    'work_types: []'
)

# Update form elements for multi-select
old_service = """<input value={newClient.work_types} onChange={e=>setNewClient({...newClient, work_types: e.target.value})} type="text" placeholder="e.g. Design, Build..." className="w-full h-11 px-3 rounded-[10px] border border-[#E2E8F0] dark:border-navy-700 text-[14px] text-[#0F172A] dark:text-white outline-none focus:border-[#2563EB] transition-colors" />"""
new_service = """<div className="flex flex-col gap-2 max-h-48 overflow-y-auto p-2 border rounded-[10px] dark:border-navy-700 custom-scrollbar">
                        <div className="text-xs font-bold text-brand-500 mb-1">Services</div>
                        {DESIGN_SERVICES.map(s => (
                           <label key={s.id} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-navy-700 p-1 rounded">
                              <input type="checkbox" checked={Array.isArray(newClient.work_types) && newClient.work_types.includes(s.id)} onChange={(e) => {
                                 let st = Array.isArray(newClient.work_types) ? [...newClient.work_types] : [];
                                 if (e.target.checked) st.push(s.id);
                                 else st = st.filter(x => x !== s.id);
                                 setNewClient({...newClient, work_types: st});
                              }} /> {s.id}
                           </label>
                        ))}
                        <div className="text-xs font-bold text-brand-500 mt-2 mb-1">Projects</div>
                        {EXECUTION_PROJECTS.map(p => (
                           <label key={p.id} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-navy-700 p-1 rounded">
                              <input type="checkbox" checked={Array.isArray(newClient.work_types) && newClient.work_types.includes(p.id)} onChange={(e) => {
                                 let st = Array.isArray(newClient.work_types) ? [...newClient.work_types] : [];
                                 if (e.target.checked) st.push(p.id);
                                 else st = st.filter(x => x !== p.id);
                                 setNewClient({...newClient, work_types: st});
                              }} /> {p.id}
                           </label>
                        ))}
                    </div>"""
content = content.replace(old_service, new_service)

# handleCreateClient serialization
old_create = "work_types: newClient.work_types,"
new_create = "work_types: Array.isArray(newClient.work_types) ? newClient.work_types.join(', ') : newClient.work_types,"
content = content.replace(old_create, new_create)

# Status Update
content = content.replace('<option value="active">Active</option>', '<option value="Ongoing">Ongoing</option>\n<option value="Success">Success</option>')
content = content.replace('<option value="inactive">Inactive</option>', '<option value="Closed">Closed</option>')

# Add Interested In column to table
old_th = '<th className="pb-3 pr-4 font-bold uppercase tracking-wide">Status</th>'
new_th = '<th className="pb-3 pr-4 font-bold uppercase tracking-wide">Interested In</th>\n<th className="pb-3 pr-4 font-bold uppercase tracking-wide">Status</th>'
content = content.replace(old_th, new_th)

old_td = """<td className="py-3 pr-4">
                                     <select"""
new_td = """<td className="py-3 pr-4 text-[13px] font-medium text-brand-500">
                                       <div className="max-w-[150px] truncate" title={client.work_types || "-"}>{client.work_types || "-"}</div>
                                     </td>
                                     <td className="py-3 pr-4">
                                     <select"""
content = content.replace(old_td, new_td)

# Color coding for status in list
old_status_color = """"""
new_status_color = """"""
content = content.replace(old_status_color, new_status_color)


with open('crm/src/views/admin/clients/index.jsx', 'w') as f:
    f.write(content)
print("Updated clients index")
