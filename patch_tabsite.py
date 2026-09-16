import sys

new_content = """import React, { useState, useEffect, useRef } from "react";
import Card from "components/card";
import { MdAdd, MdClose, MdCheckCircle, MdSave, MdAttachFile } from "react-icons/md";
import { createClient } from "@supabase/supabase-js";
import { uploadFileToR2 } from "utils/r2Storage";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);

const TabSiteVisit = ({ leadData, isClient=false }) => {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  
  const [newVisit, setNewVisit] = useState({
    visit_type: "Site Visit",
    mobile_no: "",
    location: "",
    visiting_date: "",
    requirement: "",
    amount: "",
    outcome: "",
    attachment_url: "",
    status: "Ongoing"
  });

  const fetchVisits = async () => {
    if (!leadData?.id) return;
    setLoading(true);
    let q = supabase.from('site_visits').select('*').order('created_at', { ascending: false });
    if (isClient) {
      q = q.eq('client_id', leadData.id);
    } else {
      q = q.eq('lead_id', leadData.id);
    }
    const { data } = await q;
    if (data) setVisits(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchVisits();
  }, [leadData]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    try {
       const url = await uploadFileToR2(file, \isits/\_\\);
       if (url) {
          setNewVisit({ ...newVisit, attachment_url: url });
       }
    } catch(err) {
       console.error("Upload error", err);
       alert("Error uploading file");
    }
    setIsUploading(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const payload = { ...newVisit, client_name: leadData?.name };
    if (isClient) payload.client_id = leadData.id;
    else payload.lead_id = leadData.id;
    
    const { error } = await supabase.from('site_visits').insert([payload]);
    if (!error) {
      setShowModal(false);
      setNewVisit({ visit_type: "Site Visit", mobile_no: "", location: "", visiting_date: "", requirement: "", amount: "", outcome: "", attachment_url: "", status: "Ongoing" });
      fetchVisits();
    } else {
      alert("Error saving visit: " + error.message);
    }
  };

  const updateStatus = async (id, newStatus) => {
    await supabase.from('site_visits').update({ status: newStatus }).eq('id', id);
    fetchVisits();
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <Card extra="w-full p-6 h-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-[#0F172A] dark:text-white">Visits</h2>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-brand-500 text-white px-4 py-2 rounded-[10px] font-bold text-sm hover:bg-brand-600 transition">
            <MdAdd /> Add Visit
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-navy-700 text-gray-500 text-sm">
                <th className="pb-3 pr-4">Type</th>
                <th className="pb-3 pr-4">Location</th>
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3 pr-4">Outcome</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="py-4 text-center">Loading visits...</td></tr>
              ) : visits.length === 0 ? (
                <tr><td colSpan="6" className="py-4 text-center text-gray-500">No visits found.</td></tr>
              ) : (
                visits.map(v => (
                  <tr key={v.id} className="border-b border-gray-50 dark:border-navy-700 hover:bg-gray-50 dark:hover:bg-navy-800 transition">
                    <td className="py-4 pr-4 text-sm font-bold text-[#0F172A] dark:text-gray-200">{v.visit_type || 'Site Visit'}</td>
                    <td className="py-4 pr-4 text-sm font-bold text-[#0F172A] dark:text-gray-200">{v.location || '-'}</td>
                    <td className="py-4 pr-4 text-sm text-gray-600 dark:text-gray-200">{v.visiting_date || '-'}</td>
                    <td className="py-4 pr-4 text-sm text-gray-600 dark:text-gray-200">
                      {v.outcome || '-'}
                      {v.attachment_url && <a href={v.attachment_url} target="_blank" rel="noreferrer" className="block text-blue-500 underline text-xs mt-1">View File</a>}
                    </td>
                    <td className="py-4 pr-4">
                      <span className={\px-2 py-1 text-xs font-bold rounded-full \\}>
                        {v.status}
                      </span>
                    </td>
                    <td className="py-4">
                      {v.status !== 'Completed' && (
                         <button onClick={() => updateStatus(v.id, 'Completed')} className="text-green-500 hover:text-green-700 text-sm font-bold flex items-center gap-1">
                            <MdCheckCircle /> Complete
                         </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {showModal && (
        <div className="fixed inset-0 z-[99] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-navy-800 rounded-[20px] p-6 w-full max-w-2xl shadow-2xl my-auto">
             <div className="flex justify-between items-center mb-6">
               <h2 className="text-xl font-bold text-[#0F172A] dark:text-white">Add Visit</h2>
               <MdClose className="text-2xl text-gray-500 cursor-pointer hover:text-red-500" onClick={() => setShowModal(false)} />
             </div>
             <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 mb-1">Visit Type</label>
                  <select value={newVisit.visit_type} onChange={e=>setNewVisit({...newVisit, visit_type: e.target.value})} className="w-full h-11 px-3 border rounded-[10px] dark:bg-navy-900 dark:border-navy-700 dark:text-white cursor-pointer outline-none focus:border-brand-500">
                     <option>Site Visit</option>
                     <option>Office Visit</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Location</label>
                  <input type="text" value={newVisit.location} onChange={e=>setNewVisit({...newVisit, location: e.target.value})} className="w-full h-11 px-3 border rounded-[10px] dark:bg-navy-900 dark:border-navy-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Visiting Date</label>
                  <input type="date" value={newVisit.visiting_date} onChange={e=>setNewVisit({...newVisit, visiting_date: e.target.value})} className="w-full h-11 px-3 border rounded-[10px] dark:bg-navy-900 dark:border-navy-700 dark:text-white" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 mb-1">Communication / Outcome</label>
                  <textarea value={newVisit.outcome} onChange={e=>setNewVisit({...newVisit, outcome: e.target.value})} placeholder="What was discussed / Result" className="w-full h-24 p-3 border rounded-[10px] dark:bg-navy-900 dark:border-navy-700 dark:text-white resize-y" />
                </div>
                <div className="md:col-span-2">
                   <label className="block text-xs font-bold text-gray-500 mb-1">Attachment</label>
                   <div className="flex items-center gap-3">
                      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
                      <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-gray-100 dark:bg-navy-700 text-gray-700 dark:text-white text-sm font-bold rounded-lg hover:bg-gray-200 transition flex items-center gap-2">
                         <MdAttachFile /> {isUploading ? "Uploading..." : "Upload File"}
                      </button>
                      {newVisit.attachment_url && <span className="text-green-500 text-sm font-bold">File Attached!</span>}
                   </div>
                </div>
                <div className="md:col-span-2 mt-4 flex justify-end">
                   <button type="submit" disabled={isUploading} className="bg-brand-500 text-white font-bold px-6 py-2 rounded-[10px] disabled:opacity-50">Save Visit</button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TabSiteVisit;
"""

with open('crm/src/views/admin/crm/components/TabSiteVisit.jsx', 'w') as f:
    f.write(new_content)

print("Patched TabSiteVisit.jsx")
