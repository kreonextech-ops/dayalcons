import React, { useState, useEffect } from "react";
import Card from "components/card";
import { createClient } from "@supabase/supabase-js";
import { 
  MdAdd, MdClose, MdCheckCircle, MdAccessTime, 
  MdWhatshot, MdWbSunny, MdAcUnit, MdDelete
} from "react-icons/md";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);

const TabFollowUps = ({ moduleType, recordId }) => {
  const [loading, setLoading] = useState(true);
  const [followUps, setFollowUps] = useState([]);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [newFollowUp, setNewFollowUp] = useState({
     title: "",
     description: "",
     temperature: "Hot",
     dueDate: new Date().toISOString().split("T")[0],
  });

  const userStr = localStorage.getItem('dayal_user');
  const loggedInUser = userStr ? JSON.parse(userStr) : null;

  const fetchFollowUps = async () => {
     setLoading(true);
     let field = "";
     if (moduleType === "Lead") field = "lead_id";
     else if (moduleType === "Client") field = "client_id";
     else if (moduleType === "Project") field = "project_id";
     else if (moduleType === "Service") field = "service_id";

     const { data, error } = await supabase.from("tasks")
        .select("*")
        .eq("custom_category", "Follow Up")
        .eq(field, recordId)
        .order("due_date", { ascending: true });
        
     if (!error && data) {
        setFollowUps(data);
     }
     setLoading(false);
  };

  useEffect(() => {
     if (recordId) fetchFollowUps();
  }, [recordId, moduleType]);

  const handleAddFollowUp = async (e) => {
     e.preventDefault();
     if (!newFollowUp.title || !newFollowUp.dueDate) {
        alert("Please fill in title and due date."); return;
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
        category: moduleType,
        assignee_id: loggedInUser?.id,
        creator_id: loggedInUser?.id,
     };
     
     if (moduleType === "Lead") payload.lead_id = recordId;
     else if (moduleType === "Client") payload.client_id = recordId;
     else if (moduleType === "Project") payload.project_id = recordId;
     else if (moduleType === "Service") payload.service_id = recordId;
     
     const { data, error } = await supabase.from('tasks').insert([payload]).select();
     
     if (error) {
        alert("Failed to schedule follow up: " + error.message);
     } else {
        setShowAddModal(false);
        setNewFollowUp({ ...newFollowUp, title: "", description: "" });
        fetchFollowUps();
        
        // Log to timeline
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
     if (!error) fetchFollowUps();
  };
  
  const handleDelete = async (id) => {
     if(!window.confirm("Delete this follow up?")) return;
     await supabase.from('tasks').delete().eq('id', id);
     fetchFollowUps();
  }

  const getTemperatureIcon = (temp) => {
     if (temp === 'Hot') return <MdWhatshot className="text-red-500" title="Hot" />;
     if (temp === 'Warm') return <MdWbSunny className="text-orange-400" title="Warm" />;
     return <MdAcUnit className="text-blue-400" title="Cold" />;
  };

  if (loading) return <div className="p-8 text-center text-[#64748B]">Loading follow ups...</div>;

  const pending = followUps.filter(f => f.status !== "Completed");
  const completed = followUps.filter(f => f.status === "Completed");

  return (
    <div className="animate-fade-in flex flex-col gap-6">
       <Card extra="p-6 border border-[#E2E8F0]">
          <div className="flex justify-between items-center mb-6">
             <div>
                <h3 className="text-[18px] font-bold text-[#0F172A]">Follow-Ups</h3>
                <p className="text-[13px] text-[#64748B]">Manage scheduled contact points for this {moduleType.toLowerCase()}.</p>
             </div>
             <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 h-10 px-5 rounded-xl bg-[#2563EB] font-bold text-white hover:bg-[#1D4ED8] transition shadow-sm">
                <MdAdd size={20} /> Schedule Follow-Up
             </button>
          </div>
          
          <div className="space-y-4">
             {pending.length === 0 && <div className="text-center p-8 bg-gray-50 border border-dashed rounded-xl text-sm text-gray-500">No active follow-ups scheduled.</div>}
             {pending.map(f => (
                <div key={f.id} className="bg-white border border-[#E2E8F0] p-4 rounded-xl shadow-sm flex items-start gap-4 hover:border-blue-300 transition">
                   <div className="mt-1">{getTemperatureIcon(f.priority)}</div>
                   <div className="flex-1">
                      <h4 className="text-[14px] font-bold text-[#0F172A]">{f.title}</h4>
                      {f.description && <p className="text-[12px] text-[#64748B] mt-1">{f.description}</p>}
                      <span className={`inline-block mt-2 text-[11px] font-bold px-2 py-0.5 rounded ${new Date(f.due_date).toISOString().split('T')[0] < new Date().toISOString().split('T')[0] ? 'bg-red-100 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
                         Due: {new Date(f.due_date).toLocaleDateString()}
                      </span>
                   </div>
                   <div className="flex gap-2">
                      <button onClick={() => handleComplete(f.id)} className="h-8 px-3 rounded-lg bg-[#10B981] text-white text-[11px] font-bold flex items-center gap-1 hover:bg-green-600">
                         <MdCheckCircle /> Done
                      </button>
                      <button onClick={() => handleDelete(f.id)} className="h-8 w-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100"><MdDelete/></button>
                   </div>
                </div>
             ))}
          </div>

          {completed.length > 0 && (
             <div className="mt-8">
                <h4 className="text-[14px] font-bold text-gray-400 mb-4 uppercase tracking-wide">Completed</h4>
                <div className="space-y-3 opacity-60">
                   {completed.map(f => (
                      <div key={f.id} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                         <MdCheckCircle className="text-green-500" />
                         <span className="text-[13px] font-semibold text-gray-600 line-through">{f.title}</span>
                      </div>
                   ))}
                </div>
             </div>
          )}
       </Card>

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

export default TabFollowUps;
