import React, { useState, useRef } from "react";
import Card from "components/card";
import { 
  MdAdd, MdCheckCircle, MdEdit, MdUploadFile, MdFileDownload, 
  MdClose, MdAttachMoney, MdPictureAsPdf, MdOutlineDescription
} from "react-icons/md";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);

const TabEstimate = ({ leadData, isClient = false }) => {
  const [activeEstimateId, setActiveEstimateId] = useState(null);
  
  // High-level summary
  const [projectEstimate, setProjectEstimate] = useState("");
  const [clientBudget, setClientBudget] = useState("");
  
  // Proposals list
  const [proposals, setProposals] = useState([]);
  
  // Modals
  const [showAddProposal, setShowAddProposal] = useState(false);
  const [newProposal, setNewProposal] = useState({ title: "", amount: "", isFinal: false, file: null, date: new Date().toISOString().split('T')[0] });

  React.useEffect(() => {
    if (leadData?.id) fetchEstimates();
  }, [leadData]);
  
  const fetchEstimates = async () => {
    if (!leadData?.id) return;
    const { data } = await supabase.from('lead_estimates')
      .select('*')
      .eq(isClient ? 'client_id' : 'lead_id', leadData.id)
      .order('created_at', { ascending: false });
      
    if (data && data.length > 0) {
      const record = data[0];
      setActiveEstimateId(record.id);
      setProjectEstimate(record.summary?.estimatedCost || "");
      setClientBudget(record.summary?.clientBudget || "");
      setProposals(record.items || []); // using items to store proposals array
    }
  };
  
  const handleSaveData = async (updatedProposals = proposals, est = projectEstimate, bdg = clientBudget) => {
    const payload = {
      lead_id: isClient ? null : leadData.id,
      client_id: isClient ? leadData.id : null,
      version_name: 'Quotation Data',
      workflow_stage: 'Active',
      items: updatedProposals,
      summary: { estimatedCost: est, clientBudget: bdg, profitMargin: "", builtUpArea: "" },
      notes: ""
    };

    if (!activeEstimateId) {
      const { data, error } = await supabase.from('lead_estimates').insert([payload]).select();
      if (!error && data) setActiveEstimateId(data[0].id);
    } else {
      await supabase.from('lead_estimates').update(payload).eq('id', activeEstimateId);
    }
  };

  const handleUpdateAmounts = (field, val) => {
    if (field === 'estimate') {
      setProjectEstimate(val);
      handleSaveData(proposals, val, clientBudget);
    } else {
      setClientBudget(val);
      handleSaveData(proposals, projectEstimate, val);
    }
  };

  const handleAddProposal = async () => {
    if (!newProposal.title) {
       alert("Proposal title is required.");
       return;
    }
    
    // In a real app, upload newProposal.file to Supabase Storage here and get URL.
    // For now, we mock the file attachment.
    const proposalObj = {
      id: Date.now(),
      title: newProposal.title,
      amount: newProposal.amount,
      isFinal: newProposal.isFinal,
      date: newProposal.date,
      fileUrl: newProposal.file ? URL.createObjectURL(newProposal.file) : null,
      fileName: newProposal.file ? newProposal.file.name : null
    };

    const updatedProposals = [proposalObj, ...proposals];
    setProposals(updatedProposals);
    await handleSaveData(updatedProposals);
    setShowAddProposal(false);
    setNewProposal({ title: "", amount: "", isFinal: false, file: null, date: new Date().toISOString().split('T')[0] });
  };

  const markAsFinal = async (id) => {
    const updated = proposals.map(p => ({ ...p, isFinal: p.id === id }));
    setProposals(updated);
    await handleSaveData(updated);
  };

  const deleteProposal = async (id) => {
    const updated = proposals.filter(p => p.id !== id);
    setProposals(updated);
    await handleSaveData(updated);
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Section: High-level Estimate & Budget */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* Project Estimate Card */}
         <Card extra="p-6 relative overflow-hidden group border border-[#E2E8F0]">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <MdOutlineDescription size={80} />
            </div>
            <p className="text-[14px] font-bold text-[#64748B] uppercase mb-2 tracking-wide">Project Estimate</p>
            <div className="flex items-center gap-2">
               <span className="text-[28px] font-bold text-[#0F172A]">₹</span>
               <input 
                  type="number" 
                  value={projectEstimate}
                  onChange={(e) => setProjectEstimate(e.target.value)}
                  onBlur={(e) => handleUpdateAmounts('estimate', e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-transparent text-[32px] font-bold text-[#0F172A] outline-none placeholder:text-gray-300 border-b-2 border-transparent focus:border-[#2563EB] transition-colors pb-1"
               />
            </div>
            <p className="text-[13px] text-[#64748B] mt-2">Internal calculation for the total project cost.</p>
         </Card>

         {/* Client Budget Card */}
         <Card extra="p-6 relative overflow-hidden group border border-[#E2E8F0]">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <MdAttachMoney size={80} />
            </div>
            <p className="text-[14px] font-bold text-[#64748B] uppercase mb-2 tracking-wide">Client Budget</p>
            <div className="flex items-center gap-2">
               <span className="text-[28px] font-bold text-[#2563EB]">₹</span>
               <input 
                  type="number" 
                  value={clientBudget}
                  onChange={(e) => setClientBudget(e.target.value)}
                  onBlur={(e) => handleUpdateAmounts('budget', e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-transparent text-[32px] font-bold text-[#2563EB] outline-none placeholder:text-blue-200 border-b-2 border-transparent focus:border-[#2563EB] transition-colors pb-1"
               />
            </div>
            <p className="text-[13px] text-[#64748B] mt-2">Maximum amount the client is willing to spend.</p>
         </Card>
      </div>

      {/* Proposals Sent Section */}
      <Card extra="p-6">
         <div className="flex justify-between items-center mb-6 border-b border-[#E2E8F0] pb-4">
           <div>
             <h3 className="text-[18px] font-bold text-[#0F172A]">Proposals Sent</h3>
             <p className="text-[13px] text-[#64748B] mt-1">Track the history of quotations sent to the client.</p>
           </div>
           <button onClick={() => setShowAddProposal(true)} className="flex items-center gap-2 h-10 px-5 rounded-[10px] bg-[#2563EB] font-bold text-white hover:bg-[#1D4ED8] transition shadow-sm">
              <MdAdd size={20} /> Add Next Proposal
           </button>
         </div>

         <div className="space-y-4">
            {proposals.length === 0 ? (
               <div className="text-center py-10 border-2 border-dashed border-[#E2E8F0] rounded-[16px] bg-gray-50">
                  <div className="text-gray-400 mb-2 flex justify-center"><MdPictureAsPdf size={48} /></div>
                  <h4 className="text-[16px] font-bold text-[#0F172A]">No proposals sent yet</h4>
                  <p className="text-[14px] text-[#64748B] max-w-sm mx-auto mt-1">Create and attach your first proposal to keep track of quotation versions.</p>
               </div>
            ) : (
               <div className="relative border-l-2 border-[#E2E8F0] ml-4 pl-6 space-y-6">
                 {proposals.map((prop, index) => (
                    <div key={prop.id} className="relative group">
                       {/* Timeline dot */}
                       <div className={`absolute -left-[31px] top-1 h-4 w-4 rounded-full border-4 border-white ${prop.isFinal ? 'bg-[#10B981]' : 'bg-[#2563EB] shadow-sm'}`}></div>
                       
                       <div className={`p-5 rounded-[12px] border ${prop.isFinal ? 'border-[#10B981] bg-[#ECFDF5]' : 'border-[#E2E8F0] bg-white hover:border-[#CBD5E1]'} transition-all`}>
                          <div className="flex justify-between items-start flex-wrap gap-4">
                             <div>
                                <div className="flex items-center gap-3 mb-1">
                                  <h4 className="text-[16px] font-bold text-[#0F172A]">{prop.title}</h4>
                                  {prop.isFinal && <span className="bg-[#10B981] text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide flex items-center gap-1"><MdCheckCircle size={12}/> Final</span>}
                                  {index === 0 && !prop.isFinal && <span className="bg-blue-100 text-[#2563EB] text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">Latest</span>}
                                </div>
                                <p className="text-[13px] text-[#64748B]">{new Date(prop.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                             </div>
                             
                             <div className="text-right">
                                <p className="text-[12px] font-bold text-[#64748B] uppercase">Amount Quoted</p>
                                <p className="text-[18px] font-bold text-[#0F172A]">₹ {prop.amount ? Number(prop.amount).toLocaleString('en-IN') : "—"}</p>
                             </div>
                          </div>

                          <div className="mt-4 pt-4 border-t border-[#E2E8F0]/60 flex items-center justify-between">
                             <div className="flex items-center gap-3">
                                {prop.fileName ? (
                                   <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg text-sm text-[#0F172A] font-medium border border-gray-200">
                                      <MdPictureAsPdf className="text-red-500" size={18} />
                                      {prop.fileName}
                                      {prop.fileUrl && (
                                         <a href={prop.fileUrl} target="_blank" rel="noreferrer" className="ml-2 text-[#2563EB] hover:underline flex items-center"><MdFileDownload/></a>
                                      )}
                                   </div>
                                ) : (
                                   <span className="text-[13px] text-gray-400 italic">No file attached</span>
                                )}
                             </div>
                             
                             <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                {!prop.isFinal && (
                                   <button onClick={() => markAsFinal(prop.id)} className="text-[13px] font-bold text-[#10B981] hover:underline">Mark as Final</button>
                                )}
                                <button onClick={() => deleteProposal(prop.id)} className="text-[13px] font-bold text-red-500 hover:underline">Delete</button>
                             </div>
                          </div>
                       </div>
                    </div>
                 ))}
               </div>
            )}
         </div>
      </Card>

      {/* Add Proposal Modal */}
      {showAddProposal && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-[500px] bg-white rounded-[20px] shadow-2xl overflow-hidden animate-slide-up">
               <div className="flex justify-between items-center p-6 border-b border-[#E2E8F0] bg-gray-50/50">
                  <h3 className="text-[18px] font-bold text-[#0F172A]">Add Next Proposal</h3>
                  <MdClose className="text-2xl cursor-pointer text-gray-500 hover:text-black transition" onClick={() => setShowAddProposal(false)} />
               </div>
               
               <div className="p-6 space-y-5">
                  <div>
                     <label className="block text-[13px] font-bold text-[#475569] mb-1">Proposal Title *</label>
                     <input 
                        type="text" 
                        value={newProposal.title}
                        onChange={(e) => setNewProposal({...newProposal, title: e.target.value})}
                        className="w-full h-11 border border-[#E2E8F0] rounded-[10px] px-3 outline-none focus:border-[#2563EB] text-[14px]" 
                        placeholder="e.g., Initial Quotation V1" 
                     />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-[13px] font-bold text-[#475569] mb-1">Quoted Amount (₹)</label>
                        <input 
                           type="number" 
                           value={newProposal.amount}
                           onChange={(e) => setNewProposal({...newProposal, amount: e.target.value})}
                           className="w-full h-11 border border-[#E2E8F0] rounded-[10px] px-3 outline-none focus:border-[#2563EB] text-[14px]" 
                           placeholder="0.00" 
                        />
                     </div>
                     <div>
                        <label className="block text-[13px] font-bold text-[#475569] mb-1">Date Sent</label>
                        <input 
                           type="date" 
                           value={newProposal.date}
                           onChange={(e) => setNewProposal({...newProposal, date: e.target.value})}
                           className="w-full h-11 border border-[#E2E8F0] rounded-[10px] px-3 outline-none focus:border-[#2563EB] text-[14px]" 
                        />
                     </div>
                  </div>

                  <div>
                     <label className="block text-[13px] font-bold text-[#475569] mb-1">Attach Proposal File (PDF/Doc)</label>
                     <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-[#E2E8F0] hover:border-[#2563EB] rounded-[12px] cursor-pointer bg-gray-50 hover:bg-blue-50/50 transition">
                        <MdUploadFile size={24} className={newProposal.file ? "text-[#2563EB]" : "text-gray-400"} />
                        <span className="text-[13px] font-medium text-gray-500 mt-2">
                           {newProposal.file ? newProposal.file.name : "Click to browse file"}
                        </span>
                        <input 
                           type="file" 
                           className="hidden" 
                           onChange={(e) => setNewProposal({...newProposal, file: e.target.files[0]})}
                        />
                     </label>
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer p-3 border border-[#E2E8F0] rounded-[10px] hover:bg-gray-50">
                     <input 
                        type="checkbox" 
                        checked={newProposal.isFinal}
                        onChange={(e) => setNewProposal({...newProposal, isFinal: e.target.checked})}
                        className="w-5 h-5 rounded border-gray-300 text-[#2563EB] focus:ring-[#2563EB]" 
                     />
                     <div>
                        <p className="text-[14px] font-bold text-[#0F172A]">Mark as Final Proposal</p>
                        <p className="text-[12px] text-[#64748B]">This indicates the client has accepted this specific quote.</p>
                     </div>
                  </label>
               </div>
               
               <div className="p-6 border-t border-[#E2E8F0] flex gap-3 bg-gray-50/50">
                  <button className="flex-1 h-11 border border-[#E2E8F0] bg-white rounded-[10px] text-[14px] font-bold text-[#0F172A] hover:bg-gray-50 transition" onClick={() => setShowAddProposal(false)}>Cancel</button>
                  <button className="flex-1 h-11 bg-[#2563EB] rounded-[10px] text-[14px] font-bold text-white hover:bg-[#1D4ED8] transition shadow-sm" onClick={handleAddProposal}>Save Proposal</button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default TabEstimate;
