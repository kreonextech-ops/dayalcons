import React, { useState, useEffect } from "react";
import Card from "components/card";
import { MdAdd, MdClose, MdCheckCircle } from "react-icons/md";

const TabRoles = () => {
  const defaultRoles = [
    { name: "Admin", empCount: 0, permissions: "ALL" },
    { 
       name: "Project Manager", empCount: 0, 
       permissions: {
          "Execution Projects": { view: true, create: true, edit: true, delete: false },
          "Tasks": { view: true, create: true, edit: true, delete: true },
          "Employees": { view: true, create: false, edit: false, delete: false },
          "Clients": { view: true, create: false, edit: false, delete: false },
          "Vendors": { view: true, create: true, edit: true, delete: false }
       }
    },
    { 
       name: "Sales", empCount: 0, 
       permissions: {
          "Leads": { view: true, create: true, edit: true, delete: false },
          "Clients": { view: true, create: true, edit: true, delete: false },
          "Tasks": { view: true, create: true, edit: true, delete: false }
       }
    },
    { 
       name: "Architect", empCount: 0, 
       permissions: {
          "Design Services": { view: true, create: true, edit: true, delete: false },
          "Tasks": { view: true, create: true, edit: true, delete: false },
          "Clients": { view: true, create: false, edit: false, delete: false }
       }
    },
    { 
       name: "Site Engineer", empCount: 0, 
       permissions: {
          "Execution Projects": { view: true, create: false, edit: true, delete: false },
          "Tasks": { view: true, create: false, edit: true, delete: false }
       }
    },
    { 
       name: "Accountant", empCount: 0, 
       permissions: {
          "Finance": { view: true, create: true, edit: true, delete: false },
          "Clients": { view: true, create: false, edit: false, delete: false },
          "Execution Projects": { view: true, create: false, edit: false, delete: false }
       }
    },
  ];

  const [roles, setRoles] = useState([]);
  const [activeRoleName, setActiveRoleName] = useState("Admin");
  const [showModal, setShowModal] = useState(false);
  const [newRole, setNewRole] = useState({ name: "", permissions: {} });
  const [isEditing, setIsEditing] = useState(false);

  const modulesForPermissions = [
     "Dashboard", "Leads", "Clients", "Design Services", "Execution Projects", "Tasks", "Finance", "Documents", "Vendors", "Employees"
  ];

  useEffect(() => {
     const saved = localStorage.getItem("dayal_roles");
     if (saved) {
        setRoles(JSON.parse(saved));
     } else {
        setRoles(defaultRoles);
        localStorage.setItem("dayal_roles", JSON.stringify(defaultRoles));
     }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePermissionToggle = (module, perm) => {
     setNewRole(prev => {
        const modPerms = prev.permissions[module] || {};
        return {
           ...prev,
           permissions: {
              ...prev.permissions,
              [module]: { ...modPerms, [perm]: !modPerms[perm] }
           }
        };
     });
  };

  const handleSave = () => {
     if (!newRole.name) return;
     let updatedRoles;
     
     if (isEditing) {
        updatedRoles = roles.map(r => r.name === newRole.name ? { ...r, permissions: newRole.permissions } : r);
     } else {
        updatedRoles = [...roles, { ...newRole, empCount: 0 }];
     }
     
     localStorage.setItem("dayal_roles", JSON.stringify(updatedRoles));
     setRoles(updatedRoles);
     
     setActiveRoleName(newRole.name);
     setNewRole({ name: "", permissions: {} });
     setShowModal(false);
     setIsEditing(false);
  };

  const handleEdit = () => {
     const activeRole = roles.find(r => r.name === activeRoleName);
     if (activeRole) {
        // Handle "ALL" permission string translation to object for the form
        let permsToEdit = activeRole.permissions;
        if (permsToEdit === "ALL") {
           permsToEdit = {};
           modulesForPermissions.forEach(mod => {
              permsToEdit[mod] = { view: true, create: true, edit: true, delete: true };
           });
        }
        setNewRole({ name: activeRole.name, permissions: permsToEdit });
        setIsEditing(true);
        setShowModal(true);
     }
  };

  const activeRole = roles.find(r => r.name === activeRoleName) || roles[0] || defaultRoles[0];

  return (
    <div className="animate-fade-in relative">
       <div className="flex justify-between items-center mb-6">
          <div>
             <h3 className="text-[18px] font-bold text-[#0F172A]">Permission Roles (RBAC)</h3>
             <p className="text-[13px] text-[#64748B]">Manage pre-defined access levels for employees.</p>
          </div>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-1 text-[#2563EB] text-[13px] font-bold hover:underline">
             Create Custom Role
          </button>
       </div>

       <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar mb-6">
          {roles.map(r => (
             <div key={r.name} onClick={() => setActiveRoleName(r.name)}>
                <Card extra={`flex-none w-[180px] p-5 cursor-pointer border transition-all ${activeRoleName === r.name ? 'border-[#2563EB] bg-blue-50/30 shadow-md' : 'border-[#E2E8F0] shadow-sm hover:shadow-md bg-white'}`}>
                   <h4 className="text-[15px] font-bold text-[#0F172A] mb-2">{r.name}</h4>
                   <p className="text-[12px] text-[#64748B]">{r.empCount} Employees</p>
                </Card>
             </div>
          ))}
       </div>

       <Card extra="border border-[#E2E8F0] overflow-hidden shadow-sm">
          <div className="p-6 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC]">
             <h4 className="text-[14px] font-bold text-[#0F172A]">Module Permissions Matrix: <span className="text-[#2563EB]">{activeRole.name}</span></h4>
             <button onClick={handleEdit} className="h-8 px-4 border border-[#E2E8F0] rounded bg-white text-[12px] font-bold text-[#64748B] hover:bg-gray-50">Edit</button>
          </div>
          <div className="overflow-x-auto">
             <table className="w-full text-left">
                <thead>
                   <tr className="border-b border-[#E2E8F0]">
                      <th className="py-4 px-6 text-[11px] font-bold text-[#64748B] uppercase">Module</th>
                      <th className="py-4 px-4 text-[11px] font-bold text-[#64748B] uppercase text-center">View</th>
                      <th className="py-4 px-4 text-[11px] font-bold text-[#64748B] uppercase text-center">Create</th>
                      <th className="py-4 px-4 text-[11px] font-bold text-[#64748B] uppercase text-center">Edit</th>
                      <th className="py-4 px-4 text-[11px] font-bold text-[#64748B] uppercase text-center">Delete</th>
                   </tr>
                </thead>
                <tbody>
                   {modulesForPermissions.map((mod, i) => {
                      let hasView = false, hasCreate = false, hasEdit = false, hasDelete = false;

                      if (activeRole.permissions === "ALL") {
                         hasView = hasCreate = hasEdit = hasDelete = true;
                      } else if (activeRole.permissions === "DEFAULT") {
                         hasView = true; 
                         hasCreate = false;
                         hasEdit = false;
                         hasDelete = false;
                      } else if (activeRole.permissions && activeRole.permissions[mod]) {
                         hasView = activeRole.permissions[mod].view || false;
                         hasCreate = activeRole.permissions[mod].create || false;
                         hasEdit = activeRole.permissions[mod].edit || false;
                         hasDelete = activeRole.permissions[mod].delete || false;
                      }

                      return (
                         <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-4 px-6 text-[13px] font-bold text-[#0F172A]">{mod}</td>
                            <td className="py-4 px-4 text-center">
                               {hasView ? <div className="w-4 h-4 bg-gray-200 rounded mx-auto flex items-center justify-center text-white font-bold text-[10px]">✓</div> : <div className="w-4 h-4 bg-transparent border border-gray-200 rounded mx-auto"></div>}
                            </td>
                            <td className="py-4 px-4 text-center">
                               {hasCreate ? <div className="w-4 h-4 bg-gray-200 rounded mx-auto flex items-center justify-center text-white font-bold text-[10px]">✓</div> : <div className="w-4 h-4 bg-transparent border border-gray-200 rounded mx-auto"></div>}
                            </td>
                            <td className="py-4 px-4 text-center">
                               {hasEdit ? <div className="w-4 h-4 bg-gray-200 rounded mx-auto flex items-center justify-center text-white font-bold text-[10px]">✓</div> : <div className="w-4 h-4 bg-transparent border border-gray-200 rounded mx-auto"></div>}
                            </td>
                            <td className="py-4 px-4 text-center">
                               {hasDelete ? <div className="w-4 h-4 bg-gray-200 rounded mx-auto flex items-center justify-center text-white font-bold text-[10px]">✓</div> : <div className="w-4 h-4 bg-transparent border border-gray-200 rounded mx-auto"></div>}
                            </td>
                         </tr>
                      );
                   })}
                </tbody>
             </table>
          </div>
       </Card>

       {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
             <div className="w-full max-w-[800px] bg-white rounded-[20px] shadow-2xl flex flex-col max-h-[90vh] animate-fade-in">
                <div className="p-6 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC] rounded-t-[20px]">
                   <h2 className="text-[18px] font-bold text-[#0F172A]">Create Custom Role</h2>
                   <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center text-gray-500 transition"><MdClose size={20} /></button>
                </div>
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                   <div className="mb-6">
                      <label className="block text-[11px] font-bold text-[#475569] mb-1.5 uppercase">Role Name *</label>
                      <input type="text" value={newRole.name} disabled={isEditing} onChange={e => setNewRole({...newRole, name: e.target.value})} placeholder="e.g. Junior Architect" className={`w-full h-11 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none ${isEditing ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white focus:border-[#2563EB]'}`}/>
                   </div>
                   
                   <h4 className="text-[14px] font-bold text-[#0F172A] mb-3 border-b border-[#E2E8F0] pb-2">Permission Matrix</h4>
                   <table className="w-full text-left bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-sm">
                        <thead>
                           <tr className="bg-gray-50 border-b border-[#E2E8F0]">
                              <th className="py-3 px-4 text-[11px] font-bold text-[#475569] uppercase">Module</th>
                              {["View", "Create", "Edit", "Delete"].map(action => (
                                 <th key={action} className="py-3 px-2 text-[11px] font-bold text-[#475569] uppercase text-center">{action}</th>
                              ))}
                           </tr>
                        </thead>
                        <tbody>
                           {modulesForPermissions.map(mod => (
                              <tr key={mod} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                 <td className="py-2.5 px-4 text-[12px] font-bold text-[#0F172A]">{mod}</td>
                                 {["view", "create", "edit", "delete"].map(action => {
                                    const isChecked = newRole.permissions[mod]?.[action] || false;
                                    return (
                                       <td key={action} className="py-2.5 px-2 text-center">
                                          <input 
                                             type="checkbox" 
                                             checked={isChecked}
                                             onChange={() => handlePermissionToggle(mod, action)}
                                             className="w-4 h-4 rounded border-gray-300 text-[#2563EB] cursor-pointer" 
                                          />
                                       </td>
                                    )
                                 })}
                              </tr>
                           ))}
                        </tbody>
                     </table>
                </div>
                <div className="p-6 border-t border-[#E2E8F0] flex justify-end gap-3 bg-white rounded-b-[20px]">
                   <button onClick={() => setShowModal(false)} className="px-5 h-10 rounded-[10px] font-bold text-sm text-[#64748B] hover:bg-gray-100 transition">Cancel</button>
                   <button onClick={handleSave} className="flex items-center gap-2 px-6 h-10 rounded-[10px] bg-[#2563EB] text-white font-bold text-sm hover:bg-[#1D4ED8] transition shadow-md"><MdCheckCircle size={18}/> Save Role</button>
                </div>
             </div>
          </div>
       )}
    </div>
  );
};

export default TabRoles;
