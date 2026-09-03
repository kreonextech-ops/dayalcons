import React, { useState, useEffect } from "react";
import Card from "components/card";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);

const Finance = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newQuote, setNewQuote] = useState({ amount: "", status: "Draft" });

  const fetchQuotations = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("quotations").select("*");
    if (!error && data) {
      setQuotations(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  const handleCreateQuote = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.from("quotations").insert([{
      amount: parseFloat(newQuote.amount) || 0.00,
      status: newQuote.status
    }]);
    if (!error) {
      setShowModal(false);
      setNewQuote({ amount: "", status: "Draft" });
      fetchQuotations();
    } else {
      console.error("Error creating quote:", error);
      alert("Failed to create quotation");
    }
  };

  return (
    <div className="mt-5 grid h-full grid-cols-1 gap-5">
      <Card extra={"w-full h-full p-4 sm:p-6"}>
        <header className="relative flex items-center justify-between pt-4 pb-2">
          <div className="text-xl font-bold text-navy-700 dark:text-white">
            Quotations & Estimates
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="linear rounded-[20px] bg-brand-900 px-4 py-2 text-base font-medium text-white transition duration-200 hover:bg-brand-800 active:bg-brand-700 dark:bg-brand-400 dark:hover:bg-brand-300 dark:active:opacity-90"
          >
            + New Quotation
          </button>
        </header>

        <div className="mt-8 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="!border-px !border-gray-400">
                <th className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start"><p className="text-sm font-bold text-gray-600 dark:text-white">ID</p></th>
                <th className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start"><p className="text-sm font-bold text-gray-600 dark:text-white">AMOUNT</p></th>
                <th className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start"><p className="text-sm font-bold text-gray-600 dark:text-white">STATUS</p></th>
                <th className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start"><p className="text-sm font-bold text-gray-600 dark:text-white">CREATED AT</p></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" className="py-4 text-center">Loading quotations...</td></tr>
              ) : quotations.length === 0 ? (
                <tr><td colSpan="4" className="py-4 text-center text-gray-500">No quotations found.</td></tr>
              ) : (
                quotations.map((q) => (
                  <tr key={q.id} className="border-b-[1px] border-gray-200 hover:bg-gray-50 dark:hover:bg-navy-700">
                    <td className="pt-[14px] pb-[18px] sm:text-[14px]"><p className="text-sm font-bold text-navy-700 dark:text-white">{q.id.substring(0, 8)}...</p></td>
                    <td className="pt-[14px] pb-[18px] sm:text-[14px]"><p className="text-sm font-bold text-navy-700 dark:text-white">₹{q.amount}</p></td>
                    <td className="pt-[14px] pb-[18px] sm:text-[14px]"><p className="text-sm font-bold text-navy-700 dark:text-white">{q.status}</p></td>
                    <td className="pt-[14px] pb-[18px] sm:text-[14px]"><p className="text-sm font-bold text-navy-700 dark:text-white">{new Date(q.created_at).toLocaleDateString()}</p></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-[20px] bg-white p-6 shadow-3xl dark:bg-navy-800">
            <h2 className="mb-4 text-xl font-bold text-navy-700 dark:text-white">Create New Quotation</h2>
            <form onSubmit={handleCreateQuote} className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-bold text-navy-700 dark:text-white">Amount (₹)</label>
                <input 
                  type="number" 
                  required
                  step="0.01"
                  value={newQuote.amount}
                  onChange={(e) => setNewQuote({...newQuote, amount: e.target.value})}
                  className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:border-white/10 dark:text-white"
                  placeholder="e.g. 50000.00"
                />
              </div>
              <div>
                <label className="text-sm font-bold text-navy-700 dark:text-white">Status</label>
                <select 
                  value={newQuote.status}
                  onChange={(e) => setNewQuote({...newQuote, status: e.target.value})}
                  className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:border-white/10 dark:text-white"
                >
                  <option value="Draft">Draft</option>
                  <option value="Sent">Sent</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <div className="mt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="rounded-xl px-5 py-3 text-base font-medium text-navy-700 transition duration-200 hover:bg-gray-100 active:bg-gray-200 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/10"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="linear rounded-xl bg-brand-900 px-5 py-3 text-base font-medium text-white transition duration-200 hover:bg-brand-800 active:bg-brand-700 dark:bg-brand-400 dark:hover:bg-brand-300 dark:active:opacity-90"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Finance;
