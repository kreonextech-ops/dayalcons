import React, { useState, useEffect } from 'react';
import Card from 'components/card';
import { MdAdd, MdClose, MdSave, MdCheckCircle } from 'react-icons/md';
import { uploadFileToR2 } from "utils/r2Storage";
import { MdUploadFile, MdFileDownload } from "react-icons/md";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://gdzligxryodasaxnhdco.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg';
const supabase = createClient(supabaseUrl, supabaseKey);

const TabQuotations = ({ clientId }) => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [newQuote, setNewQuote] = useState({
    quotation_no: '',
    description: '',
    date_arrived: '',
    submission_deadline: '',
    action_taken: '',
    remarks: '',
    file_url: '',
    status: 'Pending'
  });

  const fetchQuotations = async () => {
    setLoading(true);
    const { data } = await supabase.from('quotations').select('*').eq('client_id', clientId).order('created_at', { ascending: false });
    if (data) setQuotations(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchQuotations();
  }, [clientId]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setUploading(true);
    let finalFileUrl = newQuote.file_url;
    
    if (fileToUpload) {
      try {
        finalFileUrl = await uploadFileToR2(fileToUpload, 'quotations');
      } catch (err) {
        alert("Failed to upload file");
        setUploading(false);
        return;
      }
    }

    const { error } = await supabase.from('quotations').insert([{ ...newQuote, file_url: finalFileUrl, client_id: clientId }]);
    if (!error) {
      setShowModal(false);
      setNewQuote({ quotation_no: '', description: '', date_arrived: '', submission_deadline: '', action_taken: '', remarks: '', file_url: '', status: 'Pending' });
      setFileToUpload(null);
      fetchQuotations();
    } else {
      alert('Error saving quotation: ' + error.message);
    }
    setUploading(false);
  };

  const updateStatus = async (id, newStatus) => {
    await supabase.from('quotations').update({ status: newStatus }).eq('id', id);
    fetchQuotations();
  };

  return (
    <Card extra="w-full p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-[#0F172A] dark:text-white">Quotations</h3>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-brand-500 text-white px-4 py-2 rounded-[10px] font-bold text-sm hover:bg-brand-600 transition">
          <MdAdd /> New Quotation
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 dark:border-navy-700 text-gray-500 text-sm">
              <th className="pb-3 pr-4">Quote No.</th>
              <th className="pb-3 pr-4">Description</th>
              <th className="pb-3 pr-4">Date Arrived</th>
              <th className="pb-3 pr-4">Deadline</th>
              <th className="pb-3 pr-4">Status</th>
              <th className="pb-3 pr-4">Attachment</th>
                <th className="pb-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="py-4 text-center">Loading...</td></tr>
            ) : quotations.length === 0 ? (
              <tr><td colSpan="6" className="py-4 text-center text-gray-500">No quotations found.</td></tr>
            ) : (
              quotations.map(q => (
                <tr key={q.id} className="border-b border-gray-50 dark:border-navy-700">
                  <td className="py-3 pr-4 font-bold text-[#0F172A] dark:text-white">{q.quotation_no || '-'}</td>
                  <td className="py-3 pr-4 text-sm text-gray-600 dark:text-gray-200">{q.description || '-'}</td>
                  <td className="py-3 pr-4 text-sm text-gray-600 dark:text-gray-200">{q.date_arrived || '-'}</td>
                  <td className="py-3 pr-4 text-sm text-gray-600 dark:text-gray-200">{q.submission_deadline || '-'}</td>
                  <td className="py-3 pr-4">
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${q.status === 'Closed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                      {q.status}
                    </span>
                  </td>
                  <td className="py-3">
                    {q.status !== 'Closed' && (
                       <button onClick={() => updateStatus(q.id, 'Closed')} className="text-green-500 hover:text-green-700 text-sm font-bold flex items-center gap-1">
                          <MdCheckCircle /> Close
                       </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[99] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-navy-800 rounded-[20px] p-6 w-full max-w-lg shadow-2xl">
             <div className="flex justify-between items-center mb-6">
               <h2 className="text-xl font-bold text-[#0F172A] dark:text-white">Add Quotation</h2>
               <MdClose className="text-2xl text-gray-500 cursor-pointer hover:text-red-500" onClick={() => setShowModal(false)} />
             </div>
             <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Quotation No.</label>
                  <input type="text" value={newQuote.quotation_no} onChange={e=>setNewQuote({...newQuote, quotation_no: e.target.value})} className="w-full h-11 px-3 border rounded-[10px] dark:bg-navy-900 dark:border-navy-700 dark:text-white" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Date Arrived</label>
                  <input type="date" value={newQuote.date_arrived} onChange={e=>setNewQuote({...newQuote, date_arrived: e.target.value})} className="w-full h-11 px-3 border rounded-[10px] dark:bg-navy-900 dark:border-navy-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Submission Deadline</label>
                  <input type="date" value={newQuote.submission_deadline} onChange={e=>setNewQuote({...newQuote, submission_deadline: e.target.value})} className="w-full h-11 px-3 border rounded-[10px] dark:bg-navy-900 dark:border-navy-700 dark:text-white" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 mb-1">Description of Work</label>
                  <input type="text" value={newQuote.description} onChange={e=>setNewQuote({...newQuote, description: e.target.value})} className="w-full h-11 px-3 border rounded-[10px] dark:bg-navy-900 dark:border-navy-700 dark:text-white" required />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Attachment</label>
                  <input type="file" onChange={(e) => setFileToUpload(e.target.files[0])} className="w-full h-11 px-3 border rounded-[10px] dark:bg-navy-900 dark:border-navy-700 dark:text-white pt-2 text-sm" />
                </div>
<div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 mb-1">Action Taken</label>
                  <input type="text" value={newQuote.action_taken} onChange={e=>setNewQuote({...newQuote, action_taken: e.target.value})} className="w-full h-11 px-3 border rounded-[10px] dark:bg-navy-900 dark:border-navy-700 dark:text-white" />
                </div>
                <div className="md:col-span-2 mt-4 flex justify-end">
                   <button type="submit" className="bg-brand-500 text-white font-bold px-6 py-2 rounded-[10px]">{uploading ? "Uploading..." : "Save Quotation"}</button>
                </div>
             </form>
          </div>
        </div>
      )}
    </Card>
  );
};

export default TabQuotations;
