import React, { useState, useEffect } from "react";
import Card from "components/card";
import { createClient } from "@supabase/supabase-js";
import { MdAdd, MdSave, MdOutlineReceipt, MdDelete, MdPerson } from "react-icons/md";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);

const TabPayments = ({ serviceCase, onUpdate, isAdmin }) => {
  const [financials, setFinancials] = useState({ total: 0, advance: 0 });
  const [payments, setPayments] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [newPayment, setNewPayment] = useState({ amount: "", date: "", mode: "Bank Transfer", note: "" });
  const [showAdd, setShowAdd] = useState(false);

  const userStr = localStorage.getItem("dayal_user");
  const loggedInUser = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    try {
      const metadata = JSON.parse(serviceCase.description || "{}");
      if (metadata.financials) setFinancials(metadata.financials);
      if (metadata.payments && Array.isArray(metadata.payments)) setPayments(metadata.payments);
    } catch (e) {}
  }, [serviceCase]);

  const totalPaid = (parseFloat(financials.advance) || 0) + payments.reduce((acc, p) => acc + (parseFloat(p.amount) || 0), 0);
  const totalAmount = parseFloat(financials.total) || 0;
  const balance = totalAmount - totalPaid;

  const addPayment = async () => {
    if (!newPayment.amount || !newPayment.date) { alert("Amount and Date are required."); return; }
    const paymentRecord = {
      id: Date.now(),
      ...newPayment,
      recorded_by: loggedInUser?.name || "Unknown",
      recorded_by_id: loggedInUser?.id || null,
      recorded_at: new Date().toISOString(),
    };
    const updatedPayments = [...payments, paymentRecord];
    setPayments(updatedPayments);
    setNewPayment({ amount: "", date: "", mode: "Bank Transfer", note: "" });
    setShowAdd(false);

    // Log to timeline
    await supabase.from("lead_activities").insert([{
      client_id: serviceCase.client_id,
      employee_name: loggedInUser?.name || "System",
      activity_group: "Timeline",
      activity_type: "Payment",
      title: `Payment Recorded: ₹${paymentRecord.amount}`,
      details: `₹${paymentRecord.amount} via ${paymentRecord.mode} on ${paymentRecord.date}. Recorded by: ${paymentRecord.recorded_by}.${paymentRecord.note ? " Note: " + paymentRecord.note : ""}`
    }]);

    // Auto-save
    try {
      const metadata = JSON.parse(serviceCase.description || "{}");
      metadata.financials = financials;
      metadata.payments = updatedPayments;
      await supabase.from("services").update({ description: JSON.stringify(metadata) }).eq("id", serviceCase.id);
      if (onUpdate) onUpdate({ ...serviceCase, description: JSON.stringify(metadata) });
    } catch (e) {}
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const metadata = JSON.parse(serviceCase.description || "{}");
      metadata.financials = financials;
      metadata.payments = payments;
      await supabase.from("services").update({ description: JSON.stringify(metadata) }).eq("id", serviceCase.id);
      if (onUpdate) onUpdate({ ...serviceCase, description: JSON.stringify(metadata) });
      alert("Payments saved!");
    } catch (e) { alert("Failed: " + e.message); }
    setIsSaving(false);
  };

  // EMPLOYEE VIEW: Simple add-payment form only
  if (!isAdmin) {
    return (
      <div className="animate-fade-in max-w-xl mx-auto mt-4">
        <Card extra="p-6">
          <h3 className="text-[18px] font-bold text-[#0F172A] mb-1">Record a Payment</h3>
          <p className="text-sm text-gray-500 mb-6">Enter the payment details received from the client.</p>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Amount Received (₹) *</label>
              <input type="number" value={newPayment.amount} onChange={e => setNewPayment({...newPayment, amount: e.target.value})} placeholder="e.g. 50000" className="w-full h-11 px-4 rounded-xl border border-[#E2E8F0] text-sm outline-none focus:border-[#2563EB]" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Payment Date *</label>
              <input type="date" value={newPayment.date} onChange={e => setNewPayment({...newPayment, date: e.target.value})} className="w-full h-11 px-4 rounded-xl border border-[#E2E8F0] text-sm outline-none focus:border-[#2563EB]" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Payment Mode</label>
              <select value={newPayment.mode} onChange={e => setNewPayment({...newPayment, mode: e.target.value})} className="w-full h-11 px-4 rounded-xl border border-[#E2E8F0] text-sm outline-none focus:border-[#2563EB]">
                <option>Bank Transfer</option>
                <option>Cash</option>
                <option>UPI</option>
                <option>Cheque</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Note (Optional)</label>
              <input type="text" value={newPayment.note} onChange={e => setNewPayment({...newPayment, note: e.target.value})} placeholder="Any additional info..." className="w-full h-11 px-4 rounded-xl border border-[#E2E8F0] text-sm outline-none focus:border-[#2563EB]" />
            </div>
            <button onClick={addPayment} className="mt-2 w-full h-12 bg-[#2563EB] text-white rounded-xl font-bold text-sm hover:bg-[#1D4ED8] transition flex items-center justify-center gap-2">
              <MdAdd size={20} /> Submit Payment Record
            </button>
          </div>
        </Card>
      </div>
    );
  }

  // ADMIN VIEW: Full view with recorded-by info
  return (
    <div className="animate-fade-in flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card extra="p-6 bg-gradient-to-br from-[#0F172A] to-[#334155] text-white">
          <p className="text-[12px] font-semibold uppercase opacity-80 mb-1">Total Value</p>
          <h3 className="text-[28px] font-bold">₹ {totalAmount.toLocaleString()}</h3>
        </Card>
        <Card extra="p-6 border border-green-200 bg-green-50">
          <p className="text-[12px] font-semibold text-green-700 uppercase mb-1">Amount Received</p>
          <h3 className="text-[28px] font-bold text-green-700">₹ {totalPaid.toLocaleString()}</h3>
          <p className="text-[12px] text-green-600 font-medium mt-1">Includes Advance: ₹{financials.advance || 0}</p>
        </Card>
        <Card extra="p-6 border border-red-200 bg-red-50">
          <p className="text-[12px] font-semibold text-red-700 uppercase mb-1">Outstanding Balance</p>
          <h3 className="text-[28px] font-bold text-red-700">₹ {balance.toLocaleString()}</h3>
        </Card>
      </div>

      <Card extra="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[18px] font-bold text-[#0F172A]">Payment Structure &amp; Log</h3>
          <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563EB] text-white font-bold text-sm hover:bg-[#1D4ED8] transition shadow-md">
            <MdSave size={18} /> {isSaving ? "Saving..." : "Save Data"}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-[#E2E8F0]">
          <div>
            <label className="block text-xs font-bold text-[#475569] mb-1">Total Amount (₹)</label>
            <input type="number" value={financials.total} onChange={e => setFinancials({...financials, total: e.target.value})} className="w-full h-11 px-4 rounded-xl border border-[#E2E8F0] text-sm outline-none focus:border-[#2563EB]" />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#475569] mb-1">Advance Amount (₹)</label>
            <input type="number" value={financials.advance} onChange={e => setFinancials({...financials, advance: e.target.value})} className="w-full h-11 px-4 rounded-xl border border-[#E2E8F0] text-sm outline-none focus:border-[#2563EB]" />
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h4 className="text-[15px] font-bold text-[#0F172A]">Payment History</h4>
          <button onClick={() => setShowAdd(!showAdd)} className="text-sm font-bold text-[#2563EB] flex items-center gap-1 hover:underline">
            <MdAdd size={18} /> Record New Payment
          </button>
        </div>

        {showAdd && (
          <div className="bg-gray-50 p-4 rounded-xl mb-6 border border-gray-200 grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
            <div><label className="block text-xs font-bold text-[#475569] mb-1">Amount</label><input type="number" value={newPayment.amount} onChange={e => setNewPayment({...newPayment, amount: e.target.value})} className="w-full h-10 px-3 rounded-lg border outline-none text-sm" /></div>
            <div><label className="block text-xs font-bold text-[#475569] mb-1">Date</label><input type="date" value={newPayment.date} onChange={e => setNewPayment({...newPayment, date: e.target.value})} className="w-full h-10 px-3 rounded-lg border outline-none text-sm" /></div>
            <div><label className="block text-xs font-bold text-[#475569] mb-1">Mode</label><select value={newPayment.mode} onChange={e => setNewPayment({...newPayment, mode: e.target.value})} className="w-full h-10 px-3 rounded-lg border outline-none text-sm"><option>Bank Transfer</option><option>Cash</option><option>UPI</option><option>Cheque</option></select></div>
            <div><label className="block text-xs font-bold text-[#475569] mb-1">Note</label><input type="text" value={newPayment.note} onChange={e => setNewPayment({...newPayment, note: e.target.value})} className="w-full h-10 px-3 rounded-lg border outline-none text-sm" /></div>
            <button onClick={addPayment} className="h-10 bg-[#0F172A] text-white rounded-lg text-sm font-bold">Add</button>
          </div>
        )}

        {payments.length === 0 ? (
          <div className="py-8 text-center border-2 border-dashed border-gray-200 rounded-xl">
            <p className="text-[14px] font-bold text-[#475569]">No payments recorded yet.</p>
            <p className="text-[13px] text-[#64748B]">Click "Record New Payment" to log installments.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {payments.map(p => (
              <div key={p.id} className="flex justify-between items-center p-4 border border-[#E2E8F0] rounded-xl hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600"><MdOutlineReceipt size={20} /></div>
                  <div>
                    <p className="text-[14px] font-bold text-[#0F172A]">₹ {parseFloat(p.amount).toLocaleString()} via {p.mode}</p>
                    <p className="text-[12px] text-[#64748B]">{p.date}{p.note ? " • " + p.note : ""}</p>
                    {p.recorded_by && (
                      <p className="text-[11px] text-blue-600 font-semibold flex items-center gap-1 mt-0.5">
                        <MdPerson size={13} /> Recorded by: {p.recorded_by}
                        {p.recorded_at && <span className="text-gray-400 font-normal ml-1">on {new Date(p.recorded_at).toLocaleDateString("en-GB", {day:"2-digit",month:"short",year:"numeric"})}</span>}
                      </p>
                    )}
                  </div>
                </div>
                <button onClick={() => setPayments(payments.filter(x => x.id !== p.id))} className="text-gray-400 hover:text-red-500 p-2"><MdDelete size={20}/></button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default TabPayments;
