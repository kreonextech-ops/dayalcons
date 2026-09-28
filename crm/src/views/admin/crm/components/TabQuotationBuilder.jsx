import React, { useState, useRef, useEffect } from "react";
import Card from "components/card";
import { MdAdd, MdDelete, MdPictureAsPdf, MdSave } from "react-icons/md";
import { createClient } from "@supabase/supabase-js";
import html2pdf from "html2pdf.js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);

// Helper to convert number to Indian Rupees words
function numberToWords(num) {
    if (num === 0) return "Zero";
    const a = ["", "One ", "Two ", "Three ", "Four ", "Five ", "Six ", "Seven ", "Eight ", "Nine ", "Ten ", "Eleven ", "Twelve ", "Thirteen ", "Fourteen ", "Fifteen ", "Sixteen ", "Seventeen ", "Eighteen ", "Nineteen "];
    const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    
    if ((num = num.toString()).length > 9) return "Overflow";
    let n = ("000000000" + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return; let str = "";
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + " " + a[n[1][1]]) + "Crore " : "";
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + " " + a[n[2][1]]) + "Lakh " : "";
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + " " + a[n[3][1]]) + "Thousand " : "";
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + " " + a[n[4][1]]) + "Hundred " : "";
    str += (n[5] != 0) ? ((str != "") ? "and " : "") + (a[Number(n[5])] || b[n[5][0]] + " " + a[n[5][1]]) : "";
    return "Rupees " + str.trim() + " Only";
}

const defaultItems = [
  { desc: "2D FLOOR PLAN", qty: 1, rate: 10 },
  { desc: "3D FLOOR PLAN", qty: 1, rate: 20 },
  { desc: "3D FRONT ELEVATION", qty: 1, rate: 20 },
  { desc: "STRUCTURAL PLAN", qty: 1, rate: 20 },
  { desc: "L.U.C.C", qty: 1, rate: 20 },
  { desc: "BUILDING PLAN APPROVAL", qty: 1, rate: 20 },
  { desc: "SUPERVISING OF CONSTRUCTION", qty: 1, rate: 40 },
  { desc: "CONSTRUCTION (LABOUR PART ONLY)", qty: 1, rate: 350 },
  { desc: "CONSTRUCTION (LABOUR + MATERIAL ONLY)", qty: 1, rate: 2200 }
];

const TabQuotationBuilder = ({ leadData, isClient = false }) => {
  const [quotationNo, setQuotationNo] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [items, setItems] = useState(defaultItems);
  const [taxRate, setTaxRate] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const pdfRef = useRef(null);

  const [history, setHistory] = useState([]);

  useEffect(() => {
     if(leadData?.id) fetchHistory();
  }, [leadData]);

  const fetchHistory = async () => {
      const col = isClient ? 'client_id' : 'lead_id';
      const { data } = await supabase.from('quotations').select('*').eq(col, leadData.id).order('created_at', { ascending: false });
      if(data) setHistory(data);
  };

  const handleAddItem = () => {
    setItems([...items, { desc: "", qty: 1, rate: 0 }]);
  };

  const handleRemoveItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.qty) || 0) * (parseFloat(item.rate) || 0), 0);
  const taxAmount = taxRate ? subtotal * (parseFloat(taxRate) / 100) : 0;
  const totalAmount = subtotal + taxAmount;
  const amountInWords = numberToWords(Math.round(totalAmount));

  const handleSaveToDB = async () => {
     setIsSaving(true);
     const payload = {
         lead_id: isClient ? null : leadData.id,
         client_id: isClient ? leadData.id : null,
         quotation_no: quotationNo,
         customer_id: customerId,
         quotation_date: date,
         items: items,
         subtotal: subtotal,
         tax_rate: taxRate,
         tax_amount: taxAmount,
         total_amount: totalAmount,
         amount_in_words: amountInWords
     };
     const { error } = await supabase.from('quotations').insert([payload]);
     if (error) {
         alert("Error saving quotation: " + error.message);
     } else {
         alert("Quotation saved to database!");
         fetchHistory();
     }
     setIsSaving(false);
  };

  const handleDownloadPDF = () => {
    const element = pdfRef.current;
    
    // Temporarily make it visible for html2pdf
    element.style.display = "block";
    
    const opt = {
      margin:       0.5,
      filename:     `Quotation_${quotationNo || 'Draft'}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
        // Hide again after download
        element.style.display = "none";
    });
  };

  return (
    <div className="animate-fade-in flex flex-col gap-6">
      
      {/* Configuration Form */}
      <Card extra="p-6">
         <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h3 className="text-[18px] font-bold text-navy-700 dark:text-white">Create Quotation</h3>
            <div className="flex gap-2">
                <button onClick={handleSaveToDB} disabled={isSaving} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-bold hover:bg-blue-100 transition">
                    <MdSave /> {isSaving ? 'Saving...' : 'Save to CRM'}
                </button>
                <button onClick={handleDownloadPDF} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition">
                    <MdPictureAsPdf /> Download PDF
                </button>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
               <label className="text-sm font-bold text-gray-600">Quotation No.</label>
               <input type="text" value={quotationNo} onChange={e=>setQuotationNo(e.target.value)} placeholder="e.g. 21/2025" className="mt-1 w-full p-2 border rounded-lg outline-none focus:border-blue-500" />
            </div>
            <div>
               <label className="text-sm font-bold text-gray-600">Customer ID</label>
               <input type="text" value={customerId} onChange={e=>setCustomerId(e.target.value)} placeholder="e.g. 316/2025" className="mt-1 w-full p-2 border rounded-lg outline-none focus:border-blue-500" />
            </div>
            <div>
               <label className="text-sm font-bold text-gray-600">Date</label>
               <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="mt-1 w-full p-2 border rounded-lg outline-none focus:border-blue-500" />
            </div>
         </div>

         <div className="mb-4">
            <h4 className="text-md font-bold text-gray-700 mb-2">Line Items</h4>
            <div className="border rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                   <thead className="bg-gray-100">
                      <tr>
                         <th className="p-3 w-12">#</th>
                         <th className="p-3">Description</th>
                         <th className="p-3 w-32">Qty (SqFt)</th>
                         <th className="p-3 w-32">Rate (₹)</th>
                         <th className="p-3 w-32 text-right">Total</th>
                         <th className="p-3 w-16 text-center"></th>
                      </tr>
                   </thead>
                   <tbody>
                      {items.map((item, idx) => (
                         <tr key={idx} className="border-b last:border-0 hover:bg-gray-50">
                            <td className="p-3 font-bold text-gray-500">{idx + 1}</td>
                            <td className="p-3">
                               <input type="text" value={item.desc} onChange={e => handleItemChange(idx, 'desc', e.target.value)} className="w-full p-2 border rounded outline-none focus:border-blue-500" />
                            </td>
                            <td className="p-3">
                               <input type="number" value={item.qty} onChange={e => handleItemChange(idx, 'qty', e.target.value)} className="w-full p-2 border rounded outline-none focus:border-blue-500" />
                            </td>
                            <td className="p-3">
                               <input type="number" value={item.rate} onChange={e => handleItemChange(idx, 'rate', e.target.value)} className="w-full p-2 border rounded outline-none focus:border-blue-500" />
                            </td>
                            <td className="p-3 text-right font-bold text-gray-700">
                               ₹{((parseFloat(item.qty)||0) * (parseFloat(item.rate)||0)).toLocaleString('en-IN')}
                            </td>
                            <td className="p-3 text-center">
                               <button onClick={() => handleRemoveItem(idx)} className="text-red-500 hover:bg-red-50 p-2 rounded-full transition"><MdDelete size={18}/></button>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
            </div>
            <div className="mt-4 flex justify-between items-center">
                <button onClick={handleAddItem} className="flex items-center gap-1 text-sm font-bold text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition">
                   <MdAdd /> Add Row
                </button>
                <div className="flex gap-6 items-end">
                   <div>
                       <label className="text-sm text-gray-500 font-bold block mb-1">GST Tax (%)</label>
                       <input type="number" value={taxRate} onChange={e=>setTaxRate(e.target.value)} placeholder="0" className="w-24 p-2 border rounded outline-none focus:border-blue-500" />
                   </div>
                   <div className="text-right">
                       <p className="text-sm text-gray-500">Subtotal: ₹{subtotal.toLocaleString('en-IN')}</p>
                       {taxAmount > 0 && <p className="text-sm text-gray-500">Tax: ₹{taxAmount.toLocaleString('en-IN')}</p>}
                       <p className="text-2xl font-bold text-navy-700 mt-1">₹{totalAmount.toLocaleString('en-IN')}</p>
                   </div>
                </div>
            </div>
         </div>
      </Card>

      {/* Hidden PDF Template */}
      <div style={{ display: 'none' }}>
        <div ref={pdfRef} style={{ padding: '40px', fontFamily: 'Arial, sans-serif', color: '#000', backgroundColor: '#fff', width: '700px', margin: '0 auto' }}>
            
            {/* Header / Logo */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGMAAABjCAYAAACPO76VAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAlwSFlzAAAh1QAAIdUBBJy0nQAADb9JREFUeF7tnXeQl0cZx0Pvvbej93KUAw44QHqXi5SjhiISQBEwMhKEEIyMAuKBY0NIyKgoMugYJERQBIZYY0FNnIkmxjQ1QAIaEFLg/HzjnXPcvfu++5Yf9753tzP7x91vd9/d57v77NN29667ylM5BcopUE6BMkmBhox6Knkz+Rvkn5B/S/5DQvPv6fdT5JPkh8nryaPJNeOKbiM6tpp8jvwuOa8M5OuM8Rh5PrlGHIBpQye+RL5WBojvNsEuMv4t5HolAUp1Pvop8n/KOAhFAboAPT5ErninQEnnQ8+Ug+DKin8MfVqmGpC55avBej/8B7QakipAPkbDt8pXhDUYYmHaS6dEDciaMCBUr179ZpMmTZ5t3rz5Y61atfpyp06ddnXu3Dm2uUOHDrvo69fIP2zcuPGLlStXDiMd3oB2E6IC5AM0dNMvGDVq1LgG4Q8OHjx4xsGDBxtE1ZmSaGf79u0t09PTF7do0eJ41apVg4ju/6bf2mtDpa7UVkPWMwMQXm/btu0GUqIBMFFt4cKFaS1btswFFOkZ1nSh7HPkwKJvZSr/0vaDFStWvNW6deu98+bNK5UgFAVn3Lhx7WG9x23pk1/ukaBLw3qfYDW8MXDgQJlAylTKy8ur0Lt37zWskrctQZEA9D6/RKpPhddtPlC7du2/jhkzpovfD5Sm8kOGDBlds2bNN23oRZlfkyv4Gb+MfJ78sFatWs8PHTo05cqNn46XVNlhw4ZlIjXaAjLNtp9VKfh3LzD48BtlfUUUJSiS46RKlSq940U7fj9lC8b7vRrjg3kDBgyYbttgUsvNnTu3c5cuXVampaV9BglxK/vDrC1btoiFGxM6yiYv+vG7VIX2NnT5uldj6A+BpQKbDpR0mQkTJrRD4TvGpCtmcRAratOmzdY9e/ZUc+rn4cOHKzVo0MBGCv241zhlbfynGxh05vLy5csbezWU1N/79euXwRgveU3IRo0anV2/fn0dp3Ei9g4GSC9F+UdeNJJU5Lpxs2Rlty+Vac6cOc0Q02Xg8xReVAYOcdhECBTD73u0I2VaupwxzXRroFq1ajeWLFnSpFQiwaBkN7MFQuUqVKiQN3z4cLlgiyVWxwiLtmThMKb73Rpo2rSpcSYkHaADBw5UR1S/akHA21YNVgdHmkghhJX9xaO9yW502+1WGWliXtKJbur/tGnTMv0CofJYdV82tYkEtsOjzaVu9FT0gyO/lBl527ZtzUorGKNGjZJ12mqvKFyuYcOGb5logkI83qPNtW70NIq1LLkX4wDE6dOnq2dnZw9A6pnTtWvX+9goN2Pa3opgsblnz55rMXXfvWLFil6Uc90ci44FMGx4fDGwoIv83o5p3759DZnEbg65+wKB0axZM09RLFVgTZ06tRu8eRMs4WfwdSujXJ06da6yx51ACfsoUpKnySY3N7c+AopV24VnO5PhhNu40TkElmnFBQMDReebqSK2U7tSnpjpObCBJ2WeD8JCCupUqVLlHYB8zCT5FHyfCfc9v9/p37+/6z7KylEQXLRg4Ca9Y1q3zPH169ePPAJFoiir5czYsWMznCZAVlZWDz9OIwB+SpPGbZKyQs9EDka3bt1SDsaCBQuasuy/K6L5naF+yrNSbrZr1y53165dxSIBsUXlwOc9jX0Q+aXp06e38+IWKJEK24l2ZaQaDCyeWewHr/ohatiy8PPzEydO7FiUoPgnJtSrV+8lp/Y1URSoMHPmzFZeQOj3xIHRp0+fhcxWRVF4rgj2jzz2kb8hQR1Bjv8skSbr2rdvvxI2uh6J6vOwocch5Gs2bakMdqgL8H3pGLel48ePV8MyPRet/GHcqydp95j0BoQJX7FQiQKje/fuH7QwquXhUXweADYwIzt5zUi034qTJk3KYEPeCbEVB+sKMlLU1czMzJFe7Qb5PTFg9O3bdyb82dW6CQiv9OjRY4lfvaGAcPgfarNy7ofgrlEuEO3NESNG9AtCcLc6iQADvtwPAhkDp8Wb2WQPYK4PHN5SmEiwlzRYzWm3VcKm/LKEiCgBiT0Ymq3wdaMRjdXyFpr08iiJorYkhiqa0U1ag7Udl5Evqm/HHgw2wi+YZqiAgH2l1KWL+LrBDRCUzWVlAozJkyf3RXJyDJGUpIQIfU9UhHBrp2PHjrmmCUHYzcWVK1dGEowX65WBjP4DExHYaOXcuSNJLAuR9YypL5h/HoqiI7EFY/z48elOTn4RhD3kuZ07d9aKggC2bUiDxvzhGOvE6rjC3lbXti1TudiCwUz8imkmIl1lhx14kPpIbA+Y+oRI/ZEgbRauE0swFNqCueOy08ABSUeTSyStXr26rmKFDf36RdhOxRIMTA5Gr5eUurCDDlMf6W63ExgIGrc2btxoZYNKFJvCxvM5pwFjrrgmvSMMMcPWnTFjRoZJ1GUSLQ7TfixXBrb/nzqBgdFPZxxKNEnJox+O8VIYH78apnOxBANnkaNtCBHyk2EGG1Vd+VGcJgsmlCfDfCN2YHCmr7GCpZ0Gi9kjO8xgo6qLCX6rU/9wm2rFBE6xA2PZsmU9nQaq/40cObJv4JFGWJFIEwkRxSYMK1pev8ApdmAQWp9lAgPRspinLfDIQ1RkUsxx6iMCRt6tW7cCX9QSOzBycnKGm8BYtWpV2xA0jKzq6NGjHcFAQxcYjtHmNh+PHRiLFi0SK3LcM/DI9bYZVKrLyPVrYFMKEwqcYgfGjh07mpvkeMJyJgYeaYQV8XNscAIjPwgt8JdiBwZyfKW6des6Bhyg/a4NPNIIKyJi69a4YqsXU81vwnwmdmBoMChVvzMM9lCYwUZVF6L/2al/6B+KPw6cYgkG7kxpssVmHsbDS0GDDQJTqEhFSXQm0z7Org+H+U4swcCV6SitCCDik1wPjYQhhk1dFD5ZAYpNFO1z+TqSTTOOZWIJxpo1axTl7bhvwCKOBh5tyIpalexnLziBgfYt1hUqxRIMjYjBHXEatFgEXsABoUYdsDJsaJFTn/Q/3MAPBmz2/9ViC8agQYOMPg32lHNRhsjYEFFHhwmSc4zvxZfxNjFbaTbtuJWJLRj5hw4dpSrNRGZpaDenH+Ihzu4zrYqwUlRBP2ILhjrIhSfTTAogs/E6m/kgPwQNWpZjaEsVGuQEBiaQG1OmTOkQtO3C9WINhjpKAPPjphlJ5y8QtZFSE4kmhFvUO0fWPh0FEGoj9mBA7DZ08ooJEMJkLnDkKyUrBP/JbGa+Tqg6rgpChp5xOkQTFJzYg6GBEcI5y+2sHmLwdfaQZVFt6gStVSWKcLtJuRM4fPMakeiRrspEgCFAII6jd63wrMV3foJjwXJOBU5IcaNwEj1tWg36v44maNUE/oihYmLA0KyHP3ve1wGh3kX0PQIo46ljdb776NGjNTMyMnJQKM96nRFkhd5kYkQe9Z6IPaPwJBIgilvyIljBrGaGX0QA+A4s7BOcNrqbC1OGzZ49O1OH6kV8TOEPIJY+YXsPiA5T0lZKgEgcGAXA6HYDKVpurCTq3yREpPrW0cSwqaJslrs2hrgdookSDPaic1x7kXL/e0rA4IBJys+BCxyiC2vCth5C/EzJAykQ5zUiQe6NSkrz2vBTAgaRdY96fTjK33XfB5t7LoP5VxQrgvN6r+qgpQKdo+ynV1s41eQpjPZQfr7W7PXtyH/XGQkFRuusHUY9X/ePs9lfpt+HEG2z9+7dWyXyzlk0iKX6lcjBIMwxtG3fou+uRXS9EadWs3r16rUaVrYHQh9m9ZxCejpNYPVJ/v42t+js5JKyZfPnz+8v33vYb4apf/78+Vp6riIoGAdMFdXo/v37A8cPhRlUUutyfnGoB4vVAzHG9EW3ysjxk5JKmJLoN4rkRg8wXPWbLW6VYQM6BlaeLCkAa/e6bDjbrSnHqLoCgLCmXorSomk5pkQW49GT7h5X4knCSncbnO7OcL30JJWmg0RS3dBpVAEvm5vM+K4B1RL/XC88QV5/QXfAlibCRT2WWbNmpckF4DGxf2XzXeOh+YLG0cb1vkZ5MlCAiwd08bDX3VnbbAjoeGikcOO6x4+3MyJ1wth0LAll0HFmmnzrRQCyCk3SlUKeL6Rg0HuWUP/6SSDQneqjHnfRKwoWq+KPlLG+ucdr83lvCWL5PFW+f/wPavaJ5uynev7Niz3p93v9TBC9emJ02hf+oNyipnck/HwwyWW1YQPEnyyB0EWUvgUg4xVART+qWzD1bl2SCRq079yFO8znraOLg3xLe4duwLdZdroF8woGvKV3yk8QZEBR1hF7ViyuT+/kWfoQ+K3wcVT2eq7mNrAIAPg5QcyqVyqT7qnCRrcggEdSfpnQnkXjFUCmVZN/zfV5xc6uW7cu1EUocUEUybEb1yFt0p26ttyiUDlNaD0JETpJBHs0QAfeWzG6mQYHy9MoQo/ga9jAwZR78D9MJYojtpn+TcM1uxSTxgMY+w4JAEvdIZBHzy9CilX6VlBAyng9vdsXeZLXbHcZJ6yVMJNPI4UdrYgchSIN6nZNX2+El0EAJYWOTDUQBe3r7IJeVPEzU8pCWW3U+8mRXMPqF0y9Aa4nlcsCod3GqCstniA7PpLil6hhykvaGkU+SPY0MJYy4PQ0hOIG+oQhYKrqynOlQ5S6oFenk3TfuR4i1PLV7ElqVv+ltOlYgW5s0+OSivywiohPFbGDtKuVozfGZRwTWEnL6neJBMAFIXZ5nQgo8F/p2maM1oCkrwAAAABJRU5ErkJggg==" alt="Logo" style={{ maxHeight: '100px', objectFit: 'contain' }} 
                     onError={(e) => { e.target.style.display = 'none'; }} />
            </div>

            <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid #000', paddingBottom: '10px' }}>
                <h1 style={{ fontSize: '24px', margin: '0 0 5px 0', color: '#000', textTransform: 'uppercase' }}>DAYAL CONSTRUCTIONS & CO.</h1>
                <p style={{ margin: '0', fontSize: '12px', fontStyle: 'italic' }}>Born to Build</p>
                <p style={{ margin: '5px 0 0 0', fontSize: '11px' }}>Address: Battalion More, Opposite Thalamus Hospital, Behind Darjeeling Public School, 734015, Siliguri, West Bengal, India.</p>
                <p style={{ margin: '3px 0 0 0', fontSize: '11px' }}>Phone No: 70030-70035 / 708-3333-000 | E-Mail: dayalconstruction.office@gmail.com | Website: www.dayalconstructions.com</p>
            </div>

            <h2 style={{ textAlign: 'center', fontSize: '18px', textDecoration: 'underline', marginBottom: '20px' }}>QUOTATION</h2>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                <div style={{ fontSize: '12px', lineHeight: '1.5' }}>
                    <p style={{ margin: '0', fontWeight: 'bold', fontSize: '14px' }}>{leadData?.name || 'Client Name'}</p>
                    <p style={{ margin: '0' }}>Address: {leadData?.address || 'Client Address'}</p>
                    <p style={{ margin: '0' }}>Phone No: {leadData?.phone || 'Client Phone'}</p>
                    <p style={{ margin: '0' }}>E-Mail: {leadData?.email || 'Client Email'}</p>
                </div>
                <div style={{ fontSize: '12px', lineHeight: '1.5', textAlign: 'right' }}>
                    <p style={{ margin: '0' }}><strong>DATE:</strong> {date.split("-").reverse().join("-")}</p>
                    <p style={{ margin: '0' }}><strong>QUOTATION NO:</strong> {quotationNo}</p>
                    <p style={{ margin: '0' }}><strong>CUSTOMER ID:</strong> {customerId}</p>
                </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px', fontSize: '12px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f0f0f0' }}>
                        <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'center', width: '40px' }}>SL NO</th>
                        <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'left' }}>DESCRIPTION</th>
                        <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'center', width: '120px' }}>QUANTITY(SQFT)</th>
                        <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'center', width: '100px' }}>UNIT PRICE</th>
                        <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'center', width: '100px' }}>TOTAL</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, idx) => (
                    <tr key={idx}>
                        <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>{idx + 1}</td>
                        <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'left' }}>{item.desc}</td>
                        <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>{item.qty}</td>
                        <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>₹{item.rate}</td>
                        <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>₹{((parseFloat(item.qty)||0)*(parseFloat(item.rate)||0)).toLocaleString('en-IN')}</td>
                    </tr>
                    ))}
                    <tr>
                        <td colSpan="4" style={{ border: '1px solid #000', padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>SUBTOTAL</td>
                        <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center', fontWeight: 'bold' }}>₹{subtotal.toLocaleString('en-IN')}</td>
                    </tr>
                    {taxAmount > 0 && (
                    <tr>
                        <td colSpan="4" style={{ border: '1px solid #000', padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>GST ({taxRate}%)</td>
                        <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center', fontWeight: 'bold' }}>₹{taxAmount.toLocaleString('en-IN')}</td>
                    </tr>
                    )}
                    <tr>
                        <td colSpan="4" style={{ border: '1px solid #000', padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>GRAND TOTAL</td>
                        <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center', fontWeight: 'bold' }}>₹{totalAmount.toLocaleString('en-IN')}</td>
                    </tr>
                </tbody>
            </table>

            <div style={{ marginBottom: '30px', fontSize: '13px', fontWeight: 'bold', textAlign: 'center' }}>
                ({amountInWords})
            </div>

            <div style={{ fontSize: '12px', lineHeight: '1.5' }}>
                <p style={{ margin: '0', fontWeight: 'bold', textDecoration: 'underline', marginBottom: '5px' }}>BANK DETAILS</p>
                <p style={{ margin: '0' }}>Bank Name : UCO Bank</p>
                <p style={{ margin: '0' }}>Branch: Fulbari</p>
                <p style={{ margin: '0' }}>A/C No: 32790210002575</p>
                <p style={{ margin: '0' }}>IFSC Code: UCBA0003279</p>
                <p style={{ margin: '0' }}>Owner Name - Dayal Constructions & CO.</p>
            </div>

            <div style={{ marginTop: '40px', fontSize: '11px', lineHeight: '1.5', color: '#555' }}>
                <p style={{ margin: '0' }}><strong>*NOTE:</strong></p>
                <p style={{ margin: '0' }}>1. GST will be charge at applicable rate.</p>
                <p style={{ margin: '0' }}>2. No Refund will be given.</p>
            </div>
        </div>
      </div>

    </div>
  );
};

export default TabQuotationBuilder;
