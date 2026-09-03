import React, { useEffect, useState } from "react";
import Card from "components/card";
import { MdSearch, MdMoreVert, MdPeople } from "react-icons/md";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);

const TabDirectory = ({ onSelect, refreshTrigger }) => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
     const fetchEmployees = async () => {
        const { data, error } = await supabase.from('employees').select('*').order('created_at', { ascending: false });
        if (!error && data) {
           setEmployees(data);
        }
     };
     fetchEmployees();
  }, [refreshTrigger]);

  return (
    <div className="animate-fade-in">
       {/* Search & Filters */}
       <Card extra="p-4 border border-[#E2E8F0] mb-6 shadow-sm">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <div className="relative w-full lg:w-[300px]">
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#64748B] text-xl" />
              <input type="text" placeholder="Search employee, designation, phone..." className="w-full pl-10 pr-4 h-10 rounded-[10px] border border-[#E2E8F0] text-[13px] outline-none focus:border-[#2563EB] transition-colors" />
            </div>
            <div className="flex flex-wrap gap-2 w-full lg:w-auto">
              {["Department", "Designation", "Reporting Manager", "Employment Type", "Status", "Role"].map(f => (
                 <select key={f} className="h-10 px-3 rounded-full border border-[#E2E8F0] text-[12px] font-medium text-[#475569] bg-white outline-none hover:border-[#2563EB] cursor-pointer">
                    <option>{f}</option>
                 </select>
              ))}
            </div>
          </div>
        </Card>

        {/* Directory Table */}
        <Card extra="border border-[#E2E8F0] overflow-hidden shadow-sm">
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse min-w-[1000px]">
               <thead>
                 <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                   <th className="py-4 px-6 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Employee</th>
                   <th className="py-4 px-4 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Department</th>
                   <th className="py-4 px-4 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Designation</th>
                   <th className="py-4 px-4 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Contact</th>
                   <th className="py-4 px-4 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Status</th>
                   <th className="py-4 px-6 text-[11px] font-bold text-[#64748B] uppercase tracking-wider text-right">Actions</th>
                 </tr>
               </thead>
               <tbody>
                  {employees.length === 0 ? (
                     <tr>
                        <td colSpan="6" className="py-16 text-center">
                           <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-[#2563EB] text-3xl mx-auto mb-4"><MdPeople /></div>
                           <h3 className="text-[18px] font-bold text-[#0F172A] mb-2">No Employees Found</h3>
                           <p className="text-[14px] text-[#64748B] mb-4">Click "Add Employee" to start building your directory.</p>
                        </td>
                     </tr>
                  ) : (
                     employees.map((emp, i) => (
                        <tr key={i} className="border-b border-[#E2E8F0] hover:bg-gray-50 transition cursor-pointer" onClick={() => onSelect(emp)}>
                           <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#2563EB] font-bold text-[14px]">
                                    {emp.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase()}
                                 </div>
                                 <div>
                                    <p className="text-[14px] font-bold text-[#0F172A] leading-tight">{emp.name}</p>
                                    <p className="text-[12px] text-[#64748B]">EMP-{emp.id.split("-")[0].toUpperCase()}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="py-4 px-4 text-[13px] font-medium text-[#0F172A]">{emp.department}</td>
                           <td className="py-4 px-4 text-[13px] text-[#64748B]">{emp.designation}</td>
                           <td className="py-4 px-4">
                              <p className="text-[13px] text-[#0F172A]">{emp.phone}</p>
                              <p className="text-[12px] text-[#64748B]">{emp.email}</p>
                           </td>
                           <td className="py-4 px-4">
                              <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-[11px] font-bold border border-green-200">
                                 {emp.status}
                              </span>
                           </td>
                           <td className="py-4 px-6 text-right">
                              <button className="text-gray-400 hover:text-[#0F172A] transition p-2 rounded-lg hover:bg-gray-200">
                                 <MdMoreVert size={20} />
                              </button>
                           </td>
                        </tr>
                     ))
                  )}
               </tbody>
             </table>
           </div>
        </Card>
    </div>
  );
};

export default TabDirectory;
