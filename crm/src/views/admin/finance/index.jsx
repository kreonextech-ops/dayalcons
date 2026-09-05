import React, { useState, useEffect } from "react";
import Card from "components/card";
import { createClient } from "@supabase/supabase-js";
import { MdAttachMoney, MdAccountBalanceWallet, MdMoneyOff, MdDateRange, MdFileDownload } from "react-icons/md";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);

const Finance = () => {
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState([]);
  const [financialData, setFinancialData] = useState([]);
  const [dateFilter, setDateFilter] = useState("all");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch all clients, services, and projects
    const [clientsRes, servicesRes, projectsRes] = await Promise.all([
      supabase.from("clients").select("id, name"),
      supabase.from("services").select("client_id, description"),
      supabase.from("projects").select("client_id, description")
    ]);

    if (!clientsRes.error && clientsRes.data) {
       const srvData = servicesRes.data || [];
       const prjData = projectsRes.data || [];
       
       const cList = clientsRes.data.map(c => {
          const clientServices = srvData.filter(s => s.client_id === c.id);
          const clientProjects = prjData.filter(p => p.client_id === c.id);
          const allItems = [...clientServices, ...clientProjects];
          
          let totalValue = 0;
          let totalPaidAllTime = 0;
          let allPayments = [];
          
          allItems.forEach(item => {
             try {
                const meta = JSON.parse(item.description || "{}");
                const val = parseFloat(meta.financials?.total) || 0;
                const adv = parseFloat(meta.financials?.advance) || 0;
                const pay = Array.isArray(meta.payments) ? meta.payments : [];
                
                totalValue += val;
                
                let itemPaid = adv;
                pay.forEach(p => {
                   const pAmt = parseFloat(p.amount) || 0;
                   itemPaid += pAmt;
                   allPayments.push({ ...p, amount: pAmt });
                });
                totalPaidAllTime += itemPaid;
                
                // If there's an advance, log it as an early payment with no specific date (or project creation date).
                // For simplicity, we just add it to all-time, but for date filtering, advance might not have a date.
             } catch(e) {}
          });
          
          return {
             id: c.id,
             name: c.name,
             totalValue,
             totalPaidAllTime,
             totalDue: totalValue - totalPaidAllTime,
             allPayments
          };
       });
       
       setFinancialData(cList);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getFilteredData = () => {
     let start = null;
     let end = null;
     
     const now = new Date();
     
     if (dateFilter === "this_month") {
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
     } else if (dateFilter === "last_month") {
        start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        end = new Date(now.getFullYear(), now.getMonth(), 0);
     } else if (dateFilter === "this_year") {
        start = new Date(now.getFullYear(), 0, 1);
        end = new Date(now.getFullYear(), 11, 31);
     } else if (dateFilter === "custom" && customStart && customEnd) {
        start = new Date(customStart);
        end = new Date(customEnd);
        end.setHours(23, 59, 59);
     }

     let globalExpected = 0;
     let globalReceivedAllTime = 0;
     let globalReceivedInPeriod = 0;
     let globalDue = 0;

     const clientRows = financialData.map(c => {
        let periodPaid = 0;
        
        c.allPayments.forEach(p => {
           if (p.date && start && end) {
              const pDate = new Date(p.date);
              if (pDate >= start && pDate <= end) {
                 periodPaid += p.amount;
              }
           } else if (!start) {
              periodPaid += p.amount;
           }
        });
        
        // If filter is all time, periodPaid should also include advances which might not have dates
        if (dateFilter === "all") {
           periodPaid = c.totalPaidAllTime;
        }

        globalExpected += c.totalValue;
        globalReceivedAllTime += c.totalPaidAllTime;
        globalReceivedInPeriod += periodPaid;
        globalDue += c.totalDue;
        
        return {
           ...c,
           periodPaid
        };
     }).filter(c => c.totalValue > 0 || c.periodPaid > 0); // Only show clients with financials

     // Sort by Due descending
     clientRows.sort((a, b) => b.totalDue - a.totalDue);

     return { globalExpected, globalReceivedAllTime, globalReceivedInPeriod, globalDue, clientRows };
  };

  const { globalExpected, globalReceivedAllTime, globalReceivedInPeriod, globalDue, clientRows } = getFilteredData();

  if (loading) {
     return <div className="p-10 flex justify-center text-[#64748B]">Loading global financials...</div>;
  }

  return (
    <div className="animate-fade-in flex flex-col gap-6">
       
       {/* Filters Section */}
       <Card extra="p-6 border border-[#E2E8F0] bg-white">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
             <div>
                <h2 className="text-[20px] font-bold text-[#0F172A]">Financial Master Dashboard</h2>
                <p className="text-[13px] text-[#64748B]">Track all client payments, outstandings, and monthly revenue.</p>
             </div>
             
             <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-xl border border-gray-100">
                <MdDateRange className="text-gray-400 ml-2" size={20} />
                <select 
                   value={dateFilter} 
                   onChange={(e) => setDateFilter(e.target.value)}
                   className="bg-transparent text-[13px] font-bold text-[#0F172A] outline-none cursor-pointer p-1 pr-4"
                >
                   <option value="all">All-Time (Lifetime)</option>
                   <option value="this_month">This Month</option>
                   <option value="last_month">Last Month</option>
                   <option value="this_year">This Year</option>
                   <option value="custom">Custom Date Range</option>
                </select>
                
                {dateFilter === "custom" && (
                   <div className="flex items-center gap-2 border-l pl-3 ml-1">
                      <input type="date" value={customStart} onChange={e => setCustomStart(e.target.value)} className="text-[12px] p-1 border rounded" />
                      <span className="text-gray-400">to</span>
                      <input type="date" value={customEnd} onChange={e => setCustomEnd(e.target.value)} className="text-[12px] p-1 border rounded" />
                   </div>
                )}
             </div>
          </div>
       </Card>

       {/* KPIs */}
       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card extra="p-6 relative overflow-hidden border border-[#E2E8F0] bg-white">
             <div className="absolute right-0 top-0 p-4 opacity-[0.03]"><MdAccountBalanceWallet size={80}/></div>
             <p className="text-[12px] font-bold text-[#64748B] uppercase tracking-wide mb-1">Total Expected (All Clients)</p>
             <p className="text-[26px] font-bold text-[#0F172A]">₹ {globalExpected.toLocaleString('en-IN')}</p>
          </Card>
          
          <Card extra="p-6 relative overflow-hidden border border-[#E2E8F0] bg-gradient-to-br from-blue-50 to-white">
             <div className="absolute right-0 top-0 p-4 opacity-[0.05] text-[#2563EB]"><MdAttachMoney size={80}/></div>
             <p className="text-[12px] font-bold text-blue-800 uppercase tracking-wide mb-1">
                Received in {dateFilter === 'all' ? 'Total' : 'Period'}
             </p>
             <p className="text-[26px] font-bold text-[#2563EB]">₹ {globalReceivedInPeriod.toLocaleString('en-IN')}</p>
          </Card>

          <Card extra="p-6 relative overflow-hidden border border-[#E2E8F0] bg-white">
             <div className="absolute right-0 top-0 p-4 opacity-[0.03]"><MdAttachMoney size={80}/></div>
             <p className="text-[12px] font-bold text-[#64748B] uppercase tracking-wide mb-1">Received (All-Time)</p>
             <p className="text-[26px] font-bold text-[#10B981]">₹ {globalReceivedAllTime.toLocaleString('en-IN')}</p>
          </Card>
          
          <Card extra="p-6 relative overflow-hidden border border-[#E2E8F0] bg-gradient-to-br from-red-50 to-white">
             <div className="absolute right-0 top-0 p-4 opacity-[0.05] text-red-600"><MdMoneyOff size={80}/></div>
             <p className="text-[12px] font-bold text-red-800 uppercase tracking-wide mb-1">Total Outstanding (Due)</p>
             <p className="text-[26px] font-bold text-[#DC2626]">₹ {globalDue.toLocaleString('en-IN')}</p>
          </Card>
       </div>

       {/* Detailed Client Table */}
       <Card extra="p-6 border border-[#E2E8F0] bg-white">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-[16px] font-bold text-[#0F172A]">Client Financial Summary</h3>
             <button className="flex items-center gap-2 text-[13px] font-bold text-[#2563EB] hover:underline">
                <MdFileDownload size={18} /> Export CSV
             </button>
          </div>
          
          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
                <thead>
                   <tr className="bg-gray-50 border-y border-[#E2E8F0]">
                      <th className="py-3 px-4 text-[12px] font-bold text-[#475569] uppercase">Client Name</th>
                      <th className="py-3 px-4 text-[12px] font-bold text-[#475569] uppercase text-right">Total Expected</th>
                      <th className="py-3 px-4 text-[12px] font-bold text-[#475569] uppercase text-right">
                         <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Received ({dateFilter === 'all' ? 'All' : 'Period'})</span>
                      </th>
                      <th className="py-3 px-4 text-[12px] font-bold text-[#475569] uppercase text-right">Received (All-Time)</th>
                      <th className="py-3 px-4 text-[12px] font-bold text-[#475569] uppercase text-right">Total Outstanding</th>
                   </tr>
                </thead>
                <tbody>
                   {clientRows.length === 0 ? (
                      <tr><td colSpan="5" className="py-8 text-center text-[13px] text-[#64748B]">No financial data found.</td></tr>
                   ) : (
                      clientRows.map(c => (
                         <tr key={c.id} className="border-b border-[#E2E8F0] hover:bg-gray-50/50 transition">
                            <td className="py-4 px-4 font-bold text-[#0F172A]">{c.name}</td>
                            <td className="py-4 px-4 text-right font-bold text-[#475569]">₹ {c.totalValue.toLocaleString('en-IN')}</td>
                            <td className="py-4 px-4 text-right font-bold text-[#2563EB] bg-blue-50/30">₹ {c.periodPaid.toLocaleString('en-IN')}</td>
                            <td className="py-4 px-4 text-right font-bold text-[#10B981]">₹ {c.totalPaidAllTime.toLocaleString('en-IN')}</td>
                            <td className="py-4 px-4 text-right font-bold text-[#DC2626]">₹ {c.totalDue.toLocaleString('en-IN')}</td>
                         </tr>
                      ))
                   )}
                </tbody>
             </table>
          </div>
       </Card>
    </div>
  );
};

export default Finance;
