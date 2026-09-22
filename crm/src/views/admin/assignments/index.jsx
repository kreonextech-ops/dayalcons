import React, { useState, useEffect } from 'react';
import Card from 'components/card';
import { MdOutlineAssignment, MdAdd, MdPeople, MdFolder, MdBusinessCenter, MdPerson, MdCheckCircle, MdAccessTime } from 'react-icons/md';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://gdzligxryodasaxnhdco.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg';
const supabase = createClient(supabaseUrl, supabaseKey);

const AssignmentWorkflow = () => {
   const [user, setUser] = useState(null);
   const [isAdmin, setIsAdmin] = useState(false);
   const [employees, setEmployees] = useState([]);
   const [selectedEmployee, setSelectedEmployee] = useState(null);
   const [loading, setLoading] = useState(true);

   const [activeTab, setActiveTab] = useState("My Assignments");

   const [assignType, setAssignType] = useState('Task');
   const [assignRecordId, setAssignRecordId] = useState('');
   const [assignEmployeeId, setAssignEmployeeId] = useState('');
   const [assignTitle, setAssignTitle] = useState('');
   const [assignDesc, setAssignDesc] = useState('');
   const [assignDueDate, setAssignDueDate] = useState('');
   const [availableRecords, setAvailableRecords] = useState([]);
   const [searchRecord, setSearchRecord] = useState('');

   useEffect(() => {
      const userStr = sessionStorage.getItem('dayal_user');
      const u = userStr ? JSON.parse(userStr) : null;
      setUser(u);
      const isAdm = u?.role === 'Admin' || u?.role === 'CRO';
      setIsAdmin(isAdm);

      if (isAdm) {
         fetchEmployees();
      } else {
         setSelectedEmployee(u);
         setLoading(false);
      }
   }, []);

   const fetchEmployees = async () => {
      setLoading(true);
      const { data } = await supabase.from('employees').select('*').order('name');
      if (data) setEmployees(data);
      setLoading(false);
   };

   useEffect(() => {
      const fetchRecords = async () => {
         if (assignType === 'Task' || assignType === 'Follow Up') {
            setAvailableRecords([]);
            return;
         }
         let table = 'leads';
         let cols = 'id, name, phone';
         if (assignType === 'Client') { table = 'clients'; cols = 'id, name'; }
         if (assignType === 'Consultancy Service') { table = 'services'; cols = 'id, title'; }
         if (assignType === 'Construction Project') { table = 'projects'; cols = 'id, title, name'; }

         const { data, error } = await supabase.from(table).select(cols);
         if (data) {
             setAvailableRecords(data.map(d => ({ 
                 id: d.id, 
                 name: (d.title || d.name || '') + (d.phone ? ` - ${d.phone}` : '') 
             })));
         } else {
             console.error("Fetch error:", error);
         }
      };
      fetchRecords();
   }, [assignType]);

   const filteredRecords = availableRecords.filter(r => r.name && r.name.toLowerCase().includes(searchRecord.toLowerCase()));

   const handleAssign = async () => {
      if (!assignEmployeeId) { alert('Please select an employee.'); return; }
      
      if (assignType === 'Task' || assignType === 'Follow Up') {
         if (!assignTitle) { alert('Please enter a title.'); return; }
         const payload = {
            name: assignTitle,
            title: assignTitle,
            description: assignDesc,
            assignee_id: assignEmployeeId,
            creator_id: user.id,
            status: 'To Do',
            category: 'General',
            custom_category: assignType === 'Follow Up' ? 'Follow Up' : null,
            due_date: assignDueDate ? new Date(assignDueDate).toISOString() : null,
         };
         const { error } = await supabase.from('tasks').insert([payload]);
         if (error) alert('Error: ' + error.message);
         else alert(assignType + ' assigned successfully!');
      } else {
         if (!assignRecordId) { alert('Please select a record.'); return; }
         let table = 'leads';
         if (assignType === 'Client') table = 'clients';
         if (assignType === 'Consultancy Service') table = 'services';
         if (assignType === 'Construction Project') table = 'projects';

         const { data: recData } = await supabase.from(table).select('assigned_to').eq('id', assignRecordId).single();
         let current = (recData?.assigned_to || '').split(',').filter(Boolean);
         if (!current.includes(assignEmployeeId)) current.push(assignEmployeeId);

         const { error } = await supabase.from(table).update({ assigned_to: current.join(',') }).eq('id', assignRecordId);
         if (error) alert('Error: ' + error.message);
         else alert('Assigned successfully!');
      }
      
      setAssignTitle(''); setAssignDesc(''); setAssignRecordId(''); setSearchRecord('');
   };

   if (loading) return <div>Loading...</div>;

   return (
      <div className="mt-3">
         <h1 className="text-[32px] font-bold text-[#0F172A] dark:text-white mb-6">Assignment Workflow</h1>

         <Card extra="w-full p-6 mb-8 border-2 border-brand-500 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-brand-500"></div>
            <h2 className="text-xl font-bold text-navy-700 mb-2">Quick Assign & Delegate</h2>
            <p className="text-sm text-gray-500 mb-6">Easily assign new Leads, Clients, Projects, or create new Tasks/Follow-ups with detailed instructions.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
               <div>
                  <label className="text-xs font-bold text-gray-700 uppercase mb-1 block">What to Assign?</label>
                  <select value={assignType} onChange={e => { setAssignType(e.target.value); setAssignRecordId(''); }} className="w-full h-11 px-3 border border-gray-300 rounded-lg outline-none">
                     <option>Task</option>
                     <option>Follow Up</option>
                     <option>Lead</option>
                     <option>Client</option>
                     <option>Consultancy Service</option>
                     <option>Construction Project</option>
                  </select>
               </div>
               
               {assignType === 'Task' || assignType === 'Follow Up' ? (
                  <div className="md:col-span-2 space-y-4">
                     <div>
                        <label className="text-xs font-bold text-gray-700 uppercase mb-1 block">Title / Subject *</label>
                        <input type="text" value={assignTitle} onChange={e => setAssignTitle(e.target.value)} placeholder="What needs to be done?" className="w-full h-11 px-3 border border-gray-300 rounded-lg outline-none" />
                     </div>
                     <div>
                        <label className="text-xs font-bold text-gray-700 uppercase mb-1 block">Description & Instructions</label>
                        <textarea value={assignDesc} onChange={e => setAssignDesc(e.target.value)} rows="3" placeholder="Provide full details and instructions here..." className="w-full p-3 border border-gray-300 rounded-lg outline-none resize-none"></textarea>
                     </div>
                     <div>
                        <label className="text-xs font-bold text-gray-700 uppercase mb-1 block">Due Date</label>
                        <input type="date" value={assignDueDate} onChange={e => setAssignDueDate(e.target.value)} className="w-full h-11 px-3 border border-gray-300 rounded-lg outline-none" />
                     </div>
                  </div>
               ) : (
                  <div className="md:col-span-2 relative">
                     <label className="text-xs font-bold text-gray-700 uppercase mb-1 block">Search {assignType} *</label>
                     <input type="text" value={searchRecord} onChange={e => setSearchRecord(e.target.value)} placeholder={`Type to search ${assignType}s...`} className="w-full h-11 px-3 border border-gray-300 rounded-lg outline-none" />
                     {searchRecord && !assignRecordId && (
                        <div className="absolute w-full mt-1 bg-white border border-gray-200 shadow-lg rounded-lg max-h-40 overflow-y-auto z-10">
                           {filteredRecords.map(r => (
                              <div key={r.id} onClick={() => { setAssignRecordId(r.id); setSearchRecord(r.name); }} className="px-4 py-2 hover:bg-brand-50 cursor-pointer text-sm text-gray-700">{r.name}</div>
                           ))}
                        </div>
                     )}
                  </div>
               )}

               <div>
                  <label className="text-xs font-bold text-gray-700 uppercase mb-1 block">Assign To *</label>
                  <select value={assignEmployeeId} onChange={e => setAssignEmployeeId(e.target.value)} className="w-full h-11 px-3 border border-gray-300 rounded-lg outline-none">
                     <option value="">Select Employee</option>
                     {isAdmin ? employees.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.name}</option>
                     )) : (
                        <option value={user?.id}>Myself ({user?.name})</option>
                     )}
                  </select>
                  <button onClick={handleAssign} className="w-full mt-4 bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 rounded-lg shadow-md transition-colors">
                     Assign Now
                  </button>
               </div>
            </div>
         </Card>

         {!selectedEmployee && isAdmin ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {employees.map(emp => (
                  <Card key={emp.id} extra="p-6 cursor-pointer hover:shadow-lg transition-shadow border border-gray-100" onClick={() => setSelectedEmployee(emp)}>
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center text-brand-500 font-bold text-xl">
                           {emp.name.charAt(0)}
                        </div>
                        <div>
                           <h3 className="font-bold text-navy-700">{emp.name}</h3>
                           <p className="text-sm text-gray-500">{emp.role}</p>
                        </div>
                     </div>
                     <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-sm">
                        <span className="text-brand-500 font-bold hover:underline">View Workload &rarr;</span>
                     </div>
                  </Card>
               ))}
            </div>
         ) : (
            <div>
               {isAdmin && (
                  <button onClick={() => setSelectedEmployee(null)} className="mb-4 text-sm font-bold text-gray-500 hover:text-brand-500 flex items-center gap-1">
                     &larr; Back to all employees
                  </button>
               )}
               
               <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-navy-700">
                     {isAdmin ? `Workload: ${selectedEmployee.name}` : `My Workboard`}
                  </h2>
                  {!isAdmin && (
                     <div className="flex gap-2">
                        <button onClick={() => setActiveTab("My Assignments")} className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${activeTab === 'My Assignments' ? 'bg-brand-500 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>My Assignments</button>
                        <button onClick={() => setActiveTab("Delegated by Me")} className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${activeTab === 'Delegated by Me' ? 'bg-brand-500 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>Delegated by Me</button>
                     </div>
                  )}
               </div>

               <EmployeeWorkload employeeId={selectedEmployee.id} employeeRole={selectedEmployee.role} tab={activeTab} />
            </div>
         )}
      </div>
   );
};

const EmployeeWorkload = ({ employeeId, employeeRole, tab }) => {
   const [data, setData] = useState({ leads: [], clients: [], services: [], projects: [], tasks: [], followUps: [] });
   const [expanded, setExpanded] = useState(null);

   useEffect(() => {
      const fetchData = async () => {
         const isDelegated = tab === 'Delegated by Me';
         const results = { leads: [], clients: [], services: [], projects: [], tasks: [], followUps: [] };

         let tQuery = supabase.from('tasks').select('*');
         if (isDelegated) {
            tQuery = tQuery.eq('creator_id', employeeId).neq('assignee_id', employeeId);
         } else {
            tQuery = tQuery.eq('assignee_id', employeeId);
         }
         const { data: tData } = await tQuery;
         
         if (tData) {
            results.tasks = tData.filter(t => t.custom_category !== 'Follow Up');
            results.followUps = tData.filter(t => t.custom_category === 'Follow Up');
         }

         if (!isDelegated) {
            const orQuery = `assigned_to.ilike.%${employeeId}%${employeeRole ? `,assigned_to.ilike.%${employeeRole}%` : ''}`;
            const [lRes, cRes, sRes, pRes] = await Promise.all([
               supabase.from('leads').select('*').or(orQuery),
               supabase.from('clients').select('*').or(orQuery),
               supabase.from('services').select('*').or(orQuery),
               supabase.from('projects').select('*').or(orQuery)
            ]);
            if (lRes.data) results.leads = lRes.data;
            if (cRes.data) results.clients = cRes.data;
            if (sRes.data) results.services = sRes.data;
            if (pRes.data) results.projects = pRes.data;
         }

         setData(results);
      };
      fetchData();
   }, [employeeId, tab]);

   const CategoryBlock = ({ title, items, categoryKey, linkPath }) => {
      const isExpanded = expanded === categoryKey;
      const displayItems = isExpanded ? items : items.slice(0, 5);

      if (items.length === 0) return null;

      return (
         <Card extra="w-full p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
               <h3 className="text-lg font-bold text-navy-700 flex items-center gap-2">
                  {title} <span className="bg-brand-50 text-brand-500 text-xs px-2 py-0.5 rounded-full">{items.length}</span>
               </h3>
            </div>
            <div className="flex flex-col gap-3">
               {displayItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-100">
                     <div>
                        <p className="text-sm font-bold text-gray-800">{item.name || item.title}</p>
                        <p className="text-xs text-gray-500">{item.status || 'Active'}</p>
                     </div>
                     <a href={`/admin/${linkPath}?${linkPath.replace(/s$/, "")}Id=${item.id}`} className="text-xs font-bold text-brand-500 bg-white border border-gray-200 px-3 py-1.5 rounded-md hover:bg-brand-50 transition-colors">
                        View &rarr;
                     </a>
                  </div>
               ))}
            </div>
            {items.length > 5 && (
               <button onClick={() => setExpanded(isExpanded ? null : categoryKey)} className="w-full mt-4 py-2 border-t border-gray-100 text-sm font-bold text-brand-500 hover:text-brand-600">
                  {isExpanded ? 'Show Less' : `View All ${items.length} ${title}`}
               </button>
            )}
         </Card>
      );
   };

   const total = Object.values(data).reduce((acc, curr) => acc + curr.length, 0);

   if (total === 0) return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100 mt-6">
         <p className="text-gray-500 font-bold">No assigned work found in this view.</p>
      </div>
   );

   return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div>
            <CategoryBlock title="Tasks" items={data.tasks} categoryKey="tasks" linkPath="tasks" />
            <CategoryBlock title="Leads" items={data.leads} categoryKey="leads" linkPath="crm" />
            <CategoryBlock title="Consultancy Services" items={data.services} categoryKey="services" linkPath="services" />
         </div>
         <div>
            <CategoryBlock title="Follow Ups" items={data.followUps} categoryKey="followUps" linkPath="followups" />
            <CategoryBlock title="Clients" items={data.clients} categoryKey="clients" linkPath="clients" />
            <CategoryBlock title="Construction Projects" items={data.projects} categoryKey="projects" linkPath="projects" />
         </div>
      </div>
   );
};

export default AssignmentWorkflow;
