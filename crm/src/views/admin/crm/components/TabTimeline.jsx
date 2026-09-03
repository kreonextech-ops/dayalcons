import React, { useState } from "react";
import Card from "components/card";
import { 
  MdSearch, MdFilterList, MdAdd, MdPhone, MdMessage, 
  MdEmail, MdEvent, MdMap, MdFileDownload, MdFolder,
  MdRefresh, MdCheckCircle, MdNotes, MdCancel, MdDownload, MdTimeline
} from "react-icons/md";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);

const TabTimeline = ({ leadData, isClient = false, entityType, entityId }) => {
  const [activities, setActivities] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [activityType, setActivityType] = useState("Phone Call");
  const [formData, setFormData] = useState({ title: '', date: '', time: '', details: '' });

  React.useEffect(() => {
    if (leadData?.id) fetchActivities();
  }, [leadData]);
  
  const fetchActivities = async () => {
    const { data: rawData } = await supabase.from('lead_activities').select('*').eq(isClient ? 'client_id' : 'lead_id', leadData.id).order('created_at', { ascending: false });
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
    if (data) setActivities(data);
  };

  const handleSaveActivity = async () => {
    if (!formData.title || !formData.details) { alert('Please enter title and details'); return; }
    const userStr = localStorage.getItem('dayal_user');
    const loggedInUser = userStr ? JSON.parse(userStr) : null;
    
    const { error } = await supabase.from('lead_activities').insert([{
      lead_id: isClient ? null : leadData.id,
      client_id: isClient ? leadData.id : null,
      employee_name: loggedInUser ? loggedInUser.name : 'Unknown User',
      activity_group: 'Timeline',
      activity_type: activityType,
      title: formData.title,
      details: formData.details
    }]);
    
    if (error) { alert('Error: Make sure you ran the SQL script to create the lead_activities table.\n' + error.message); return; }
    
    setShowAdd(false);
    setFormData({ title: '', date: '', time: '', details: '' });
    fetchActivities();
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* 1. Header */}
      <Card extra="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-[20px] font-semibold text-[#0F172A]">Activity Timeline</h2>
            <p className="text-sm text-[#64748B]">Complete chronological history of this lead from enquiry to conversion.</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-gray-50 px-4 py-2 rounded-lg border border-[#E2E8F0] text-center">
              <p className="text-[10px] font-bold text-[#64748B] uppercase">Total Activities</p>
              <p className="text-[16px] font-bold text-[#0F172A]">{activities.length}</p>
            </div>
            <div className="bg-gray-50 px-4 py-2 rounded-lg border border-[#E2E8F0] text-center">
              <p className="text-[10px] font-bold text-[#64748B] uppercase">Last Updated</p>
              <p className="text-[16px] font-bold text-[#0F172A]">N/A</p>
            </div>
            <div className="bg-gray-50 px-4 py-2 rounded-lg border border-[#E2E8F0] text-center">
              <p className="text-[10px] font-bold text-[#64748B] uppercase">Active Users</p>
              <p className="text-[16px] font-bold text-[#0F172A]">0</p>
            </div>
          </div>
        </div>
        
        <div className="relative w-full max-w-md">
          <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
          <input 
            type="text" 
            placeholder="Search activities, notes, quotation, engineer..." 
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#E2E8F0] text-sm focus:border-[#2563EB] outline-none"
          />
        </div>
      </Card>

      {/* 2. Filters */}
      <Card extra="p-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-wrap gap-2">
          {["All", "Calls", "WhatsApp", "Email", "Meetings", "Site Visits", "Quotations", "Documents"].map(f => (
            <button key={f} className={`px-3 py-1 rounded-full text-xs font-semibold transition ${f === 'All' ? 'bg-[#0F172A] text-white' : 'bg-gray-100 text-[#475569] hover:bg-gray-200'}`}>
              {f}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-2 text-[#2563EB] text-sm font-bold hover:opacity-80 transition">
          <MdDownload /> Export Timeline
        </button>
      </Card>

      {/* Add Activity Panel Toggle */}
      {!showAdd && (
        <div className="flex justify-center my-2">
           <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 h-10 px-6 rounded-full bg-gradient-to-r from-[#2563EB] to-[#06B6D4] font-bold text-white hover:shadow-lg transition">
              <MdAdd /> Add Manual Activity
           </button>
        </div>
      )}

      {/* 3. Add Activity Form */}
      {showAdd && (
        <Card extra="p-6 border-l-4 border-[#2563EB] shadow-lg relative">
          <button onClick={() => setShowAdd(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><MdCancel className="text-2xl" /></button>
          <h3 className="text-[16px] font-semibold text-[#0F172A] mb-4">Add Manual Activity</h3>
          
          <div className="flex gap-2 overflow-x-auto pb-4 mb-4 border-b border-[#E2E8F0]">
            {["Phone Call", "WhatsApp", "Email", "Meeting", "Site Visit", "Quotation", "Document", "General Note"].map(t => (
               <button key={t} onClick={() => setActivityType(t)} className={`px-4 py-2 rounded-lg text-sm font-semibold transition whitespace-nowrap ${activityType === t ? 'bg-[#2563EB] text-white' : 'bg-gray-100 text-[#475569] hover:bg-gray-200'}`}>
                 {t}
               </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
             <div className="flex flex-col">
               <label className="text-xs font-medium text-gray-500 mb-1">Activity Title</label>
               <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Client requested revised quotation" className="border border-[#E2E8F0] rounded p-2 text-sm outline-none focus:border-[#2563EB]" />
             </div>
             <div className="grid grid-cols-2 gap-2">
               <div className="flex flex-col">
                 <label className="text-xs font-medium text-gray-500 mb-1">Date</label>
                 <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="border border-[#E2E8F0] rounded p-2 text-sm outline-none focus:border-[#2563EB]" />
               </div>
               <div className="flex flex-col">
                 <label className="text-xs font-medium text-gray-500 mb-1">Time</label>
                 <input type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="border border-[#E2E8F0] rounded p-2 text-sm outline-none focus:border-[#2563EB]" />
               </div>
             </div>
          </div>

          <div className="mb-4">
             <label className="text-xs font-medium text-gray-500 mb-1 block">Activity Details ({activityType})</label>
             <textarea 
                value={formData.details} onChange={e => setFormData({...formData, details: e.target.value})}
                className="w-full min-h-[120px] rounded-[10px] border border-[#E2E8F0] p-4 text-sm text-[#475569] outline-none focus:border-[#2563EB]"
                placeholder="Log the details of this activity..."
             ></textarea>
          </div>

          <div className="flex justify-end gap-3">
             <button onClick={() => setShowAdd(false)} className="rounded-[10px] border border-[#E2E8F0] px-6 py-2 text-sm font-bold text-[#0F172A] hover:bg-gray-50 transition">Cancel</button>
             <button onClick={handleSaveActivity} className="rounded-[10px] bg-gradient-to-r from-[#2563EB] to-[#06B6D4] px-6 py-2 text-sm font-bold text-white hover:opacity-90 transition">Save Activity</button>
          </div>
        </Card>
      )}

      {/* 4. Timeline Feed */}
      <Card extra="p-6 min-h-[400px] flex items-start justify-center">
         {activities.length === 0 ? (
           <div className="text-center py-12 mx-auto">
             <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#2563EB] text-4xl">
               <MdTimeline />
             </div>
             <h3 className="text-lg font-bold text-[#0F172A] mb-2">No activities recorded yet</h3>
             <p className="text-sm text-[#64748B] mb-6 max-w-sm mx-auto">
               This is the official audit trail. Every interaction, status change, and client decision will be permanently recorded here.
             </p>
             <button onClick={() => setShowAdd(true)} className="rounded-full bg-[#2563EB] px-8 py-3 font-bold text-white hover:shadow-lg transition">
               Add First Activity
             </button>
           </div>
         ) : (
           <div className="w-full flex flex-col gap-4">
             {activities.map(act => (
                <div key={act.id} className="w-full text-left p-4 rounded-xl border border-[#E2E8F0] bg-white shadow-sm flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                     <h4 className="font-bold text-[#0F172A]">{act.title}</h4>
                     <span className="text-xs text-gray-500">{new Date(act.created_at).toLocaleString()}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded">{act.activity_type}</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded">By {act.employee_name}</span>
                  </div>
                  <p className="text-sm text-[#475569] mt-2 whitespace-pre-wrap">{act.details}</p>
                  {act.metadata?.note && (
                    <div className="mt-2 p-2 bg-yellow-50 border border-yellow-100 rounded text-xs text-yellow-800">
                      <strong>Internal Note:</strong> {act.metadata.note}
                    </div>
                  )}
                </div>
             ))}
           </div>
         )}
      </Card>
    </div>
  );
};

export default TabTimeline;
