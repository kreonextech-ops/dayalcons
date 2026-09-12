import React, { useState } from 'react';
import Card from 'components/card';
import { MdSave } from 'react-icons/md';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://gdzligxryodasaxnhdco.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg';
const supabase = createClient(supabaseUrl, supabaseKey);

const TabLegal = ({ service }) => {
  const [legalData, setLegalData] = useState({
    service_sub_type: service.service_sub_type || '',
    case_no: service.case_no || '',
    grn_no: service.grn_no || '',
    application_no: service.application_no || '',
    lucc_status: service.lucc_status || '',
    amount_agreed: service.amount_agreed || '',
    signature_of_payee: service.signature_of_payee || '',
    document_received_date: service.document_received_date || '',
    progress_details: service.progress_details || ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    const { error } = await supabase.from('services').update(legalData).eq('id', service.id);
    if (!error) {
      alert('Legal details saved successfully.');
    } else {
      alert('Error saving legal details.');
    }
    setIsSaving(false);
  };

  return (
    <Card extra="w-full p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-[#0F172A] dark:text-white">Legal & Sub-Type Details</h3>
        <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 bg-brand-500 text-white px-4 py-2 rounded-[10px] font-bold text-sm hover:bg-brand-600 transition">
          <MdSave /> {isSaving ? 'Saving...' : 'Save Details'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Service Sub-Type</label>
            <select value={legalData.service_sub_type} onChange={e=>setLegalData({...legalData, service_sub_type: e.target.value})} className="w-full h-11 px-3 border rounded-[10px] dark:bg-navy-900 dark:border-navy-700 dark:text-white">
               <option value="">Select Type</option>
               <option value="L.U.C.C">L.U.C.C</option>
               <option value="Land Conversion / Mutation">Land Conversion / Mutation</option>
               <option value="Building Plan">Building Plan</option>
               <option value="Architecture / Design">Architecture / Design</option>
            </select>
         </div>
         <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">L.U.C.C Status (If applicable)</label>
            <select value={legalData.lucc_status} onChange={e=>setLegalData({...legalData, lucc_status: e.target.value})} className="w-full h-11 px-3 border rounded-[10px] dark:bg-navy-900 dark:border-navy-700 dark:text-white">
               <option value="">N/A</option>
               <option value="Pending">Pending</option>
               <option value="Under Process">Under Process</option>
               <option value="Complete">Complete</option>
            </select>
         </div>
         <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Case No.</label>
            <input type="text" value={legalData.case_no} onChange={e=>setLegalData({...legalData, case_no: e.target.value})} className="w-full h-11 px-3 border rounded-[10px] dark:bg-navy-900 dark:border-navy-700 dark:text-white" />
         </div>
         <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">GRN No.</label>
            <input type="text" value={legalData.grn_no} onChange={e=>setLegalData({...legalData, grn_no: e.target.value})} className="w-full h-11 px-3 border rounded-[10px] dark:bg-navy-900 dark:border-navy-700 dark:text-white" />
         </div>
         <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Application No.</label>
            <input type="text" value={legalData.application_no} onChange={e=>setLegalData({...legalData, application_no: e.target.value})} className="w-full h-11 px-3 border rounded-[10px] dark:bg-navy-900 dark:border-navy-700 dark:text-white" />
         </div>
         <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Amount Agreed / Paid Info</label>
            <input type="text" placeholder="e.g. RS-10,000$ (BY CASH)" value={legalData.amount_agreed} onChange={e=>setLegalData({...legalData, amount_agreed: e.target.value})} className="w-full h-11 px-3 border rounded-[10px] dark:bg-navy-900 dark:border-navy-700 dark:text-white" />
         </div>
         <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Signature of Payee / Doc Received</label>
            <input type="text" placeholder="e.g. DONE / YES" value={legalData.signature_of_payee} onChange={e=>setLegalData({...legalData, signature_of_payee: e.target.value})} className="w-full h-11 px-3 border rounded-[10px] dark:bg-navy-900 dark:border-navy-700 dark:text-white" />
         </div>
         <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Document Received Date</label>
            <input type="text" placeholder="e.g. 23.09.2024" value={legalData.document_received_date} onChange={e=>setLegalData({...legalData, document_received_date: e.target.value})} className="w-full h-11 px-3 border rounded-[10px] dark:bg-navy-900 dark:border-navy-700 dark:text-white" />
         </div>
         <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Progress Details (Log)</label>
            <textarea value={legalData.progress_details} onChange={e=>setLegalData({...legalData, progress_details: e.target.value})} className="w-full min-h-[100px] p-3 border rounded-[10px] dark:bg-navy-900 dark:border-navy-700 dark:text-white"></textarea>
         </div>
      </div>
    </Card>
  );
};

export default TabLegal;
