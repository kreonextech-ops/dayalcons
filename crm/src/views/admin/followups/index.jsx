import React, { useState, useEffect } from "react";
import Card from "components/card";
import { createClient } from "@supabase/supabase-js";
import { 
  MdAdd, MdClose, MdCheckCircle, MdAccessTime, MdNotificationsActive,
  MdWhatshot, MdWbSunny, MdAcUnit, MdPerson, MdBusinessCenter
} from "react-icons/md";
import { useNavigate } from "react-router-dom";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);

const FollowUps = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [followUps, setFollowUps] = useState([]);
  
  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [newFollowUp, setNewFollowUp] = useState({
     module: "Lead",
     linkedRecordId: "",
     title: "",
     description: "",
     temperature: "Hot",
     dueDate: new Date().toISOString().split("T")[0],
  });

  const [recordOptions, setRecordOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Get logged-in user
  const userStr = localStorage.getItem('dayal_user');
  const loggedInUser = userStr ? JSON.parse(userStr) : null;
  const isAdmin = loggedInUser?.role === 'Admin';

  const fetchData = async () => {
     setLoading(true);
     let query = supabase.from("tasks")
        .select("*")
        .eq("custom_category", "Follow Up")
        .neq("status", "Completed")
        .order("due_date", { ascending: true });
        
     if (!isAdmin && loggedInUser?.id) {
        query = query.eq("assignee_id", loggedInUser.id);
     }
     
     const { data, error } = await query;
     if (!error && data) {
        setFollowUps(data);
     }
     setLoading(false);
  };

  useEffect(() => {
     fetchData();
  }, []);

  // Fetch record options based on selected module
  useEffect(() => {
     const fetchOptions = async () => {
        let table = "leads";
        if (newFollowUp.module === "Client") table = "clients";
        else if (newFollowUp.module === "Project") table = "projects";
        else if (newFollowUp.module === "Service") table = "services";
        
        // Fetch all so we have phone numbers for leads/clients
        let q = supabase.from(table).select("*");
        if (!isAdmin && loggedInUser?.id && (table === "leads" || table === "services" || table === "projects")) {
           q = q.like("assigned_to", `%${loggedInUser.id}%`);
        }
        
        const { data } = await q;
        if (data) {
           const formatted = data.map(d => ({
              id: d.id,
              name: d.name || d.title || "Unknown",
              phone: d.phone || ""
           }));
           setRecordOptions(formatted);
        }
     };
     fetchOptions();
     setSearchTerm("");
     setNewFollowUp(prev => ({...prev, linkedRecordId: ""}));
  }, [newFollowUp.module, isAdmin, loggedInUser?.id]);

  const handleAddFollowUp = async (e) => {
     e.preventDefault();
     if (!newFollowUp.linkedRecordId || !newFollowUp.title || !newFollowUp.dueDate) {
        alert("Please select a record from the dropdown list and fill in all fields."); return;
     }
     setIsSaving(true);
     
     const payload = {
        title: newFollowUp.title,
        name: newFollowUp.title,
        description: newFollowUp.description,
        custom_category: "Follow Up",
        priority: newFollowUp.temperature,
        status: "To Do",
        due_date: new Date(newFollowUp.dueDate).toISOString(),
        category: newFollowUp.module,
        assignee_id: loggedInUser?.id,
        creator_id: loggedInUser?.id,
     };
     
     if (newFollowUp.module === "Lead") payload.lead_id = newFollowUp.linkedRecordId;
     else if (newFollowUp.module === "Client") payload.client_id = newFollowUp.linkedRecordId;
     else if (newFollowUp.module === "Project") payload.project_id = newFollowUp.linkedRecordId;
     else if (newFollowUp.module === "Service") payload.service_id = newFollowUp.linkedRecordId;
     
     const { data, error } = await supabase.from('tasks').insert([payload]).select();
     
     if (error) {
        alert("Failed to create follow up: " + error.message);
     } else {
        setShowAddModal(false);
        setNewFollowUp({ ...newFollowUp, title: "", description: "" });
        fetchData();
        
        // Add activity log to timeline
        if (data && data[0]) {
           await supabase.from('lead_activities').insert([{
              lead_id: payload.lead_id || null,
              client_id: payload.client_id || null,
              employee_name: loggedInUser ? loggedInUser.name : 'System',
              activity_group: 'Timeline',
              activity_type: 'Follow-Up',
              title: `Follow-up Scheduled: ${payload.title}`,
              details: `Due on ${newFollowUp.dueDate}. Temp: ${newFollowUp.temperature}`
           }]);
        }
     }
     setIsSaving(false);
  };

  const handleComplete = async (id) => {
     const { error } = await supabase.from('tasks').update({ status: 'Completed' }).eq('id', id);
     if (!error) fetchData();
  };

  // Grouping by Date
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
  
  const overdue = followUps.filter(f => f.due_date && f.due_date.split("T")[0] < today);
  const dueToday = followUps.filter(f => f.due_date && f.due_date.split("T")[0] === today);
  const dueTomorrow = followUps.filter(f => f.due_date && f.due_date.split("T")[0] === tomorrow);
  const upcoming = followUps.filter(f => f.due_date && f.due_date.split("T")[0] > tomorrow);

  const getTemperatureIcon = (temp) => {
     if (temp === 'Hot') return <MdWhatshot className="text-red-500" title="Hot" />;
     if (temp === 'Warm') return <MdWbSunny className="text-orange-400" title="Warm" />;
     return <MdAcUnit className="text-blue-400" title="Cold" />;
  };

  const navigateToEntity = (task) => {
     if (task.category === 'Lead') navigate(`/admin/crm?leadId=${task.lead_id}`);
     else if (task.category === 'Client') navigate(`/admin/clients`);
     else if (task.category === 'Service') navigate(`/admin/services`);
     else if (task.category === 'Project') navigate(`/admin/projects`);
  };

  const FollowUpCard = ({ item }) => (
     <div className="bg-white border border-[#E2E8F0] p-4 rounded-xl shadow-sm hover:shadow-md transition mb-3 flex flex-col group cursor-pointer" onClick={(e) => {
        if(e.target.tagName !== 'BUTTON') navigateToEntity(item);
     }}>
        <div className="flex justify-between items-start mb-2">
           <div className="flex items-center gap-2">
              {getTemperatureIcon(item.priority)}
              <span className="text-[12px] font-bold text-[#475569] uppercase bg-gray-100 px-2 rounded">{item.category}</span>
           </div>
           <span className="text-[11px] font-semibold text-[#64748B] flex items-center gap-1">
              <MdAccessTime />
              {new Date(item.due_date).toLocaleDateString('en-GB')}
           </span>
        </div>
        <h4 className="text-[14px] font-bold text-[#0F172A] mb-1 line-clamp-2">{item.title}</h4>
        {item.description && <p className="text-[12px] text-[#64748B] line-clamp-1 mb-3">{item.description}</p>}
        
        <div className="mt-auto flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
           <button onClick={() => handleComplete(item.id)} className="h-8 px-3 rounded-lg bg-[#10B981] text-white text-[11px] font-bold flex items-center gap-1 hover:bg-green-600">
              <MdCheckCircle /> Mark Done
           </button>
        </div>
     </div>
  );

  return (
    <div className="animate-fade-in flex flex-col gap-6 relative">
       
       {/* Dashboard Header */}
       <div className="flex justify-between items-center bg-white p-5 rounded-[20px] border border-[#E2E8F0] shadow-sm">
          <div>
             <h2 className="text-[20px] font-bold text-[#0F172A] flex items-center gap-2">
                <MdNotificationsActive className="text-yellow-500" />
                Follow-Up Command Center
             </h2>
             <p className="text-[13px] text-[#64748B]">Manage, track, and execute your follow-ups.</p>
          </div>
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 h-10 px-5 rounded-xl bg-[#2563EB] font-bold text-white hover:bg-[#1D4ED8] transition shadow-sm">
             <MdAdd size={20} /> Schedule Follow-Up
          </button>
       </div>

       {/* Smart Alerts */}
       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card extra="p-5 border-t-4 border-red-500 bg-red-50/30">
             <p className="text-[13px] font-bold text-red-700 uppercase mb-1">Overdue 🚨</p>
             <p className="text-[24px] font-bold text-[#0F172A]">{overdue.length}</p>
          </Card>
          <Card extra="p-5 border-t-4 border-orange-400 bg-orange-50/30">
             <p className="text-[13px] font-bold text-orange-700 uppercase mb-1">Due Today ⚡</p>
             <p className="text-[24px] font-bold text-[#0F172A]">{dueToday.length}</p>
          </Card>
          <Card extra="p-5 border-t-4 border-blue-500 bg-blue-50/30">
             <p className="text-[13px] font-bold text-blue-700 uppercase mb-1">Tomorrow 📅</p>
             <p className="text-[24px] font-bold text-[#0F172A]">{dueTomorrow.length}</p>
          </Card>
          <Card extra="p-5 border-t-4 border-gray-400 bg-gray-50/50">
             <p className="text-[13px] font-bold text-gray-600 uppercase mb-1">Upcoming</p>
             <p className="text-[24px] font-bold text-[#0F172A]">{upcoming.length}</p>
          </Card>
       </div>

       {/* Lists */}
       {loading ? (
          <div className="p-10 text-center text-[#64748B]">Loading follow-ups...</div>
       ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
             
             {/* Overdue */}
             <div className="bg-red-50/20 p-4 rounded-xl border border-red-100 min-h-[400px]">
                <h3 className="text-[14px] font-bold text-red-700 uppercase tracking-wide mb-4 flex justify-between">Overdue <span>{overdue.length}</span></h3>
                {overdue.map(f => <FollowUpCard key={f.id} item={f} />)}
                {overdue.length === 0 && <p className="text-center text-gray-400 text-sm mt-10">No overdue follow-ups.</p>}
             </div>
             
             {/* Due Today */}
             <div className="bg-orange-50/20 p-4 rounded-xl border border-orange-100 min-h-[400px]">
                <h3 className="text-[14px] font-bold text-orange-700 uppercase tracking-wide mb-4 flex justify-between">Due Today <span>{dueToday.length}</span></h3>
                {dueToday.map(f => <FollowUpCard key={f.id} item={f} />)}
                {dueToday.length === 0 && <p className="text-center text-gray-400 text-sm mt-10">All clear for today.</p>}
             </div>
             
             {/* Tomorrow */}
             <div className="bg-blue-50/20 p-4 rounded-xl border border-blue-100 min-h-[400px]">
                <h3 className="text-[14px] font-bold text-blue-700 uppercase tracking-wide mb-4 flex justify-between">Tomorrow <span>{dueTomorrow.length}</span></h3>
                {dueTomorrow.map(f => <FollowUpCard key={f.id} item={f} />)}
                {dueTomorrow.length === 0 && <p className="text-center text-gray-400 text-sm mt-10">Nothing pending for tomorrow.</p>}
             </div>

             {/* Upcoming */}
             <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-200 min-h-[400px]">
                <h3 className="text-[14px] font-bold text-gray-600 uppercase tracking-wide mb-4 flex justify-between">Upcoming <span>{upcoming.length}</span></h3>
                {upcoming.map(f => <FollowUpCard key={f.id} item={f} />)}
             </div>

          </div>
       )}

       {/* Add Follow Up Modal */}
       {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
             <div className="w-full max-w-[500px] bg-white rounded-[20px] shadow-2xl overflow-hidden animate-slide-up">
                <div className="flex justify-between items-center p-6 border-b border-[#E2E8F0] bg-gray-50/50">
                   <h3 className="text-[18px] font-bold text-[#0F172A]">Schedule New Follow-Up</h3>
                   <MdClose className="text-2xl cursor-pointer text-gray-500 hover:text-black transition" onClick={() => setShowAddModal(false)} />
                </div>
                
                <form onSubmit={handleAddFollowUp} className="p-6 space-y-4">
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                         <label className="block text-[12px] font-bold text-[#475569] uppercase mb-1">Module</label>
                         <select 
                            value={newFollowUp.module}
                            onChange={(e) => setNewFollowUp({...newFollowUp, module: e.target.value, linkedRecordId: ""})}
                            className="w-full h-11 px-3 border border-[#E2E8F0] rounded-lg text-sm bg-white outline-none focus:border-[#2563EB]"
                         >
                            <option>Lead</option>
                            <option>Client</option>
                            <option>Service</option>
                            <option>Project</option>
                         </select>
                      </div>
                      <div className="relative">
                         <label className="block text-[12px] font-bold text-[#475569] uppercase mb-1">Search Record</label>
                         <input 
                            type="text"
                            placeholder={`Type name or number...`}
                            value={searchTerm}
                            onChange={(e) => {
                               setSearchTerm(e.target.value);
                               setShowDropdown(true);
                               if (newFollowUp.linkedRecordId) setNewFollowUp({...newFollowUp, linkedRecordId: ""});
                            }}
                            onFocus={() => setShowDropdown(true)}
                            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                            className="w-full h-11 px-3 border border-[#E2E8F0] rounded-lg text-sm bg-white outline-none focus:border-[#2563EB]"
                         />
                         {showDropdown && recordOptions.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-[#E2E8F0] rounded-lg shadow-xl max-h-48 overflow-y-auto">
                               {recordOptions
                                  .filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()) || (r.phone && r.phone.includes(searchTerm)))
                                  .map(r => (
                                  <div 
                                     key={r.id} 
                                     className="px-3 py-2 text-[13px] hover:bg-gray-100 cursor-pointer text-[#0F172A]"
                                     onClick={() => {
                                        setNewFollowUp({...newFollowUp, linkedRecordId: r.id});
                                        setSearchTerm(`${r.name} ${r.phone ? `(${r.phone})` : ''}`);
                                        setShowDropdown(false);
                                     }}
                                  >
                                     <span className="font-bold">{r.name}</span>
                                     {r.phone && <span className="ml-2 text-gray-500 text-[11px]">{r.phone}</span>}
                                  </div>
                               ))}
                               {recordOptions.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()) || (r.phone && r.phone.includes(searchTerm))).length === 0 && (
                                  <div className="px-3 py-2 text-[13px] text-gray-400">No matches found.</div>
                               )}
                            </div>
                         )}
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div>
                         <label className="block text-[12px] font-bold text-[#475569] uppercase mb-1">Due Date</label>
                         <input 
                            required type="date" 
                            value={newFollowUp.dueDate}
                            onChange={(e) => setNewFollowUp({...newFollowUp, dueDate: e.target.value})}
                            className="w-full h-11 px-3 border border-[#E2E8F0] rounded-lg text-sm outline-none focus:border-[#2563EB]"
                         />
                      </div>
                      <div>
                         <label className="block text-[12px] font-bold text-[#475569] uppercase mb-1">Temperature</label>
                         <select 
                            value={newFollowUp.temperature}
                            onChange={(e) => setNewFollowUp({...newFollowUp, temperature: e.target.value})}
                            className="w-full h-11 px-3 border border-[#E2E8F0] rounded-lg text-sm bg-white outline-none focus:border-[#2563EB]"
                         >
                            <option value="Hot">🔥 Hot (Urgent)</option>
                            <option value="Warm">🌤️ Warm (Soon)</option>
                            <option value="Cold">❄️ Cold (Later)</option>
                         </select>
                      </div>
                   </div>

                   <div>
                      <label className="block text-[12px] font-bold text-[#475569] uppercase mb-1">Title / Action Item</label>
                      <input 
                         required type="text" placeholder="e.g. Call regarding quotation..."
                         value={newFollowUp.title}
                         onChange={(e) => setNewFollowUp({...newFollowUp, title: e.target.value})}
                         className="w-full h-11 px-3 border border-[#E2E8F0] rounded-lg text-sm outline-none focus:border-[#2563EB]"
                      />
                   </div>

                   <div>
                      <label className="block text-[12px] font-bold text-[#475569] uppercase mb-1">Notes (Optional)</label>
                      <textarea 
                         rows="3" placeholder="Additional details..."
                         value={newFollowUp.description}
                         onChange={(e) => setNewFollowUp({...newFollowUp, description: e.target.value})}
                         className="w-full p-3 border border-[#E2E8F0] rounded-lg text-sm outline-none focus:border-[#2563EB] resize-none"
                      />
                   </div>
                   
                   <div className="pt-2 flex gap-3">
                      <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 h-11 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200">Cancel</button>
                      <button type="submit" disabled={isSaving} className="flex-1 h-11 bg-[#2563EB] text-white font-bold rounded-lg hover:bg-[#1D4ED8] disabled:opacity-50 shadow-sm">
                         {isSaving ? "Saving..." : "Schedule Follow-Up"}
                      </button>
                   </div>
                </form>
             </div>
          </div>
       )}
    </div>
  );
};

export default FollowUps;
