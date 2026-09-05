import React, { useState, useEffect } from "react";
import Card from "components/card";
import { createClient } from "@supabase/supabase-js";
import { MdAttachMoney, MdAccountBalanceWallet, MdMoneyOff, MdPayment, MdAdd, MdClose } from "react-icons/md";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);

const TabFinancials = ({ clientData }) => {
  const [loading, setLoading] = useState(true);
  const [financialItems, setFinancialItems] = useState([]);
  const [totals, setTotals] = useState({ amount: 0, paid: 0, due: 0 });

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [newPayment, setNewPayment] = useState({ amount: "", date: new Date().toISOString().split("T")[0], mode: "Bank Transfer", note: "" });

  const fetchData = async () => {
    setLoading(true);
    if (clientData?.id) {
       const [servicesRes, projectsRes] = await Promise.all([
          supabase.from("services").select("*").eq("client_id", clientData.id),
          supabase.from("projects").select("*").eq("client_id", clientData.id)
       ]);
       
       let combined = [];
       if (!servicesRes.error && servicesRes.data) {
          combined = [...combined, ...servicesRes.data.map(s => ({ ...s, _type: 'service', _name: s.title }))];
       }
       if (!projectsRes.error && projectsRes.data) {
          combined = [...combined, ...projectsRes.data.map(p => ({ ...p, _type: 'project', _name: p.title || p.name }))];
       }
       
       let tAmount = 0;
       let tPaid = 0;
       
       const parsedItems = combined.map(item => {
          let total = 0, advance = 0, payments = [];
          try {
             const meta = JSON.parse(item.description || "{}");
             total = parseFloat(meta.financials?.total) || 0;
             advance = parseFloat(meta.financials?.advance) || 0;
             payments = Array.isArray(meta.payments) ? meta.payments : [];
          } catch(e) {}
          
          const paid = advance + payments.reduce((acc, p) => acc + (parseFloat(p.amount) || 0), 0);
          const due = total - paid;
          
          tAmount += total;
          tPaid += paid;
          
          return { ...item, _total: total, _paid: paid, _due: due, _payments: payments, _advance: advance };
       });
       
       setFinancialItems(parsedItems);
       setTotals({ amount: tAmount, paid: tPaid, due: tAmount - tPaid });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [clientData?.id]);

  const handleAddPayment = async () => {
    if (!selectedItem || !newPayment.amount || !newPayment.date) {
      alert("Please select a project/service and enter amount & date.");
      return;
    }
    
    const itemToUpdate = financialItems.find(i => i.id === selectedItem);
    if (!itemToUpdate) return;

    try {
       const metadata = JSON.parse(itemToUpdate.description || "{}");
       if (!metadata.payments) metadata.payments = [];
       
       const paymentRecord = { id: Date.now(), ...newPayment };
       metadata.payments.push(paymentRecord);
       
       await supabase.from(itemToUpdate._type === 'service' ? "services" : "projects").update({
          description: JSON.stringify(metadata)
       }).eq("id", itemToUpdate.id);
       
       // Log to timeline
       const userStr = localStorage.getItem('dayal_user');
       const loggedInUser = userStr ? JSON.parse(userStr) : null;
       await supabase.from('lead_activities').insert([{
          client_id: clientData.id,
          employee_name: loggedInUser ? loggedInUser.name : 'System',
          activity_group: 'Timeline',
          activity_type: 'Payment',
          title: `Payment Received for ${itemToUpdate._name}`,
          details: `₹${paymentRecord.amount} via ${paymentRecord.mode}`
       }]);

       setShowPaymentModal(false);
       setNewPayment({ amount: "", date: new Date().toISOString().split("T")[0], mode: "Bank Transfer", note: "" });
       fetchData();
       alert("Payment added successfully!");
    } catch (e) {
       alert("Error adding payment: " + e.message);
    }
  };

  if (loading) return <div className="p-12 text-center text-[#64748B]">Calculating financials...</div>;

  return (
    <div className="animate-fade-in flex flex-col gap-6">
       
       {/* Top Summary Cards */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card extra="p-6 relative overflow-hidden border border-[#E2E8F0]">
             <div className="absolute right-0 top-0 p-4 opacity-[0.05]"><MdAccountBalanceWallet size={80}/></div>
             <p className="text-[14px] font-bold text-[#64748B] uppercase tracking-wide mb-2">Total Project Value</p>
             <p className="text-[32px] font-bold text-[#0F172A]">₹ {totals.amount.toLocaleString('en-IN')}</p>
             <p className="text-[13px] text-[#64748B] mt-2">Combined value of all services and projects.</p>
          </Card>
          
          <Card extra="p-6 relative overflow-hidden border border-[#E2E8F0]">
             <div className="absolute right-0 top-0 p-4 opacity-[0.05]"><MdAttachMoney size={80}/></div>
             <p className="text-[14px] font-bold text-[#64748B] uppercase tracking-wide mb-2">Total Received</p>
             <p className="text-[32px] font-bold text-[#10B981]">₹ {totals.paid.toLocaleString('en-IN')}</p>
             <p className="text-[13px] text-[#64748B] mt-2">Payments received to date.</p>
          </Card>
          
          <Card extra="p-6 relative overflow-hidden border border-[#E2E8F0]">
             <div className="absolute right-0 top-0 p-4 opacity-[0.05]"><MdMoneyOff size={80}/></div>
             <p className="text-[14px] font-bold text-[#64748B] uppercase tracking-wide mb-2">Total Outstanding Due</p>
             <p className="text-[32px] font-bold text-[#DC2626]">₹ {totals.due.toLocaleString('en-IN')}</p>
             <p className="text-[13px] text-[#64748B] mt-2">Remaining balance to be collected.</p>
          </Card>
       </div>

       {/* Detailed Breakdown */}
       <Card extra="p-6 border border-[#E2E8F0]">
          <div className="flex justify-between items-center mb-6">
             <div>
                <h3 className="text-[18px] font-bold text-[#0F172A]">Financial Breakdown</h3>
                <p className="text-[13px] text-[#64748B]">Individual breakdown per service and project.</p>
             </div>
             <button onClick={() => setShowPaymentModal(true)} className="flex items-center gap-2 h-10 px-5 rounded-xl bg-[#2563EB] font-bold text-white hover:bg-[#1D4ED8] transition shadow-sm">
                <MdAdd size={20}/> Add Payment
             </button>
          </div>
          
          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
                <thead>
                   <tr className="bg-gray-50 border-y border-[#E2E8F0]">
                      <th className="py-3 px-4 text-[12px] font-bold text-[#475569] uppercase">Project / Service</th>
                      <th className="py-3 px-4 text-[12px] font-bold text-[#475569] uppercase">Type</th>
                      <th className="py-3 px-4 text-[12px] font-bold text-[#475569] uppercase text-right">Total Amount</th>
                      <th className="py-3 px-4 text-[12px] font-bold text-[#475569] uppercase text-right">Paid</th>
                      <th className="py-3 px-4 text-[12px] font-bold text-[#475569] uppercase text-right">Due</th>
                   </tr>
                </thead>
                <tbody>
                   {financialItems.length === 0 ? (
                      <tr><td colSpan="5" className="py-8 text-center text-[13px] text-[#64748B]">No projects or services found.</td></tr>
                   ) : (
                      financialItems.map(item => (
                         <tr key={item.id} className="border-b border-[#E2E8F0] hover:bg-gray-50/50 transition">
                            <td className="py-4 px-4">
                               <div className="font-bold text-[#0F172A]">{item._name}</div>
                               <div className="text-[11px] text-[#64748B] mt-0.5">{item._type === 'service' ? 'SRV-' : 'PRJ-'}{item.id.substring(0,5)}</div>
                            </td>
                            <td className="py-4 px-4">
                               <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${item._type === 'service' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'}`}>
                                  {item._type}
                               </span>
                            </td>
                            <td className="py-4 px-4 text-right font-bold text-[#0F172A]">₹ {item._total.toLocaleString('en-IN')}</td>
                            <td className="py-4 px-4 text-right font-bold text-[#10B981]">₹ {item._paid.toLocaleString('en-IN')}</td>
                            <td className="py-4 px-4 text-right font-bold text-[#DC2626]">₹ {item._due.toLocaleString('en-IN')}</td>
                         </tr>
                      ))
                   )}
                </tbody>
             </table>
          </div>
       </Card>

       {/* Add Payment Modal */}
       {showPaymentModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
             <div className="w-full max-w-[500px] bg-white rounded-[20px] shadow-2xl overflow-hidden animate-slide-up">
                <div className="flex justify-between items-center p-6 border-b border-[#E2E8F0] bg-gray-50/50">
                   <h3 className="text-[18px] font-bold text-[#0F172A]">Record New Payment</h3>
                   <MdClose className="text-2xl cursor-pointer text-gray-500 hover:text-black transition" onClick={() => setShowPaymentModal(false)} />
                </div>
                
                <div className="p-6 space-y-5">
                   <div>
                      <label className="block text-[13px] font-bold text-[#475569] mb-1">Select Project / Service</label>
                      <select 
                         value={selectedItem} 
                         onChange={e => setSelectedItem(e.target.value)}
                         className="w-full h-11 border border-[#E2E8F0] rounded-[10px] px-3 outline-none focus:border-[#2563EB] text-[14px] bg-white"
                      >
                         <option value="">-- Choose --</option>
                         {financialItems.map(item => (
                            <option key={item.id} value={item.id}>
                               {item._name} (Due: ₹ {item._due.toLocaleString('en-IN')})
                            </option>
                         ))}
                      </select>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                         <label className="block text-[13px] font-bold text-[#475569] mb-1">Payment Amount (₹)</label>
                         <input 
                            type="number" 
                            value={newPayment.amount}
                            onChange={(e) => setNewPayment({...newPayment, amount: e.target.value})}
                            className="w-full h-11 border border-[#E2E8F0] rounded-[10px] px-3 outline-none focus:border-[#2563EB] text-[14px]" 
                            placeholder="0.00" 
                         />
                      </div>
                      <div>
                         <label className="block text-[13px] font-bold text-[#475569] mb-1">Date Received</label>
                         <input 
                            type="date" 
                            value={newPayment.date}
                            onChange={(e) => setNewPayment({...newPayment, date: e.target.value})}
                            className="w-full h-11 border border-[#E2E8F0] rounded-[10px] px-3 outline-none focus:border-[#2563EB] text-[14px]" 
                         />
                      </div>
                   </div>

                   <div>
                      <label className="block text-[13px] font-bold text-[#475569] mb-1">Payment Mode</label>
                      <select 
                         value={newPayment.mode}
                         onChange={(e) => setNewPayment({...newPayment, mode: e.target.value})}
                         className="w-full h-11 border border-[#E2E8F0] rounded-[10px] px-3 outline-none focus:border-[#2563EB] text-[14px] bg-white"
                      >
                         <option>Bank Transfer</option>
                         <option>Cash</option>
                         <option>Cheque</option>
                         <option>UPI</option>
                      </select>
                   </div>
                   
                   <div>
                      <label className="block text-[13px] font-bold text-[#475569] mb-1">Notes / Reference</label>
                      <input 
                         type="text" 
                         value={newPayment.note}
                         onChange={(e) => setNewPayment({...newPayment, note: e.target.value})}
                         className="w-full h-11 border border-[#E2E8F0] rounded-[10px] px-3 outline-none focus:border-[#2563EB] text-[14px]" 
                         placeholder="e.g. UTR Number or Cash Receipt" 
                      />
                   </div>
                </div>
                
                <div className="p-6 border-t border-[#E2E8F0] flex gap-3 bg-gray-50/50">
                   <button className="flex-1 h-11 border border-[#E2E8F0] bg-white rounded-[10px] text-[14px] font-bold text-[#0F172A] hover:bg-gray-50 transition" onClick={() => setShowPaymentModal(false)}>Cancel</button>
                   <button className="flex-1 h-11 bg-[#2563EB] rounded-[10px] text-[14px] font-bold text-white hover:bg-[#1D4ED8] transition shadow-sm" onClick={handleAddPayment}>Record Payment</button>
                </div>
             </div>
          </div>
       )}
    </div>
  );
};

export default TabFinancials;
