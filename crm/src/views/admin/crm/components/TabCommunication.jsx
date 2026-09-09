import React, { useState } from "react";
import Card from "components/card";
import { 
  MdPhone, MdMessage, MdEmail, MdEvent, 
  MdSearch, MdCancel, MdPhoneInTalk
} from "react-icons/md";

import { createClient } from "@supabase/supabase-js";
import { uploadFileToR2 } from "utils/r2Storage";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);

const TabCommunication = ({ leadData, action, setAction, isClient = false, entityType, entityId }) => {
  const [communications, setCommunications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ type: 'Call', direction: 'Outgoing', outcome: '', clientResponse: '', internalNote: '', interaction_date: '', attachment: null });
  const [isUploading, setIsUploading] = useState(false);

  const quickActions = [
    { type: "Call", icon: <MdPhoneInTalk />, color: "text-blue-500", bg: "bg-blue-50", desc: "Log a phone call." },
    { type: "WhatsApp", icon: <MdMessage />, color: "text-green-500", bg: "bg-green-50", desc: "Send or log a message." },
    { type: "Email", icon: <MdEmail />, color: "text-purple-500", bg: "bg-purple-50", desc: "Send proposals & documents." },
    { type: "Meeting", icon: <MdEvent />, color: "text-orange-500", bg: "bg-orange-50", desc: "Schedule discussion." },
  ];

  React.useEffect(() => {
    if (leadData?.id) fetchCommunications();
  }, [leadData]);

  React.useEffect(() => {
    if (action) {
      setFormData(prev => ({ ...prev, type: action }));
      setShowForm(true);
      if (setAction) setAction(null);
    }
  }, [action, setAction]);
  
  const fetchCommunications = async () => {
    const { data: rawData } = await supabase.from('lead_activities').select('*').eq(isClient ? 'client_id' : 'lead_id', leadData.id).eq('activity_group', 'Communication').order('created_at', { ascending: false });
    let data = rawData;
    if (data && entityType && entityId) {
       data = data.filter(d => {
          let meta = {};
          try { meta = typeof d.metadata === 'string' ? JSON.parse(d.metadata) : (d.metadata || {}); } catch(e) {}
          if (entityType === 'service') return meta.service_id === entityId;
          if (entityType === 'project') return meta.project_id === entityId;
          return true;
       });
    }
    if (data) setCommunications(data);
  };
  
  const handleSaveComm = async () => {
    if (!formData.clientResponse) { alert('Please enter client response'); return; }
    const userStr = localStorage.getItem('dayal_user');
    const loggedInUser = userStr ? JSON.parse(userStr) : null;
    
    const { error } = await supabase.from('lead_activities').insert([{
      lead_id: isClient ? null : leadData.id,
      client_id: isClient ? leadData.id : null,
      employee_name: loggedInUser ? loggedInUser.name : 'Unknown User',
      activity_group: 'Communication',
      activity_type: formData.type,
      title: `${formData.direction} - ${formData.outcome}`,
      details: formData.clientResponse,
      metadata: { note: formData.internalNote, interaction_date: formData.interaction_date || null, attachment: formData.attachment || null }
    }]);
    
    if (error) { alert('Error: Make sure you ran the SQL script to create the lead_activities table.\\n' + error.message); return; }
    
    setShowForm(false);
    setFormData({ type: 'Call', direction: 'Outgoing', outcome: '', clientResponse: '', internalNote: '', interaction_date: '', attachment: null });
    fetchCommunications();
  };

  
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* 1. Header */}
      <Card extra="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-[20px] font-semibold text-[#0F172A] mb-2">Communication Hub</h2>
            <div className="flex flex-wrap gap-4 text-sm text-[#475569]">
              <span className="flex items-center gap-1"><MdPhone /> Preferred: Call</span>
              <span className="flex items-center gap-1"><MdMessage /> WhatsApp Active</span>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="bg-[#F8FAFC] px-4 py-2 rounded-lg border border-[#E2E8F0] text-center">
              <p className="text-[10px] font-bold text-[#64748B] uppercase">Total Interactions</p>
              <p className="text-[16px] font-bold text-[#0F172A]">{communications.length}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* 2. Quick Actions */}
      {!showForm && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map(act => (
            <Card 
              key={act.type} 
              extra="p-6 cursor-pointer hover:-translate-y-1 transition duration-200 border border-[#E2E8F0] shadow-sm hover:shadow-md hover:border-[#2563EB]"
              onClick={() => { setFormData({...formData, type: act.type}); setShowForm(true); }}
            >
              <div className={`w-12 h-12 rounded-xl ${act.bg} ${act.color} flex items-center justify-center text-2xl mb-4`}>
                {act.icon}
              </div>
              <h3 className="font-bold text-[#0F172A] text-[16px] mb-1">{act.type}</h3>
              <p className="text-xs text-[#64748B]">{act.desc}</p>
            </Card>
          ))}
        </div>
      )}

      {/* 3. History Feed & Form */}
      <Card extra="p-6">
        <div className="flex justify-between items-center mb-6">
           <h3 className="text-[16px] font-semibold text-[#0F172A]">Communication History</h3>
           <button 
             onClick={() => setShowForm(!showForm)} 
             className="bg-[#2563EB] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-600 transition-colors flex items-center gap-2"
           >
             + Add Record
           </button>
        </div>

        {showForm && (
          <div className="mb-8 p-6 border-l-4 border-[#2563EB] shadow-lg rounded-xl bg-gray-50 relative">
            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><MdCancel className="text-2xl" /></button>
            <div className="flex items-center gap-3 mb-6">
               <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl">
                 <MdPhoneInTalk />
               </div>
               <h3 className="text-[20px] font-semibold text-[#0F172A]">Log Communication</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
               <div className="flex flex-col">
                 <label className="text-xs font-medium text-gray-500 mb-1">Date & Time</label>
                 <input type="datetime-local" value={formData.interaction_date} onChange={e => setFormData({...formData, interaction_date: e.target.value})} className="border border-[#E2E8F0] rounded p-2 text-sm outline-none focus:border-[#2563EB]" />
               </div>
               <div className="flex flex-col">
                 <label className="text-xs font-medium text-gray-500 mb-1">Communication Type</label>
                 <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="border border-[#E2E8F0] rounded p-2 text-sm outline-none focus:border-[#2563EB]">
                   <option value="Call">Call</option>
                   <option value="Email">Email</option>
                   <option value="WhatsApp">WhatsApp</option>
                   <option value="Meeting">Meeting</option>
                 </select>
               </div>
               <div className="flex flex-col">
                 <label className="text-xs font-medium text-gray-500 mb-1">Direction</label>
                 <select value={formData.direction} onChange={e => setFormData({...formData, direction: e.target.value})} className="border border-[#E2E8F0] rounded p-2 text-sm outline-none focus:border-[#2563EB]">
                   <option>Outgoing</option>
                   <option>Incoming</option>
                 </select>
               </div>
               <div className="flex flex-col">
                 <label className="text-xs font-medium text-gray-500 mb-1">Outcome</label>
                 <select value={formData.outcome} onChange={e => setFormData({...formData, outcome: e.target.value})} className="border border-[#E2E8F0] rounded p-2 text-sm outline-none focus:border-[#2563EB]">
                   <option>Select Outcome...</option>
                   <option>Interested</option>
                   <option>Negotiating</option>
                   <option>Busy</option>
                   <option>Call Back Later</option>
                   <option>Not Reachable</option>
                 </select>
               </div>
            </div>

            <div className="mb-4">
               <label className="text-xs font-medium text-gray-500 mb-1 block">Client Response (Exactly what they said)</label>
               <textarea 
                  value={formData.clientResponse} onChange={e => setFormData({...formData, clientResponse: e.target.value})}
                  className="w-full min-h-[100px] rounded-[10px] border border-[#E2E8F0] p-4 text-sm text-[#475569] outline-none focus:border-[#2563EB]"
                  placeholder="Write objections, requirements, family discussions, budget concerns..."
               ></textarea>
            </div>

            <div className="mb-4">
               <label className="text-xs font-medium text-gray-500 mb-1 block">Attach File (Optional)</label>
               <input type="file" onChange={async (e) => {
                   const file = e.target.files[0];
                   if (!file) return;
                   setIsUploading(true);
                   try {
                       const fileKey = await uploadFileToR2(file, 'communications');
                       setFormData({...formData, attachment: fileKey});
                   } catch (err) {
                       alert("Upload failed");
                   }
                   setIsUploading(false);
               }} className="border border-[#E2E8F0] rounded p-2 text-sm outline-none w-full" />
               {isUploading && <span className="text-xs text-blue-500">Uploading...</span>}
               {formData.attachment && <span className="text-xs text-green-500 ml-2">File attached successfully</span>}
            </div>

            <div className="mb-4">
               <label className="text-xs font-medium text-gray-500 mb-1 block">Internal Note (Private)</label>
               <textarea 
                  value={formData.internalNote} onChange={e => setFormData({...formData, internalNote: e.target.value})}
                  className="w-full min-h-[80px] rounded-[10px] border border-[#E2E8F0] p-4 text-sm text-[#475569] outline-none focus:border-[#2563EB]"
                  placeholder="Private notes visible only to the sales team."
               ></textarea>
            </div>

            <div className="flex justify-end pt-4 border-t border-[#E2E8F0]">
               <button onClick={handleSaveComm} className="rounded-[10px] bg-[#2563EB] px-6 py-2 text-sm font-bold text-white hover:bg-blue-600 transition">Save Record</button>
            </div>
          </div>
        )}

        {communications.length === 0 ? (
           <div className="text-center py-8 text-gray-400 italic">
             No communications logged yet. Click '+ Add Record' to log a call or message.
           </div>
        ) : (
           <div className="w-full flex flex-col gap-4 mt-4">
             {communications.map(act => (
                <div key={act.id} className="w-full text-left p-4 rounded-xl border border-[#E2E8F0] bg-white shadow-sm flex flex-col gap-2 relative">
                  <div className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-md font-bold self-start mb-1 border border-yellow-200">
                    Happened: {act.metadata?.interaction_date ? new Date(act.metadata.interaction_date).toLocaleString() : new Date(act.created_at).toLocaleString()} | Logged: {new Date(act.created_at).toLocaleString()}
                  </div>
                  <div className="flex justify-between items-center">
                     <h4 className="font-bold text-[#0F172A]">{act.activity_type} ({act.title})</h4>
                  </div>
                  <p className="text-sm text-[#475569] mt-1 whitespace-pre-wrap"><strong className="text-black">Response:</strong> {act.details}</p>
                  {act.metadata?.note && <p className="text-xs text-gray-400 mt-1 italic">Note: {act.metadata.note}</p>}
                  {act.metadata?.attachment && <a href={`https://pub-00d1d73a43a643edb96c64ca062ab6df.r2.dev/${act.metadata.attachment}`} target="_blank" rel="noreferrer" className="text-xs font-bold text-blue-500 hover:underline mt-1 flex items-center gap-1">View Attached File</a>}
                </div>
             ))}
           </div>
        )}
      </Card>
    </div>
  );
};

export default TabCommunication;
