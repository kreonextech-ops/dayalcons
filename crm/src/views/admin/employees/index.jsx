import React, { useState, useEffect } from "react";
import Card from "components/card";
import { 
  MdSearch, MdAdminPanelSettings, MdPeople, MdDomain, 
  MdEngineering, MdCloudUpload, MdAdd, MdClose, MdChevronRight, MdChevronLeft, MdCheckCircle, MdAutorenew
} from "react-icons/md";
import EmployeeDetail from "./EmployeeDetail";
import { createClient } from "@supabase/supabase-js";

// Sub-components
import TabDirectory from "./components/TabDirectory";
import TabDepartments from "./components/TabDepartments";
import TabDesignations from "./components/TabDesignations";
import TabRoles from "./components/TabRoles";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);

const Employees = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState("Employees");
  const [showNewModal, setShowNewModal] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // KPIs
  const kpis = [
    { title: "Total Employees", value: "—", icon: <MdPeople /> },
    { title: "System Users", value: "—", icon: <MdAdminPanelSettings /> },
    { title: "Departments", value: "—", icon: <MdDomain /> },
    { title: "Designations", value: "—", icon: <MdEngineering /> },
  ];

  // New Employee State
  const [newEmp, setNewEmp] = useState({
     fullName: "", empId: "", phone: "", whatsapp: "", email: "", address: "", dob: "", joinDate: "", emergency: "",
     department: "", designation: "", manager: "", location: "", empType: "",
     loginEmail: "", loginPassword: "", role: "", status: "Available", allowLogin: false,
     permissions: {}
  });

  const [availableDepts, setAvailableDepts] = useState([]);
  const [availableDesigs, setAvailableDesigs] = useState([]);

  useEffect(() => {
     const depts = localStorage.getItem("dayal_departments");
     if (depts) setAvailableDepts(JSON.parse(depts));
     const desigs = localStorage.getItem("dayal_designations");
     if (desigs) setAvailableDesigs(JSON.parse(desigs));
  }, [showNewModal]);

  const generateAutoId = () => {
     const randomNum = Math.floor(1000 + Math.random() * 9000);
     setNewEmp({ ...newEmp, empId: `EMP-${randomNum}` });
  };

  const handlePermissionToggle = (module, perm) => {
     setNewEmp(prev => {
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

  const handleCompleteOnboarding = async () => {
     try {
       const payload = {
         name: newEmp.fullName || "Unnamed Employee",
         email: newEmp.loginEmail || newEmp.email,
         password: newEmp.loginPassword || "password123",
         department: newEmp.department || "Unassigned",
         designation: newEmp.designation || "Unassigned",
         role: newEmp.role || "Employee",
         permissions: newEmp.permissions || {},
         phone: newEmp.phone || "",
         status: newEmp.status || "Active",
         join_date: newEmp.joinDate || new Date().toISOString()
       };

       let error;
       if (newEmp.id) {
          // Update
          const res = await supabase.from('employees').update(payload).eq('id', newEmp.id);
          error = res.error;
       } else {
          // Insert
          const res = await supabase.from('employees').insert([payload]);
          error = res.error;
       }

       if (error) {
         console.error("Error saving employee:", error);
         alert("Error saving employee: " + error.message);
         return;
       }
       
       // Reset and close
       setNewEmp({
          id: null, fullName: "", empId: "", phone: "", whatsapp: "", email: "", address: "", dob: "", joinDate: "", emergency: "",
          department: "", designation: "", manager: "", location: "", empType: "",
          loginEmail: "", loginPassword: "", role: "", status: "Available", allowLogin: false,
          permissions: {}
       });
       setModalStep(1);
       setShowNewModal(false);
       setRefreshTrigger(prev => prev + 1); // trigger reload in TabDirectory
       
       if (newEmp.id && selectedEmployee) {
          // If we edited the currently viewed employee, update the view (basic mock)
          setSelectedEmployee({ ...selectedEmployee, ...payload });
       }
     } catch (err) {
       console.error("Unexpected error:", err);
     }
  };

  const handleEditProfile = (emp) => {
      setNewEmp({
         id: emp.id,
         fullName: emp.name || "", 
         empId: `EMP-${emp.id.split("-")[0].toUpperCase()}`, 
         email: emp.email || "", 
         loginEmail: emp.email || "",
         loginPassword: emp.password || "",
         department: emp.department || "", 
         designation: emp.designation || "", 
         role: emp.role || "Employee",
         permissions: emp.permissions || {},
         allowLogin: true, // assume true if they have creds
         // fill defaults for others
         phone: emp.phone || "", whatsapp: "", address: "", dob: "", joinDate: emp.join_date || "", emergency: "", manager: "", location: "", empType: "", status: emp.status || "Active"
      });
      setModalStep(1);
      setShowNewModal(true);
  };

  // Instead of early return, we render EmployeeDetail in place of the main view
  // but we still need the modal to be able to render on top of it.
  
  const modulesForPermissions = [
     "Dashboard", "Leads", "Clients", "Design Services", "Execution Projects", "Tasks", "Finance", "Documents", "Vendors", "Employees"
  ];

  const renderContent = () => {
     if (selectedEmployee) {
        return <EmployeeDetail employee={selectedEmployee} onBack={() => setSelectedEmployee(null)} onEditProfile={() => handleEditProfile(selectedEmployee)} />;
     }
     
     return (
       <>
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 mt-8 md:mt-2">
          <div>
            <p className="text-[12px] font-medium text-[#64748B] mb-1">Pages / HR & Workforce</p>
            <h1 className="text-[32px] font-bold text-[#0F172A] leading-tight">Employees</h1>
            <p className="text-[14px] text-[#64748B] mt-1">Manage workforce, departments, permissions, attendance, workload, and assignments across the company.</p>
          </div>
          <div className="flex gap-3 z-10 relative">
            <button className="h-10 px-4 rounded-[12px] border border-[#E2E8F0] bg-white text-[14px] font-bold text-[#0F172A] hover:bg-gray-50 flex items-center gap-2 transition">
              <MdCloudUpload /> Import / Export
            </button>
            <button onClick={() => setShowNewModal(true)} className="h-10 px-5 rounded-[12px] bg-[#2563EB] text-[14px] font-bold text-white hover:bg-[#1D4ED8] flex items-center gap-2 transition shadow-sm">
              <MdAdd /> Add Employee
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {kpis.map((kpi, i) => (
             <Card key={i} extra="p-3 border border-[#E2E8F0] shadow-sm hover:shadow-md transition">
                <div className="flex items-center gap-2 mb-2">
                   <div className="text-[#2563EB] bg-blue-50 p-1.5 rounded-lg text-lg">{kpi.icon}</div>
                   <p className="text-[10px] font-bold text-[#64748B] uppercase leading-tight">{kpi.title}</p>
                </div>
                <p className={`text-[18px] font-bold text-[#0F172A]`}>{kpi.value}</p>
             </Card>
          ))}
        </div>

        {/* Inner Tabs */}
        <div className="flex gap-4 mb-6 border-b border-[#E2E8F0] pb-2">
           {["Employees", "Departments", "Designations", "Roles & Permissions"].map(tab => (
              <button 
                 key={tab}
                 onClick={() => setActiveTab(tab)}
                 className={`pb-2 text-[14px] font-bold transition-all relative ${
                    activeTab === tab ? 'text-[#2563EB]' : 'text-[#64748B] hover:text-[#0F172A]'
                 }`}
              >
                 {tab}
                 {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB] rounded-t-full"></div>}
              </button>
           ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[500px]">
           {activeTab === "Employees" && <TabDirectory onSelect={(e) => setSelectedEmployee(e)} refreshTrigger={refreshTrigger} />}
           {activeTab === "Departments" && <TabDepartments />}
           {activeTab === "Designations" && <TabDesignations />}
           {activeTab === "Roles & Permissions" && <TabRoles />}
        </div>
       </>
     );
  };

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen pt-12 pb-24 font-sans text-[#475569]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {renderContent()}
      </div>

      {/* Add Employee Modal (5 steps) */}
      {showNewModal && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-[980px] bg-white rounded-[20px] shadow-2xl flex flex-col max-h-[90vh]">
               {/* Header */}
               <div className="p-6 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC] rounded-t-[20px]">
                  <div>
                    <h2 className="text-[20px] font-bold text-[#0F172A]">New Employee Registration</h2>
                    <p className="text-[13px] text-[#64748B] mt-1">Step {modalStep} of 5</p>
                  </div>
                  <button onClick={() => setShowNewModal(false)} className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center text-gray-500 transition">
                     <MdClose size={20} />
                  </button>
               </div>

               {/* Body */}
               <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
                  
                  {/* Step 1: Personal */}
                  {modalStep === 1 && (
                     <div className="animate-fade-in max-w-4xl mx-auto">
                        <h3 className="text-[18px] font-bold text-[#0F172A] mb-6">Personal Information</h3>
                        <div className="flex gap-8">
                           <div className="w-32 h-32 bg-gray-100 rounded-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50 transition">
                              <MdAdd size={24} />
                              <span className="text-xs font-bold mt-1">Upload Photo</span>
                           </div>
                           <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5">
                              <div><label className="block text-[11px] font-bold text-[#475569] mb-1.5 uppercase">Full Name *</label><input type="text" value={newEmp.fullName} onChange={(e) => setNewEmp({...newEmp, fullName: e.target.value})} className="w-full h-11 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none" /></div>
                              <div>
                                 <label className="block text-[11px] font-bold text-[#475569] mb-1.5 uppercase">Employee ID *</label>
                                 <div className="flex gap-2">
                                    <input type="text" value={newEmp.empId} onChange={(e) => setNewEmp({...newEmp, empId: e.target.value})} className="flex-1 h-11 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none font-bold" placeholder="EMP-XXX" />
                                    <button onClick={generateAutoId} className="h-11 px-3 bg-gray-100 border border-gray-200 rounded-[10px] text-[12px] font-bold text-[#0F172A] hover:bg-gray-200 transition flex items-center gap-1"><MdAutorenew /> Auto</button>
                                 </div>
                              </div>
                              <div><label className="block text-[11px] font-bold text-[#475569] mb-1.5 uppercase">Phone Number *</label><input type="text" value={newEmp.phone} onChange={(e) => setNewEmp({...newEmp, phone: e.target.value})} className="w-full h-11 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none" /></div>
                              <div><label className="block text-[11px] font-bold text-[#475569] mb-1.5 uppercase">WhatsApp</label><input type="text" value={newEmp.whatsapp} onChange={(e) => setNewEmp({...newEmp, whatsapp: e.target.value})} className="w-full h-11 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none" /></div>
                              <div className="md:col-span-2"><label className="block text-[11px] font-bold text-[#475569] mb-1.5 uppercase">Email Address</label><input type="email" value={newEmp.email} onChange={(e) => setNewEmp({...newEmp, email: e.target.value})} className="w-full h-11 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none" /></div>
                              <div className="md:col-span-2"><label className="block text-[11px] font-bold text-[#475569] mb-1.5 uppercase">Residential Address</label><input type="text" value={newEmp.address} onChange={(e) => setNewEmp({...newEmp, address: e.target.value})} className="w-full h-11 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none" /></div>
                              <div><label className="block text-[11px] font-bold text-[#475569] mb-1.5 uppercase">Date of Birth</label><input type="date" value={newEmp.dob} onChange={(e) => setNewEmp({...newEmp, dob: e.target.value})} className="w-full h-11 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none" /></div>
                              <div><label className="block text-[11px] font-bold text-[#475569] mb-1.5 uppercase">Emergency Contact</label><input type="text" value={newEmp.emergency} onChange={(e) => setNewEmp({...newEmp, emergency: e.target.value})} className="w-full h-11 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none" /></div>
                           </div>
                        </div>
                     </div>
                  )}

                  {/* Step 2: Organization (Dynamic) */}
                  {modalStep === 2 && (
                     <div className="animate-fade-in max-w-2xl mx-auto">
                        <h3 className="text-[18px] font-bold text-[#0F172A] mb-6 text-center">Organization Placement</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-[#F8FAFC] p-6 rounded-[16px] border border-[#E2E8F0]">
                           <div className="md:col-span-2">
                              <label className="block text-[11px] font-bold text-[#475569] mb-1.5 uppercase">Department</label>
                              <input type="text" list="dept-list" value={newEmp.department} onChange={(e) => setNewEmp({...newEmp, department: e.target.value})} placeholder="Type or select a department..." className="w-full h-11 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none bg-white focus:border-[#2563EB]"/>
                              <datalist id="dept-list">
                                 {availableDepts.map(d => <option key={d.name} value={d.name} />)}
                              </datalist>
                           </div>
                           <div className="md:col-span-2">
                              <label className="block text-[11px] font-bold text-[#475569] mb-1.5 uppercase">Designation</label>
                              <input type="text" list="desig-list" value={newEmp.designation} onChange={(e) => setNewEmp({...newEmp, designation: e.target.value})} placeholder="Type or select a designation..." className="w-full h-11 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none bg-white focus:border-[#2563EB]"/>
                              <datalist id="desig-list">
                                 {availableDesigs.map(d => <option key={d.title} value={d.title} />)}
                              </datalist>
                           </div>

                           <div>
                              <label className="block text-[11px] font-bold text-[#475569] mb-1.5 uppercase">Employment Type</label>
                              <select value={newEmp.empType} onChange={(e) => setNewEmp({...newEmp, empType: e.target.value})} className="w-full h-11 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none bg-white focus:border-[#2563EB]">
                                 <option value="">Select Type</option>
                                 <option value="Full-time">Full-time</option>
                                 <option value="Part-time">Part-time</option>
                                 <option value="Contract">Contract</option>
                              </select>
                           </div>
                           <div className="md:col-span-2"><label className="block text-[11px] font-bold text-[#475569] mb-1.5 uppercase">Joining Date</label><input type="date" value={newEmp.joinDate} onChange={(e) => setNewEmp({...newEmp, joinDate: e.target.value})} className="w-full h-11 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none focus:border-[#2563EB]" /></div>
                        </div>
                     </div>
                  )}

                  {/* Step 3: Login Credentials */}
                    {modalStep === 3 && (
                       <div className="animate-fade-in max-w-2xl mx-auto">
                          <h3 className="text-[18px] font-bold text-[#0F172A] mb-6 text-center">System Access & Login</h3>
                          <div className="bg-[#F8FAFC] p-6 rounded-[16px] border border-[#E2E8F0] space-y-6">
                             <p className="text-[14px] text-gray-500 mb-4">Every employee requires login credentials. Their access will automatically be restricted to only the items they are assigned to.</p>
                             <div className="animate-fade-in space-y-5 pt-4 border-t border-[#E2E8F0]">
                                <div><label className="block text-[11px] font-bold text-[#475569] mb-1.5 uppercase">Login ID / Email *</label><input type="email" value={newEmp.loginEmail} onChange={(e) => setNewEmp({...newEmp, loginEmail: e.target.value})} placeholder="employee@dayalcrm.com" className="w-full h-11 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none focus:border-[#2563EB]" /></div>
                                <div>
                                   <label className="block text-[11px] font-bold text-[#475569] mb-1.5 uppercase">Secure Password *</label>
                                   <input type="text" value={newEmp.loginPassword} onChange={(e) => setNewEmp({...newEmp, loginPassword: e.target.value})} placeholder="Enter password" className="w-full h-11 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none focus:border-[#2563EB]" />
                                </div>
                             </div>
                          </div>
                       </div>
                    )}

                    {/* Step 4: Finish */}
                  {modalStep === 4 && (
                     <div className="animate-fade-in max-w-md mx-auto text-center pt-8">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                           <MdCheckCircle size={40} />
                        </div>
                        <h3 className="text-[24px] font-bold text-[#0F172A] mb-2">Ready to onboard</h3>
                        <p className="text-[14px] text-[#64748B] mb-8">All details and granular permissions have been configured. Click below to add this employee to the CRM database.</p>
                     </div>
                  )}

               </div>

               {/* Footer */}
               <div className="p-6 border-t border-[#E2E8F0] flex justify-between items-center bg-white rounded-b-[20px]">
                  <button 
                     onClick={() => setModalStep(modalStep - 1)} 
                     disabled={modalStep === 1}
                     className={`flex items-center gap-1 h-10 px-4 rounded-[12px] font-bold text-sm transition ${modalStep === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-[#64748B] hover:bg-gray-100'}`}
                  >
                     <MdChevronLeft size={20} /> Back
                  </button>
                  <div className="flex gap-2">
                     {[1,2,3,4].map(dot => (
                        <div key={dot} className={`h-2.5 rounded-full transition-all duration-300 ${modalStep === dot ? 'w-8 bg-[#2563EB]' : 'w-2.5 bg-gray-200'}`}></div>
                     ))}
                  </div>
                  {modalStep < 4 ? (
                     <button onClick={() => setModalStep(modalStep + 1)} className="flex items-center gap-1 h-10 px-6 rounded-[12px] bg-[#2563EB] text-white font-bold text-sm hover:bg-[#1D4ED8] transition shadow-md">
                        Next <MdChevronRight size={20} />
                     </button>
                  ) : (
                     <button onClick={handleCompleteOnboarding} className="flex items-center gap-2 h-10 px-8 rounded-[12px] bg-[#16A34A] text-white font-bold text-sm hover:bg-green-700 transition shadow-md">
                        <MdCheckCircle size={18} /> Complete Onboarding
                     </button>
                  )}
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default Employees;
