import React, { useState } from "react";
import { 
  MdArrowBack, MdWork, MdAssignment, MdEvent,
  MdTimeline, MdSecurity, MdFolder, MdCheckCircle, MdEdit, MdWarning
} from "react-icons/md";
import Card from "components/card";

// Tab Components (placeholders to be implemented)
import TabOverview from "./components/TabOverview";
import TabAssignedWork from "./components/TabAssignedWork";
import TabMyTasks from "./components/TabMyTasks";
import TabActivity from "./components/TabActivity";
import TabDocuments from "./components/TabDocuments";

const EmployeeDetail = ({ employee, onBack, onEditProfile }) => {
  const [activeTab, setActiveTab] = useState("Overview");

  // Mock initial data based on selection or default
  const [empData] = useState({
    id: employee?.id || "EMP-XXX",
    name: employee?.name || "Enter Employee Name",
    department: employee?.department || "Select Department",
    designation: employee?.designation || "Select Designation",
    manager: "—",
    phone: employee?.phone || "—",
    email: employee?.email || "—",
    workload: 0,
    performance: 0
  });

  const tabs = ["Overview", "Assigned Work", "Tasks", "Activity", "Documents"];

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] p-4 sm:p-8 font-sans pb-24">
      {/* Back Navigation */}
      <div className="mb-6 flex items-center gap-2 text-sm text-[#64748B]">
        <button onClick={onBack} className="flex items-center gap-2 hover:text-[#2563EB] transition">
          <MdArrowBack className="h-5 w-5" />
          <span className="font-semibold">Back to Employees</span>
        </button>
      </div>

      {/* Hero Card */}
      <div className="rounded-[20px] bg-white p-8 shadow-sm border border-[#E2E8F0] mb-6 flex flex-col md:flex-row justify-between items-start md:items-center relative">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 text-3xl border-4 border-white shadow-md">
             {empData.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
             <div className="flex items-center gap-3 mb-1">
               <h1 className="text-[28px] font-bold text-[#0F172A] tracking-tight">{empData.name}</h1>
               <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-md text-[12px] font-bold border border-gray-200">
                  EMP-{empData.id.split("-")[0].toUpperCase()}
               </span>
            </div>
            <p className="text-[14px] font-medium text-[#2563EB] mb-2">{empData.designation} <span className="text-gray-400">|</span> {empData.department}</p>
            <p className="text-[13px] text-[#64748B]">Reporting to: <b>{empData.manager}</b></p>
          </div>
        </div>
        <div className="mt-8 flex flex-col items-end md:mt-0 gap-4">
          <div className="flex gap-2">
             <button onClick={onEditProfile} className="h-9 px-4 rounded-lg border border-[#E2E8F0] text-[13px] font-bold text-[#0F172A] hover:bg-gray-50 flex items-center gap-2"><MdEdit /> Edit Profile</button>
             <button className="h-9 px-4 rounded-lg bg-[#0F172A] text-[13px] font-bold text-white hover:bg-gray-800 shadow-sm">Assign Work</button>
          </div>
          <div className="flex gap-8 text-right mt-2">
             <div>
                <p className="text-[11px] font-bold text-[#64748B] uppercase mb-1">Current Workload</p>
                <div className="flex items-center gap-2">
                   <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className={`h-full ${empData.workload > 90 ? 'bg-red-500' : empData.workload > 70 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{width: `${empData.workload}%`}}></div>
                   </div>
                   <p className="text-[16px] font-bold text-[#0F172A]">{empData.workload}%</p>
                </div>
             </div>
             <div>
                <p className="text-[11px] font-bold text-[#64748B] uppercase mb-1">Performance</p>
                <p className="text-[16px] font-bold text-[#10B981]">{empData.performance}/100</p>
             </div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col xl:flex-row gap-8">
        
        {/* Left Content (100% or 75%) */}
        <div className="w-full xl:w-[75%]">
          {/* Tabs */}
          <div className="sticky top-0 z-10 flex gap-2 overflow-x-auto bg-[#F8FAFC] py-4 border-b border-[#E2E8F0] mb-6 custom-scrollbar">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-[12px] px-5 py-2.5 text-sm font-bold transition whitespace-nowrap ${
                  activeTab === tab 
                  ? 'bg-[#2563EB] text-white shadow-md' 
                  : 'text-[#64748B] hover:bg-white border border-transparent hover:border-[#E2E8F0]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[600px]">
            {activeTab === "Overview" && <TabOverview empData={empData} />}
            {activeTab === "Assigned Work" && <TabAssignedWork employee={employee} />}
            {activeTab === "Tasks" && <TabMyTasks employee={employee} />}
        {activeTab === "Activity" && <TabActivity employee={employee} />}
        {activeTab === "Documents" && <TabDocuments employee={employee} />}
          </div>
        </div>

        {/* Right Sidebar (25%) */}
        <div className="w-full xl:w-[25%] relative">
          <div className="sticky top-6 flex flex-col gap-6">

            <Card extra="p-6 shadow-sm border border-[#E2E8F0]">
               <h3 className="text-[12px] font-bold text-[#64748B] mb-4 uppercase tracking-widest flex items-center gap-2"><MdWarning className="text-yellow-500 text-lg"/> Capacity Meter</h3>
               <div className="space-y-4 mb-4">
                 <p className="text-[13px] text-[#475569]">This employee is operating at <b>{empData.workload}%</b> capacity based on active assignments.</p>
                 <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500" style={{width: `${empData.workload}%`}}></div>
                 </div>
               </div>
               <button className="w-full h-10 rounded-[10px] bg-white border border-[#E2E8F0] text-[13px] font-bold text-[#2563EB] hover:bg-blue-50 transition">Adjust Workload</button>
            </Card>

            <Card extra="p-6 shadow-sm border border-[#E2E8F0]">
               <h3 className="text-[12px] font-bold text-[#64748B] mb-4 uppercase tracking-widest">Contact Info</h3>
               <div className="space-y-4">
                  <div>
                     <p className="text-[11px] font-bold text-[#64748B] uppercase">Phone</p>
                     <p className="text-[13px] font-medium text-[#0F172A]">{empData.phone}</p>
                  </div>
                  <div>
                     <p className="text-[11px] font-bold text-[#64748B] uppercase">Email</p>
                     <p className="text-[13px] font-medium text-[#0F172A]">{empData.email}</p>
                  </div>
               </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;
