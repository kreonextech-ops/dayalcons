import React, { useState } from "react";
import Card from "components/card";
import { 
  MdAdd, MdEdit, MdDelete, MdContentCopy, MdArrowUpward, 
  MdArrowDownward, MdPictureAsPdf, MdSend, MdFileDownload, MdSave,
  MdClose, MdCheckCircle
} from "react-icons/md";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);

const TabEstimate = ({ leadData, isClient = false }) => {
  const [dbEstimates, setDbEstimates] = useState([]);
  const [versions, setVersions] = useState([]);
  const [activeVersion, setActiveVersion] = useState(null);
  
  // Summary Edit States
  const [summaryData, setSummaryData] = useState({ estimatedCost: "", clientBudget: "", profitMargin: "", builtUpArea: "" });
  const [editingSummary, setEditingSummary] = useState(null);

  // BOQ Table State
  const [boqItems, setBoqItems] = useState([]);
  const [drawerItem, setDrawerItem] = useState(null);

  // Notes & Workflow
  const [workflowStage, setWorkflowStage] = useState("Draft");
  const [notes, setNotes] = useState("");

  React.useEffect(() => {
    if (leadData?.id) fetchEstimates();
  }, [leadData]);
  
  const fetchEstimates = async () => {
    if (!leadData?.id) return;
    const { data } = await supabase.from('lead_estimates').select('*').eq(isClient ? 'client_id' : 'lead_id', leadData.id).order('created_at', { ascending: false });
    if (data && data.length > 0) {
      setDbEstimates(data);
      setVersions(data.map(d => ({ id: d.id, name: d.version_name, status: d.workflow_stage })));
      setActiveVersion(data[0].id);
      setBoqItems(data[0].items || []);
      setNotes(data[0].notes || '');
      setWorkflowStage(data[0].workflow_stage || 'Draft');
      setSummaryData(data[0].summary || { estimatedCost: "", clientBudget: "", profitMargin: "", builtUpArea: "" });
    }
  };
  
  const handleSaveDraft = async () => {
    if (!activeVersion || String(activeVersion).startsWith('V')) {
      const { data, error } = await supabase.from('lead_estimates').insert([{
        lead_id: isClient ? null : leadData.id,
        client_id: isClient ? leadData.id : null,
        version_name: typeof activeVersion === 'string' && activeVersion.startsWith('V') ? versions.find(v => v.id === activeVersion)?.name || 'Version 1' : 'Version 1',
        workflow_stage: workflowStage,
        items: boqItems,
        notes: notes,
        summary: summaryData
      }]).select();
      if (error) { alert('Error: Please run the SQL script to create lead_estimates table.\n' + error.message); return; }
      fetchEstimates();
    } else {
      const { error } = await supabase.from('lead_estimates').update({
        workflow_stage: workflowStage,
        items: boqItems,
        notes: notes,
        summary: summaryData
      }).eq('id', activeVersion);
      if (error) { alert('Error saving.\n' + error.message); return; }
      fetchEstimates();
    }
    alert(`${isClient ? 'Amount' : 'Quotation'} Saved Successfully!`);
  };
  // Generate dynamic BOQ template based on selected services
  React.useEffect(() => {
    if (boqItems.length === 0 && leadData?.selectedServices?.length > 0) {
      let initialItems = [];
      const services = leadData.selectedServices;

      if (services.includes("Residential Construction") || services.includes("Commercial Construction")) {
        initialItems.push(
          { id: Date.now() + 1, item: "Excavation & Foundation", category: "Civil Works", qty: "", unit: "cu.ft", rate: "", amount: 0, tax: "", discount: "", remarks: "" },
          { id: Date.now() + 2, item: "RCC Structure", category: "Civil Works", qty: "", unit: "cu.ft", rate: "", amount: 0, tax: "", discount: "", remarks: "" },
          { id: Date.now() + 3, item: "Brick Work", category: "Civil Works", qty: "", unit: "sq.ft", rate: "", amount: 0, tax: "", discount: "", remarks: "" }
        );
      }
      if (services.includes("Interior Design")) {
        initialItems.push(
          { id: Date.now() + 4, item: "Modular Kitchen", category: "Interiors", qty: "1", unit: "Lumpsum", rate: "", amount: 0, tax: "", discount: "", remarks: "" },
          { id: Date.now() + 5, item: "Wardrobes & Carpentry", category: "Interiors", qty: "", unit: "sq.ft", rate: "", amount: 0, tax: "", discount: "", remarks: "" },
          { id: Date.now() + 6, item: "False Ceiling", category: "Interiors", qty: "", unit: "sq.ft", rate: "", amount: 0, tax: "", discount: "", remarks: "" }
        );
      }
      if (services.includes("Painting & Epoxy Flooring")) {
        initialItems.push(
          { id: Date.now() + 7, item: "Primer & Putty", category: "Painting", qty: "", unit: "sq.ft", rate: "", amount: 0, tax: "", discount: "", remarks: "" },
          { id: Date.now() + 8, item: "Premium Emulsion Paint", category: "Painting", qty: "", unit: "sq.ft", rate: "", amount: 0, tax: "", discount: "", remarks: "" }
        );
      }
      if (services.includes("Electrical & Plumbing")) {
        initialItems.push(
          { id: Date.now() + 9, item: "Concealed Wiring & DB", category: "MEP", qty: "1", unit: "Lumpsum", rate: "", amount: 0, tax: "", discount: "", remarks: "" },
          { id: Date.now() + 10, item: "Plumbing Lines & Fixtures", category: "MEP", qty: "1", unit: "Lumpsum", rate: "", amount: 0, tax: "", discount: "", remarks: "" }
        );
      }
      if (services.includes("2D Floor Plan Design") || services.includes("3D Elevation Design")) {
        initialItems.push(
          { id: Date.now() + 11, item: "Architectural Drawings", category: "Consultancy", qty: "1", unit: "Lumpsum", rate: "", amount: 0, tax: "", discount: "", remarks: "" }
        );
      }
      setBoqItems(initialItems);
    }
  }, [leadData?.selectedServices]);

  const handleAddVersion = () => {
    const newV = { id: `V${versions.length + 1}`, name: `Version ${versions.length + 1}`, status: "Draft" };
    setVersions([...versions, newV]);
    setActiveVersion(newV.id);
  };

  const handleAddBoqItem = () => {
    setBoqItems([...boqItems, { id: Date.now(), item: "", category: "", qty: "", unit: "", rate: "", amount: 0, tax: "", discount: "", remarks: "" }]);
  };

  const updateBoqItem = (id, field, value) => {
    setBoqItems(boqItems.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        const q = parseFloat(updated.qty) || 0;
        const r = parseFloat(updated.rate) || 0;
        updated.amount = q * r;
        return updated;
      }
      return item;
    }));
  };

  const deleteBoqItem = (id) => {
    setBoqItems(boqItems.filter(item => item.id !== id));
  };

  const calculateTotal = () => boqItems.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);

  return (
    <div className="w-full space-y-4">
      {/* 1. Header & Version Control */}
      <Card extra="p-6 relative">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-[20px] font-semibold text-[#0F172A]">{isClient ? "Amount" : "Quotation & BOQ"}</h2>
            <div className="flex gap-2 text-sm text-[#64748B] mt-1">
              <span>{leadData?.name || "No Client Selected"}</span>
              <span>•</span>
              <span className="font-bold text-[#2563EB]">{activeVersion ? versions.find(v=>v.id===activeVersion)?.name : 'Draft V1'}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right">
               <p className="text-[10px] font-bold text-[#64748B] uppercase">Current Version</p>
               <p className="text-[16px] font-bold text-[#0F172A]">{activeVersion || "None"}</p>
             </div>
             {activeVersion && (
               <span className="bg-[#2563EB] text-white px-3 py-1 rounded-full text-xs font-bold tracking-wide">{workflowStage.toUpperCase()}</span>
             )}
             <button onClick={handleAddVersion} className="flex items-center gap-2 h-10 px-4 rounded-[10px] bg-[#2563EB] font-bold text-white hover:opacity-90 transition">
               <MdAdd /> New Version
             </button>
          </div>
        </div>
      </Card>

      {/* 2. Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { key: "estimatedCost", label: isClient ? "Total Amount" : "Estimated Cost", val: summaryData.estimatedCost },
          { key: "clientBudget", label: isClient ? "Amount Paid" : "Client Budget", val: summaryData.clientBudget },
          { key: "profitMargin", label: isClient ? "Remaining Amount" : "Profit Margin", val: isClient ? (Number(summaryData.estimatedCost || 0) - Number(summaryData.clientBudget || 0)).toString() : summaryData.profitMargin },
          { key: "builtUpArea", label: "Built-up Area (sq.ft)", val: summaryData.builtUpArea },
        ].map(card => (
          <Card key={card.key} extra="p-6 cursor-pointer hover:border-[#2563EB] border border-[#E2E8F0] transition" onClick={() => setEditingSummary(card.key)}>
             <p className="text-[12px] font-bold text-[#64748B] uppercase mb-1">{card.label}</p>
             {editingSummary === card.key ? (
                <input 
                  type="text" 
                  autoFocus 
                  onBlur={() => setEditingSummary(null)} 
                  onChange={e => setSummaryData({...summaryData, [card.key]: e.target.value})} 
                  value={card.val}
                  placeholder="Enter value"
                  className="w-full border-b border-[#2563EB] outline-none text-[20px] font-bold text-[#0F172A] bg-transparent"
                />
             ) : (
                <p className="text-[20px] font-bold text-[#0F172A]">{card.val || "—"}</p>
             )}
          </Card>
        ))}
      </div>

      {/* 3. Version Manager & 8. Approval Workflow */}
      <Card extra="p-4 flex flex-col md:flex-row justify-between items-center gap-4">
         <div className="flex gap-2 overflow-x-auto w-full">
            {versions.length === 0 ? (
               <div className="text-sm text-gray-500 italic py-2">No versions created yet.</div>
            ) : (
               versions.map(v => (
                 <button key={v.id} onClick={() => setActiveVersion(v.id)} className={`px-4 py-2 rounded-lg text-sm font-bold transition whitespace-nowrap ${activeVersion === v.id ? 'bg-[#2563EB] text-white' : 'bg-gray-100 text-[#475569] hover:bg-gray-200'}`}>
                   {v.name}
                 </button>
               ))
            )}
         </div>
         {activeVersion && (
           <div className="flex items-center gap-2 border border-[#E2E8F0] rounded-lg p-1 bg-gray-50">
             {["Draft", "Review", "Sent", "Accepted"].map(stage => (
               <button 
                 key={stage} 
                 onClick={() => setWorkflowStage(stage)}
                 className={`px-3 py-1 rounded text-xs font-bold transition ${workflowStage === stage ? 'bg-white text-[#0F172A] shadow-sm' : 'text-[#64748B] hover:text-[#0F172A]'}`}
               >
                 {stage}
               </button>
             ))}
           </div>
         )}
      </Card>

      {/* 4. Editable BOQ Table */}
      <Card extra="p-6 min-h-[300px]">
         <div className="flex justify-between items-center mb-4">
           <h3 className="text-[16px] font-semibold text-[#0F172A]">Bill of Quantities (BOQ)</h3>
           <button onClick={handleAddBoqItem} disabled={!activeVersion} className={`flex items-center gap-2 text-sm font-bold transition ${activeVersion ? 'text-[#2563EB] hover:opacity-80' : 'text-gray-400 cursor-not-allowed'}`}>
              <MdAdd /> Add BOQ Item
           </button>
         </div>
         
         <div className="overflow-x-auto w-full">
           <table className="w-full text-left border-collapse min-w-[800px]">
             <thead>
               <tr className="border-b border-[#E2E8F0] text-xs text-[#64748B] uppercase">
                 <th className="pb-2 font-bold w-1/4">Item</th>
                 <th className="pb-2 font-bold w-1/6">Category</th>
                 <th className="pb-2 font-bold w-24">Qty</th>
                 <th className="pb-2 font-bold w-24">Unit</th>
                 <th className="pb-2 font-bold w-32">Rate</th>
                 <th className="pb-2 font-bold w-32">Amount</th>
                 <th className="pb-2 font-bold text-center w-24">Actions</th>
               </tr>
             </thead>
             <tbody>
               {boqItems.length === 0 ? (
                 <tr><td colSpan="7" className="py-8 text-center text-sm text-gray-500 italic">No items added to this version yet.</td></tr>
               ) : (
                 boqItems.map(item => (
                   <tr key={item.id} className="border-b border-[#EDF2F7] hover:bg-gray-50 transition group">
                     <td className="py-2 pr-2">
                       <input type="text" value={item.item} onChange={e => updateBoqItem(item.id, 'item', e.target.value)} placeholder="Enter item name" className="w-full bg-transparent border border-transparent hover:border-[#E2E8F0] focus:border-[#2563EB] rounded px-2 py-1 text-sm outline-none" />
                     </td>
                     <td className="py-2 pr-2">
                       <input type="text" value={item.category} onChange={e => updateBoqItem(item.id, 'category', e.target.value)} placeholder="Category" className="w-full bg-transparent border border-transparent hover:border-[#E2E8F0] focus:border-[#2563EB] rounded px-2 py-1 text-sm outline-none" />
                     </td>
                     <td className="py-2 pr-2">
                       <input type="number" value={item.qty} onChange={e => updateBoqItem(item.id, 'qty', e.target.value)} placeholder="0" className="w-full bg-transparent border border-transparent hover:border-[#E2E8F0] focus:border-[#2563EB] rounded px-2 py-1 text-sm outline-none" />
                     </td>
                     <td className="py-2 pr-2">
                       <input type="text" value={item.unit} onChange={e => updateBoqItem(item.id, 'unit', e.target.value)} placeholder="Unit" className="w-full bg-transparent border border-transparent hover:border-[#E2E8F0] focus:border-[#2563EB] rounded px-2 py-1 text-sm outline-none" />
                     </td>
                     <td className="py-2 pr-2">
                       <input type="number" value={item.rate} onChange={e => updateBoqItem(item.id, 'rate', e.target.value)} placeholder="0.00" className="w-full bg-transparent border border-transparent hover:border-[#E2E8F0] focus:border-[#2563EB] rounded px-2 py-1 text-sm outline-none" />
                     </td>
                     <td className="py-2 pr-2">
                       <span className="px-2 py-1 text-sm font-semibold text-[#0F172A]">{item.amount > 0 ? item.amount.toFixed(2) : "—"}</span>
                     </td>
                     <td className="py-2 text-center text-gray-400 opacity-0 group-hover:opacity-100 transition">
                        <div className="flex justify-center gap-2 text-lg">
                          <MdEdit className="cursor-pointer hover:text-[#2563EB]" onClick={() => setDrawerItem(item)} />
                          <MdDelete className="cursor-pointer hover:text-red-500" onClick={() => deleteBoqItem(item.id)} />
                        </div>
                     </td>
                   </tr>
                 ))
               )}
             </tbody>
           </table>
         </div>
      </Card>

      {/* 5. Cost Summary & 6. Negotiation Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Notes */}
         <Card extra="p-6">
            <h3 className="text-[16px] font-semibold text-[#0F172A] mb-4">Negotiation Notes</h3>
            <textarea 
               className="w-full min-h-[200px] rounded-[10px] border border-[#E2E8F0] p-4 text-sm text-[#475569] outline-none focus:border-[#2563EB]"
               placeholder="Add negotiation discussion, client objections, price revisions, or approval notes..."
               value={notes}
               onChange={e => setNotes(e.target.value)}
            ></textarea>
         </Card>

         {/* Summary */}
         <Card extra="p-6 bg-[#F8FAFC]">
            <h3 className="text-[16px] font-semibold text-[#0F172A] mb-4">Cost Summary</h3>
            <div className="space-y-4 text-sm text-[#475569]">
               <div className="flex justify-between border-b border-[#E2E8F0] pb-2">
                 <span>Subtotal</span>
                 <span className="font-semibold text-[#0F172A]">{calculateTotal() > 0 ? calculateTotal().toFixed(2) : "—"}</span>
               </div>
               <div className="flex justify-between border-b border-[#E2E8F0] pb-2">
                 <span>GST</span>
                 <span className="font-semibold text-[#0F172A]">—</span>
               </div>
               <div className="flex justify-between border-b border-[#E2E8F0] pb-2">
                 <span>Discount</span>
                 <span className="font-semibold text-[#0F172A]">—</span>
               </div>
               <div className="flex justify-between border-b border-[#E2E8F0] pb-2">
                 <span>Other Charges</span>
                 <span className="font-semibold text-[#0F172A]">—</span>
               </div>
               <div className="flex justify-between pt-2">
                 <span className="text-[16px] font-bold text-[#0F172A]">Grand Total</span>
                 <span className="text-[20px] font-bold text-[#2563EB]">{calculateTotal() > 0 ? calculateTotal().toFixed(2) : "—"}</span>
               </div>
            </div>
         </Card>
      </div>

      {/* 7. Actions */}
      <div className="flex flex-wrap justify-end gap-3 mt-4">
        <button onClick={handleSaveDraft} className="h-10 px-6 rounded-[10px] border border-[#E2E8F0] bg-white text-sm font-bold text-[#0F172A] hover:bg-gray-50 transition">Save Draft</button>
        <button disabled={boqItems.length === 0} className={`h-10 flex items-center gap-2 px-6 rounded-[10px] border border-[#E2E8F0] bg-white text-sm font-bold transition ${boqItems.length > 0 ? 'text-[#0F172A] hover:bg-gray-50' : 'text-gray-400 cursor-not-allowed opacity-50'}`}>
           <MdFileDownload /> Export Excel
        </button>
        <button disabled={boqItems.length === 0} className={`h-10 flex items-center gap-2 px-6 rounded-[10px] border border-[#E2E8F0] bg-white text-sm font-bold transition ${boqItems.length > 0 ? 'text-[#0F172A] hover:bg-gray-50' : 'text-gray-400 cursor-not-allowed opacity-50'}`}>
           <MdPictureAsPdf /> Generate PDF
        </button>
        <button disabled={boqItems.length === 0} className={`h-10 flex items-center gap-2 px-6 rounded-[10px] bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-sm font-bold text-white transition ${boqItems.length > 0 ? 'hover:opacity-90 shadow-md' : 'opacity-50 cursor-not-allowed'}`}>
           <MdSend /> Send to Client
        </button>
      </div>

      {/* Right-side Edit Drawer (Overlay) */}
      {drawerItem && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-black/20 backdrop-blur-sm">
           <div className="w-full max-w-[420px] bg-white h-full shadow-2xl flex flex-col animate-slide-left">
              <div className="flex justify-between items-center p-6 border-b border-[#E2E8F0]">
                 <h3 className="text-lg font-bold text-[#0F172A]">Edit BOQ Row</h3>
                 <MdClose className="text-2xl cursor-pointer text-gray-500 hover:text-black" onClick={() => setDrawerItem(null)} />
              </div>
              <div className="p-6 flex-1 overflow-y-auto space-y-4">
                 <div className="flex flex-col"><label className="text-xs font-bold text-gray-500 mb-1">Item Name</label><input type="text" value={drawerItem.item} onChange={e => setDrawerItem({...drawerItem, item: e.target.value})} className="border border-[#E2E8F0] rounded p-2 text-sm outline-none focus:border-[#2563EB]" placeholder="Enter item" /></div>
                 <div className="flex flex-col"><label className="text-xs font-bold text-gray-500 mb-1">Category</label><input type="text" value={drawerItem.category} onChange={e => setDrawerItem({...drawerItem, category: e.target.value})} className="border border-[#E2E8F0] rounded p-2 text-sm outline-none focus:border-[#2563EB]" placeholder="Category" /></div>
                 
                 <div className="grid grid-cols-2 gap-4">
                   <div className="flex flex-col"><label className="text-xs font-bold text-gray-500 mb-1">Quantity</label><input type="number" value={drawerItem.qty} onChange={e => setDrawerItem({...drawerItem, qty: e.target.value})} className="border border-[#E2E8F0] rounded p-2 text-sm outline-none focus:border-[#2563EB]" placeholder="0" /></div>
                   <div className="flex flex-col"><label className="text-xs font-bold text-gray-500 mb-1">Unit</label><input type="text" value={drawerItem.unit} onChange={e => setDrawerItem({...drawerItem, unit: e.target.value})} className="border border-[#E2E8F0] rounded p-2 text-sm outline-none focus:border-[#2563EB]" placeholder="Unit" /></div>
                 </div>

                 <div className="flex flex-col"><label className="text-xs font-bold text-gray-500 mb-1">Rate</label><input type="number" value={drawerItem.rate} onChange={e => setDrawerItem({...drawerItem, rate: e.target.value})} className="border border-[#E2E8F0] rounded p-2 text-sm outline-none focus:border-[#2563EB]" placeholder="0.00" /></div>
                 
                 <div className="grid grid-cols-2 gap-4">
                   <div className="flex flex-col"><label className="text-xs font-bold text-gray-500 mb-1">Tax %</label><input type="number" value={drawerItem.tax} onChange={e => setDrawerItem({...drawerItem, tax: e.target.value})} className="border border-[#E2E8F0] rounded p-2 text-sm outline-none focus:border-[#2563EB]" placeholder="0" /></div>
                   <div className="flex flex-col"><label className="text-xs font-bold text-gray-500 mb-1">Discount %</label><input type="number" value={drawerItem.discount} onChange={e => setDrawerItem({...drawerItem, discount: e.target.value})} className="border border-[#E2E8F0] rounded p-2 text-sm outline-none focus:border-[#2563EB]" placeholder="0" /></div>
                 </div>

                 <div className="flex flex-col"><label className="text-xs font-bold text-gray-500 mb-1">Remarks</label><textarea value={drawerItem.remarks} onChange={e => setDrawerItem({...drawerItem, remarks: e.target.value})} className="border border-[#E2E8F0] rounded p-2 text-sm outline-none focus:border-[#2563EB] min-h-[80px]" placeholder="Enter remarks" /></div>
              </div>
              <div className="p-6 border-t border-[#E2E8F0] flex gap-3">
                 <button className="flex-1 h-10 border border-[#E2E8F0] rounded-[10px] text-sm font-bold text-[#0F172A] hover:bg-gray-50" onClick={() => setDrawerItem(null)}>Cancel</button>
                 <button className="flex-1 h-10 bg-[#2563EB] rounded-[10px] text-sm font-bold text-white hover:bg-[#2563EB]/90" onClick={() => {
                    updateBoqItem(drawerItem.id, 'item', drawerItem.item);
                    updateBoqItem(drawerItem.id, 'category', drawerItem.category);
                    updateBoqItem(drawerItem.id, 'qty', drawerItem.qty);
                    updateBoqItem(drawerItem.id, 'unit', drawerItem.unit);
                    updateBoqItem(drawerItem.id, 'rate', drawerItem.rate);
                    updateBoqItem(drawerItem.id, 'tax', drawerItem.tax);
                    updateBoqItem(drawerItem.id, 'discount', drawerItem.discount);
                    updateBoqItem(drawerItem.id, 'remarks', drawerItem.remarks);
                    setDrawerItem(null);
                 }}>Save Changes</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default TabEstimate;
