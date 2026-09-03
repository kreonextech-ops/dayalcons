import React, { useState } from "react";
import Card from "components/card";
import { 
  MdEdit, MdCheckCircle, MdAdd, MdPictureAsPdf, MdEmail, 
  MdDownload, MdOutlineClose, MdMoreVert, MdVisibility, MdSave,
  MdDeleteOutline, MdHistory, MdReceipt, MdWarningAmber, MdContentCopy
} from "react-icons/md";
import { FiFileText, FiClock } from "react-icons/fi";

const TabFinancials = () => {
  // -------------------------------------------------------------
  // STATE MANAGEMENT
  // -------------------------------------------------------------
  const [isEditingContract, setIsEditingContract] = useState(false);
  const [contractData, setContractData] = useState({
    contractNo: "—",
    agreementDate: "",
    projectName: "—",
    projectType: "—",
    contractValue: "—",
    currency: "INR (₹)",
    clientGst: "—",
    paymentTerms: "—",
    retentionPercent: "—",
    expectedCompletion: "",
    billingCycle: "—",
    taxType: "—"
  });

  const [milestones, setMilestones] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [changeOrders, setChangeOrders] = useState([]);
  const [ledgerEntries, setLedgerEntries] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // -------------------------------------------------------------
  // 1. FINANCIAL OVERVIEW
  // -------------------------------------------------------------
  const renderFinancialOverview = () => {
    const kpis = [
      { label: "Contract Value", val: "₹ —" },
      { label: "Total Invoiced", val: "₹ —" },
      { label: "Total Received", val: "₹ —" },
      { label: "Outstanding", val: "₹ —", color: "text-[#DC2626]" },
      { label: "Retention Amount", val: "₹ —" },
      { label: "Profit Margin", val: "— %" }
    ];

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {kpis.map((kpi, i) => (
          <Card key={i} extra="p-5 border border-[#E2E8F0] hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wide mb-1 flex justify-between items-center">
              {kpi.label} <MdEdit className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </p>
            <p className={`text-[24px] font-bold ${kpi.color || 'text-[#0F172A]'}`}>{kpi.val}</p>
          </Card>
        ))}
      </div>
    );
  };

  // -------------------------------------------------------------
  // 2. CONTRACT DETAILS
  // -------------------------------------------------------------
  const renderContractDetails = () => (
    <Card extra="p-6 mb-8 border border-[#E2E8F0]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[18px] font-bold text-[#0F172A]">Contract Information</h2>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 text-[13px] font-bold text-[#64748B] hover:text-[#0F172A] transition">
             <MdPictureAsPdf /> Upload Agreement
          </button>
          <button onClick={() => setIsEditingContract(!isEditingContract)} className="flex items-center gap-2 text-[13px] font-bold text-[#2563EB] hover:text-[#1D4ED8] transition">
             {isEditingContract ? <><MdSave /> Save Contract</> : <><MdEdit /> Edit Contract</>}
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
        {/* Left Column */}
        <div className="space-y-4">
          <div className="flex flex-col"><label className="text-[12px] font-semibold text-[#64748B] uppercase mb-1">Contract Number</label>
            {isEditingContract ? <input type="text" className="border rounded-lg p-2 text-sm outline-none focus:border-[#2563EB]" value={contractData.contractNo} onChange={e=>setContractData({...contractData, contractNo: e.target.value})} /> : <span className="text-[14px] font-bold text-[#0F172A]">{contractData.contractNo}</span>}
          </div>
          <div className="flex flex-col"><label className="text-[12px] font-semibold text-[#64748B] uppercase mb-1">Agreement Date</label>
            {isEditingContract ? <input type="date" className="border rounded-lg p-2 text-sm outline-none focus:border-[#2563EB]" value={contractData.agreementDate} onChange={e=>setContractData({...contractData, agreementDate: e.target.value})} /> : <span className="text-[14px] font-bold text-[#0F172A]">{contractData.agreementDate || "Select date"}</span>}
          </div>
          <div className="flex flex-col"><label className="text-[12px] font-semibold text-[#64748B] uppercase mb-1">Project Name</label>
            {isEditingContract ? <input type="text" className="border rounded-lg p-2 text-sm outline-none focus:border-[#2563EB]" value={contractData.projectName} onChange={e=>setContractData({...contractData, projectName: e.target.value})} /> : <span className="text-[14px] font-bold text-[#0F172A]">{contractData.projectName}</span>}
          </div>
          <div className="flex flex-col"><label className="text-[12px] font-semibold text-[#64748B] uppercase mb-1">Project Type</label>
            {isEditingContract ? <input type="text" className="border rounded-lg p-2 text-sm outline-none focus:border-[#2563EB]" value={contractData.projectType} onChange={e=>setContractData({...contractData, projectType: e.target.value})} /> : <span className="text-[14px] font-bold text-[#0F172A]">{contractData.projectType}</span>}
          </div>
          <div className="flex flex-col"><label className="text-[12px] font-semibold text-[#64748B] uppercase mb-1">Contract Value</label>
            {isEditingContract ? <input type="text" className="border rounded-lg p-2 text-sm outline-none focus:border-[#2563EB]" value={contractData.contractValue} onChange={e=>setContractData({...contractData, contractValue: e.target.value})} /> : <span className="text-[14px] font-bold text-[#0F172A]">{contractData.contractValue}</span>}
          </div>
          <div className="flex flex-col"><label className="text-[12px] font-semibold text-[#64748B] uppercase mb-1">Currency</label>
            {isEditingContract ? <input type="text" className="border rounded-lg p-2 text-sm outline-none focus:border-[#2563EB]" value={contractData.currency} onChange={e=>setContractData({...contractData, currency: e.target.value})} /> : <span className="text-[14px] font-bold text-[#0F172A]">{contractData.currency}</span>}
          </div>
        </div>
        {/* Right Column */}
        <div className="space-y-4">
          <div className="flex flex-col"><label className="text-[12px] font-semibold text-[#64748B] uppercase mb-1">Client GST Number</label>
            {isEditingContract ? <input type="text" className="border rounded-lg p-2 text-sm outline-none focus:border-[#2563EB]" value={contractData.clientGst} onChange={e=>setContractData({...contractData, clientGst: e.target.value})} /> : <span className="text-[14px] font-bold text-[#0F172A]">{contractData.clientGst}</span>}
          </div>
          <div className="flex flex-col"><label className="text-[12px] font-semibold text-[#64748B] uppercase mb-1">Payment Terms</label>
            {isEditingContract ? <input type="text" className="border rounded-lg p-2 text-sm outline-none focus:border-[#2563EB]" value={contractData.paymentTerms} onChange={e=>setContractData({...contractData, paymentTerms: e.target.value})} /> : <span className="text-[14px] font-bold text-[#0F172A]">{contractData.paymentTerms}</span>}
          </div>
          <div className="flex flex-col"><label className="text-[12px] font-semibold text-[#64748B] uppercase mb-1">Retention %</label>
            {isEditingContract ? <input type="text" className="border rounded-lg p-2 text-sm outline-none focus:border-[#2563EB]" value={contractData.retentionPercent} onChange={e=>setContractData({...contractData, retentionPercent: e.target.value})} /> : <span className="text-[14px] font-bold text-[#0F172A]">{contractData.retentionPercent}</span>}
          </div>
          <div className="flex flex-col"><label className="text-[12px] font-semibold text-[#64748B] uppercase mb-1">Expected Completion</label>
            {isEditingContract ? <input type="date" className="border rounded-lg p-2 text-sm outline-none focus:border-[#2563EB]" value={contractData.expectedCompletion} onChange={e=>setContractData({...contractData, expectedCompletion: e.target.value})} /> : <span className="text-[14px] font-bold text-[#0F172A]">{contractData.expectedCompletion || "Select date"}</span>}
          </div>
          <div className="flex flex-col"><label className="text-[12px] font-semibold text-[#64748B] uppercase mb-1">Billing Cycle</label>
            {isEditingContract ? <input type="text" className="border rounded-lg p-2 text-sm outline-none focus:border-[#2563EB]" value={contractData.billingCycle} onChange={e=>setContractData({...contractData, billingCycle: e.target.value})} /> : <span className="text-[14px] font-bold text-[#0F172A]">{contractData.billingCycle}</span>}
          </div>
          <div className="flex flex-col"><label className="text-[12px] font-semibold text-[#64748B] uppercase mb-1">Tax Type</label>
            {isEditingContract ? <input type="text" className="border rounded-lg p-2 text-sm outline-none focus:border-[#2563EB]" value={contractData.taxType} onChange={e=>setContractData({...contractData, taxType: e.target.value})} /> : <span className="text-[14px] font-bold text-[#0F172A]">{contractData.taxType}</span>}
          </div>
        </div>
      </div>
    </Card>
  );

  // -------------------------------------------------------------
  // 3. PAYMENT SCHEDULE (MILESTONES)
  // -------------------------------------------------------------
  const renderMilestones = () => (
    <Card extra="p-6 mb-8 border border-[#E2E8F0]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-[18px] font-bold text-[#0F172A]">Payment Schedule</h2>
          <p className="text-[13px] text-[#64748B]">Milestone billing timeline</p>
        </div>
        <div className="text-right">
          <p className="text-[12px] font-semibold text-[#64748B] uppercase mb-1">Progress</p>
          <div className="w-32 h-2 rounded-full bg-gray-100 overflow-hidden"><div className="h-full bg-[#16A34A] w-[0%] transition-all duration-300"></div></div>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {milestones.length === 0 ? (
          <div className="w-full flex flex-col items-center justify-center py-12 text-center bg-[#F8FAFC] border border-dashed border-[#E2E8F0] rounded-[16px]">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-[#2563EB] text-2xl mb-4">
              <FiClock />
            </div>
            <h3 className="text-[16px] font-bold text-[#0F172A] mb-1">No Milestones Created</h3>
            <p className="text-[13px] text-[#64748B] mb-4">Set up a payment schedule like "Advance", "Foundation", etc.</p>
          </div>
        ) : (
          <div>{/* Real milestones map here */}</div>
        )}
      </div>

      <button className="h-10 px-5 rounded-full border border-[#E2E8F0] bg-white text-[13px] font-bold text-[#0F172A] hover:bg-gray-50 flex items-center gap-2 transition mx-auto">
         <MdAdd /> Add Milestone
      </button>
    </Card>
  );

  // -------------------------------------------------------------
  // 4. INVOICE MANAGEMENT
  // -------------------------------------------------------------
  const renderInvoices = () => (
    <Card extra="p-6 mb-8 border border-[#E2E8F0] overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-[18px] font-bold text-[#0F172A]">Invoices</h2>
          <p className="text-[13px] text-[#64748B]">Manage all billing records</p>
        </div>
        <div className="flex gap-2">
          <button className="h-10 w-10 flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#64748B] hover:bg-gray-50 transition" title="Download Excel"><MdDownload /></button>
          <button onClick={() => setDrawerOpen(true)} className="h-10 px-4 rounded-lg bg-[#2563EB] text-[13px] font-bold text-white hover:bg-[#1D4ED8] flex items-center gap-2 transition">
             <MdAdd /> New Invoice
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] border-y border-[#E2E8F0]">
              <th className="py-3 px-4 text-[12px] font-semibold text-[#64748B] uppercase">Invoice No.</th>
              <th className="py-3 px-4 text-[12px] font-semibold text-[#64748B] uppercase">Project</th>
              <th className="py-3 px-4 text-[12px] font-semibold text-[#64748B] uppercase">Milestone</th>
              <th className="py-3 px-4 text-[12px] font-semibold text-[#64748B] uppercase">Amount</th>
              <th className="py-3 px-4 text-[12px] font-semibold text-[#64748B] uppercase">GST</th>
              <th className="py-3 px-4 text-[12px] font-semibold text-[#64748B] uppercase">Status</th>
              <th className="py-3 px-4 text-[12px] font-semibold text-[#64748B] uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-16 text-center">
                   <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 text-2xl mx-auto mb-4"><FiFileText /></div>
                   <p className="text-[14px] font-bold text-[#0F172A]">No invoices created</p>
                   <p className="text-[13px] text-[#64748B]">Create your first invoice to start billing.</p>
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </Card>
  );

  // -------------------------------------------------------------
  // 5. PAYMENT RECEIPTS
  // -------------------------------------------------------------
  const renderReceipts = () => (
    <Card extra="p-6 mb-8 border border-[#E2E8F0] overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-[18px] font-bold text-[#0F172A]">Payment Receipts</h2>
          <p className="text-[13px] text-[#64748B]">Track every payment received</p>
        </div>
        <button className="h-10 px-4 rounded-lg bg-[#16A34A] text-[13px] font-bold text-white hover:bg-green-700 flex items-center gap-2 transition">
           <MdAdd /> Add Receipt
        </button>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] border-y border-[#E2E8F0]">
              <th className="py-3 px-4 text-[12px] font-semibold text-[#64748B] uppercase">Receipt No.</th>
              <th className="py-3 px-4 text-[12px] font-semibold text-[#64748B] uppercase">Invoice</th>
              <th className="py-3 px-4 text-[12px] font-semibold text-[#64748B] uppercase">Method</th>
              <th className="py-3 px-4 text-[12px] font-semibold text-[#64748B] uppercase">Amount</th>
              <th className="py-3 px-4 text-[12px] font-semibold text-[#64748B] uppercase">Date</th>
              <th className="py-3 px-4 text-[12px] font-semibold text-[#64748B] uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {receipts.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-12 text-center text-[#64748B] text-[13px]">
                   <p className="font-bold text-[#0F172A] mb-1">No payments recorded</p>
                   Add a receipt when the client pays an invoice.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </Card>
  );

  // -------------------------------------------------------------
  // 6. CHANGE ORDERS
  // -------------------------------------------------------------
  const renderChangeOrders = () => (
    <Card extra="p-6 mb-8 border border-[#E2E8F0] overflow-hidden border-l-4 border-l-[#F59E0B]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-[18px] font-bold text-[#0F172A]">Change Orders</h2>
          <p className="text-[13px] text-[#64748B]">Manage revisions and extra work requests</p>
        </div>
        <button className="h-10 px-4 rounded-lg bg-[#F59E0B] text-[13px] font-bold text-white hover:bg-orange-600 flex items-center gap-2 transition">
           <MdAdd /> Add Change Order
        </button>
      </div>
      
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] border-y border-[#E2E8F0]">
              <th className="py-3 px-4 text-[12px] font-semibold text-[#64748B] uppercase">CO No.</th>
              <th className="py-3 px-4 text-[12px] font-semibold text-[#64748B] uppercase">Description</th>
              <th className="py-3 px-4 text-[12px] font-semibold text-[#64748B] uppercase">Amount</th>
              <th className="py-3 px-4 text-[12px] font-semibold text-[#64748B] uppercase">Status</th>
              <th className="py-3 px-4 text-[12px] font-semibold text-[#64748B] uppercase">Approved By</th>
            </tr>
          </thead>
          <tbody>
            {changeOrders.length === 0 ? (
              <tr><td colSpan="5" className="py-8 text-center text-[13px] text-[#64748B]">No change orders created.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </Card>
  );

  // -------------------------------------------------------------
  // 7. CLIENT LEDGER
  // -------------------------------------------------------------
  const renderLedger = () => (
    <Card extra="p-6 mb-8 border border-[#E2E8F0] overflow-hidden shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-[18px] font-bold text-[#0F172A]">Centralized Client Ledger</h2>
          <p className="text-[13px] text-[#64748B]">Auto-generated history of all financial transactions</p>
        </div>
        <div className="flex gap-2">
          <select className="h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] outline-none">
            <option>All Types</option>
            <option>Invoices</option>
            <option>Receipts</option>
          </select>
          <button className="h-10 px-4 rounded-lg border border-[#E2E8F0] text-[13px] font-bold text-[#0F172A] hover:bg-gray-50 flex items-center gap-2 transition">
             Export PDF
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#0F172A] text-white">
              <th className="py-3 px-4 text-[12px] font-semibold uppercase">Date</th>
              <th className="py-3 px-4 text-[12px] font-semibold uppercase">Type</th>
              <th className="py-3 px-4 text-[12px] font-semibold uppercase">Reference</th>
              <th className="py-3 px-4 text-[12px] font-semibold uppercase text-right">Debit</th>
              <th className="py-3 px-4 text-[12px] font-semibold uppercase text-right">Credit</th>
              <th className="py-3 px-4 text-[12px] font-semibold uppercase text-right">Balance</th>
            </tr>
          </thead>
          <tbody>
            {ledgerEntries.length === 0 ? (
              <tr><td colSpan="6" className="py-12 text-center text-[13px] text-[#64748B]">Ledger is empty. Entries auto-generate from invoices and receipts.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </Card>
  );

  // -------------------------------------------------------------
  // 8. GST & TAX MANAGEMENT + 9. REPORTS
  // -------------------------------------------------------------
  const renderTaxAndReports = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <Card extra="p-6 border border-[#E2E8F0]">
        <h2 className="text-[18px] font-bold text-[#0F172A] mb-4">GST & Tax Details</h2>
        <div className="space-y-4 mb-6">
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <span className="text-[13px] text-[#64748B]">GST Number</span>
            <span className="text-[13px] font-bold text-[#0F172A]">—</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <span className="text-[13px] text-[#64748B]">Tax Regime</span>
            <span className="text-[13px] font-bold text-[#0F172A]">—</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <span className="text-[13px] text-[#64748B]">TDS %</span>
            <span className="text-[13px] font-bold text-[#0F172A]">—</span>
          </div>
        </div>
        <button className="w-full h-10 rounded-lg bg-gray-50 border border-dashed border-[#E2E8F0] text-[13px] font-bold text-[#64748B] hover:bg-gray-100 transition">
           Upload Tax Document
        </button>
      </Card>
      
      <Card extra="p-6 border border-[#E2E8F0]">
        <h2 className="text-[18px] font-bold text-[#0F172A] mb-4">Financial Reports</h2>
        <div className="grid grid-cols-2 gap-3">
          {["Client Statement", "Outstanding Report", "Invoice Register", "GST Report"].map(r => (
            <button key={r} className="p-3 border border-[#E2E8F0] rounded-lg text-left hover:border-[#2563EB] group transition">
              <span className="block text-[13px] font-bold text-[#0F172A] mb-1 group-hover:text-[#2563EB]">{r}</span>
              <span className="text-[11px] text-[#64748B] flex items-center gap-1"><MdDownload /> Generate PDF</span>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );

  return (
    <div className="w-full relative">
      {renderFinancialOverview()}
      {renderContractDetails()}
      {renderMilestones()}
      {renderInvoices()}
      {renderReceipts()}
      {renderChangeOrders()}
      {renderLedger()}
      {renderTaxAndReports()}

      {/* Invoice Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm transition-opacity">
          <div className="w-[500px] bg-white h-full shadow-2xl flex flex-col transform transition-transform animate-slide-left">
            <div className="p-6 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC]">
              <h2 className="text-[20px] font-bold text-[#0F172A]">New Invoice</h2>
              <button onClick={() => setDrawerOpen(false)} className="text-gray-400 hover:text-black"><MdOutlineClose className="text-2xl" /></button>
            </div>
            <div className="p-6 flex-1 overflow-y-auto space-y-5">
              <div><label className="text-[12px] font-bold text-[#475569] uppercase mb-1 block">Invoice Number</label><input type="text" placeholder="Enter value" className="w-full p-2 border rounded-lg text-sm outline-none focus:border-[#2563EB]" /></div>
              <div><label className="text-[12px] font-bold text-[#475569] uppercase mb-1 block">Project</label><select className="w-full p-2 border rounded-lg text-sm outline-none focus:border-[#2563EB]"><option>Select project</option></select></div>
              <div><label className="text-[12px] font-bold text-[#475569] uppercase mb-1 block">Milestone</label><select className="w-full p-2 border rounded-lg text-sm outline-none focus:border-[#2563EB]"><option>Select milestone</option></select></div>
              <div className="grid grid-cols-2 gap-4">
                 <div><label className="text-[12px] font-bold text-[#475569] uppercase mb-1 block">Invoice Date</label><input type="date" className="w-full p-2 border rounded-lg text-sm outline-none focus:border-[#2563EB]" /></div>
                 <div><label className="text-[12px] font-bold text-[#475569] uppercase mb-1 block">Due Date</label><input type="date" className="w-full p-2 border rounded-lg text-sm outline-none focus:border-[#2563EB]" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div><label className="text-[12px] font-bold text-[#475569] uppercase mb-1 block">Amount (₹)</label><input type="text" placeholder="Auto-calculated" className="w-full p-2 border rounded-lg text-sm bg-gray-50 outline-none" disabled /></div>
                 <div><label className="text-[12px] font-bold text-[#475569] uppercase mb-1 block">GST %</label><select className="w-full p-2 border rounded-lg text-sm outline-none focus:border-[#2563EB]"><option>18%</option><option>12%</option><option>5%</option><option>0%</option></select></div>
              </div>
              <div><label className="text-[12px] font-bold text-[#475569] uppercase mb-1 block">Notes</label><textarea rows="3" placeholder="Additional notes..." className="w-full p-2 border rounded-lg text-sm outline-none focus:border-[#2563EB]"></textarea></div>
              
              <div className="p-4 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                <div className="flex justify-between text-sm mb-1"><span className="text-[#64748B]">Subtotal</span><span className="font-semibold">₹ —</span></div>
                <div className="flex justify-between text-sm mb-2"><span className="text-[#64748B]">GST Amount</span><span className="font-semibold">₹ —</span></div>
                <div className="flex justify-between text-[16px] border-t border-[#E2E8F0] pt-2 mt-2"><span className="font-bold text-[#0F172A]">Grand Total</span><span className="font-bold text-[#2563EB]">₹ —</span></div>
              </div>
            </div>
            <div className="p-6 border-t border-[#E2E8F0] flex gap-3">
              <button onClick={() => setDrawerOpen(false)} className="flex-1 h-12 rounded-lg border border-[#E2E8F0] bg-white font-bold text-[#475569] hover:bg-gray-50">Save Draft</button>
              <button className="flex-1 h-12 rounded-lg bg-[#2563EB] font-bold text-white shadow-md hover:bg-[#1D4ED8]">Generate Invoice</button>
            </div>
          </div>
        </div>
      )}

      {/* Animation Styles */}
      <style>{`
        @keyframes slide-left {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-left {
          animation: slide-left 0.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default TabFinancials;
