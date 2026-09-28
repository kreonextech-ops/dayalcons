import React, { useState, useRef, useEffect } from "react";
import Card from "components/card";
import { MdAdd, MdDelete, MdPictureAsPdf, MdSave } from "react-icons/md";
import { createClient } from "@supabase/supabase-js";
import html2pdf from "html2pdf.js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);

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
  
  const [discount, setDiscount] = useState("");
  const [cgst, setCgst] = useState("");
  const [sgst, setSgst] = useState("");
  const [igst, setIgst] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const pdfRef = useRef(null);

  // Hardcoded Base64 images for reliable PDF generation
  const [img6, setImg6] = useState(""); // Logo
  const [img7, setImg7] = useState(""); // QR
  const [img8, setImg8] = useState(""); // Signature
  const [img9, setImg9] = useState(""); // Stamp

  useEffect(() => {
     // Fetch local images as base64 safely
     const loadImages = async () => {
         try {
             const toB64 = async (url) => {
                 const res = await fetch(url);
                 const blob = await res.blob();
                 return new Promise((resolve) => {
                     const reader = new FileReader();
                     reader.onloadend = () => resolve(reader.result);
                     reader.readAsDataURL(blob);
                 });
             };
             setImg6(await toB64('/crm/assets/img/quotation/image6.png').catch(()=>''));
             setImg7(await toB64('/crm/assets/img/quotation/image7.jpeg').catch(()=>''));
             setImg8(await toB64('/crm/assets/img/quotation/image8.jpeg').catch(()=>''));
             setImg9(await toB64('/crm/assets/img/quotation/image9.png').catch(()=>''));
         } catch(e) {}
     };
     loadImages();
  }, []);

  const handleAddItem = () => setItems([...items, { desc: "", qty: 1, rate: 0 }]);
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
  const discountAmt = parseFloat(discount) || 0;
  const afterDiscount = subtotal - discountAmt;
  
  const cgstAmt = (parseFloat(cgst) || 0) > 0 ? afterDiscount * (parseFloat(cgst) / 100) : 0;
  const sgstAmt = (parseFloat(sgst) || 0) > 0 ? afterDiscount * (parseFloat(sgst) / 100) : 0;
  const igstAmt = (parseFloat(igst) || 0) > 0 ? afterDiscount * (parseFloat(igst) / 100) : 0;
  
  const totalAmount = afterDiscount + cgstAmt + sgstAmt + igstAmt;
  const amountInWords = numberToWords(Math.round(totalAmount));

  const handleSaveToDB = async () => {
     setIsSaving(true);
     const payload = {
         lead_id: isClient ? null : leadData?.id,
         client_id: isClient ? leadData?.id : null,
         quotation_no: quotationNo,
         customer_id: customerId,
         quotation_date: date,
         items: items,
         subtotal: subtotal,
         tax_rate: (parseFloat(cgst)||0) + (parseFloat(sgst)||0) + (parseFloat(igst)||0),
         tax_amount: cgstAmt + sgstAmt + igstAmt,
         total_amount: totalAmount,
         amount_in_words: amountInWords
     };
     const { error } = await supabase.from('quotations').insert([payload]);
     if (error) alert("Error saving quotation: " + error.message);
     else alert("Quotation saved to database!");
     setIsSaving(false);
  };

  const handleDownloadPDF = () => {
    const element = pdfRef.current;
    element.style.display = "block";
    
    // Exact sizing for A4 to prevent cutoff
    const opt = {
      margin:       [0.2, 0.2, 0.2, 0.2],
      filename:     `Quotation_${quotationNo || 'Draft'}.pdf`,
      image:        { type: 'jpeg', quality: 1 },
      html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
      jsPDF:        { unit: 'in', format: 'A4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
        element.style.display = "none";
    });
  };

  return (
    <div className="animate-fade-in flex flex-col gap-6">
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
               <input type="text" value={quotationNo} onChange={e=>setQuotationNo(e.target.value)} className="mt-1 w-full p-2 border rounded-lg outline-none focus:border-blue-500" />
            </div>
            <div>
               <label className="text-sm font-bold text-gray-600">Customer ID</label>
               <input type="text" value={customerId} onChange={e=>setCustomerId(e.target.value)} className="mt-1 w-full p-2 border rounded-lg outline-none focus:border-blue-500" />
            </div>
            <div>
               <label className="text-sm font-bold text-gray-600">Date</label>
               <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="mt-1 w-full p-2 border rounded-lg outline-none focus:border-blue-500" />
            </div>
         </div>

         <div className="mb-4">
            <h4 className="text-md font-bold text-gray-700 mb-2">Line Items</h4>
            <div className="border rounded-xl overflow-hidden mb-4">
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
                            <td className="p-3"><input type="text" value={item.desc} onChange={e => handleItemChange(idx, 'desc', e.target.value)} className="w-full p-2 border rounded outline-none focus:border-blue-500" /></td>
                            <td className="p-3"><input type="number" value={item.qty} onChange={e => handleItemChange(idx, 'qty', e.target.value)} className="w-full p-2 border rounded outline-none focus:border-blue-500" /></td>
                            <td className="p-3"><input type="number" value={item.rate} onChange={e => handleItemChange(idx, 'rate', e.target.value)} className="w-full p-2 border rounded outline-none focus:border-blue-500" /></td>
                            <td className="p-3 text-right font-bold text-gray-700">₹{((parseFloat(item.qty)||0) * (parseFloat(item.rate)||0)).toLocaleString('en-IN')}</td>
                            <td className="p-3 text-center"><button onClick={() => handleRemoveItem(idx)} className="text-red-500 hover:bg-red-50 p-2 rounded-full transition"><MdDelete size={18}/></button></td>
                         </tr>
                      ))}
                   </tbody>
                </table>
            </div>
            
            <div className="flex justify-between items-start">
                <button onClick={handleAddItem} className="flex items-center gap-1 text-sm font-bold text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition">
                   <MdAdd /> Add Row
                </button>
                
                <div className="flex flex-col gap-2 w-64 bg-gray-50 p-4 rounded-xl border">
                    <div className="flex justify-between items-center text-sm">
                        <span className="font-bold text-gray-600">Subtotal:</span>
                        <span>₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Discount (₹):</span>
                        <input type="number" value={discount} onChange={e=>setDiscount(e.target.value)} className="w-20 p-1 border rounded text-right" placeholder="0" />
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">CGST (%):</span>
                        <input type="number" value={cgst} onChange={e=>setCgst(e.target.value)} className="w-16 p-1 border rounded text-right" placeholder="0" />
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">SGST (%):</span>
                        <input type="number" value={sgst} onChange={e=>setSgst(e.target.value)} className="w-16 p-1 border rounded text-right" placeholder="0" />
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">IGST (%):</span>
                        <input type="number" value={igst} onChange={e=>setIgst(e.target.value)} className="w-16 p-1 border rounded text-right" placeholder="0" />
                    </div>
                    <div className="border-t pt-2 mt-1 flex justify-between items-center">
                        <span className="font-bold text-navy-700">Total:</span>
                        <span className="text-lg font-bold text-blue-600">₹{totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                </div>
            </div>
         </div>
      </Card>

      {/* Hidden PDF Template (Exact replication of user's Excel layout) */}
      <div style={{ display: 'none' }}>
        <div ref={pdfRef} style={{ 
            padding: '20px 30px', 
            fontFamily: '"Calibri", "Arial", sans-serif', 
            color: '#000', 
            backgroundColor: '#fff', 
            width: '793px', /* Exact A4 width px at 96dpi */
            margin: '0 auto',
            boxSizing: 'border-box'
        }}>
            
            {/* Top Logo Header Box */}
            <div style={{ border: '1px solid #000', padding: '10px', marginBottom: '15px', minHeight: '60px', display: 'flex', alignItems: 'center' }}>
                {img6 ? <img src={img6} alt="Logo" style={{ maxHeight: '60px' }} /> : (
                    <div>
                        <h1 style={{ color: '#00B0F0', fontSize: '20px', margin: '0', fontWeight: 'bold' }}>DAYAL CONSTRUCTIONS & CO.</h1>
                        <p style={{ fontStyle: 'italic', margin: '0', fontSize: '14px' }}>Born to Build</p>
                    </div>
                )}
            </div>

            {/* Address */}
            <div style={{ textAlign: 'center', fontSize: '10px', marginBottom: '15px' }}>
                <p style={{ margin: '0 0 4px 0' }}><strong>Address :</strong>Battalion More,Opposite Thalamus Hospital, Behind Darjeeling Public School,734015, Siliguri,Westbengal,India.</p>
                <p style={{ margin: '0' }}><strong>Phone No :</strong> 70030-70035 / 708-3333-000 | <strong>E-Mail :</strong> dayalconstruction.office@gmail.com | <strong>Website:</strong> www.dayalconstructions.com</p>
            </div>

            {/* Title */}
            <div style={{ textAlign: 'center', margin: '20px 0' }}>
                <h2 style={{ fontSize: '18px', textDecoration: 'underline', fontWeight: 'bold', margin: '0' }}>QUOTATION</h2>
            </div>

            {/* Middle Section: Client Details & Quotation Info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '11px' }}>
                {/* Left: Client */}
                <div style={{ lineHeight: '1.4' }}>
                    <p style={{ margin: '0' }}>{leadData?.name?.toUpperCase() || 'CLIENT NAME'}</p>
                    <p style={{ margin: '0' }}>Address : {leadData?.address || 'ADDRESS'}</p>
                    <p style={{ margin: '0' }}>Dist. : DARJEELING</p>
                    <p style={{ margin: '0' }}>Phone No : {leadData?.phone || 'PHONE'}</p>
                    <p style={{ margin: '0' }}>E-Mail : {leadData?.email || 'EMAIL'}</p>
                </div>

                {/* Right: Quotation Details Table */}
                <div>
                    <table style={{ borderCollapse: 'collapse', fontSize: '11px', width: '250px' }}>
                        <tbody>
                            <tr>
                                <td style={{ border: '1px solid #000', padding: '3px 6px', fontWeight: 'bold', width: '40%' }}>DATE :</td>
                                <td style={{ border: '1px solid #000', padding: '3px 6px', textAlign: 'center' }}>{date.split("-").reverse().join("-")}</td>
                            </tr>
                            <tr>
                                <td style={{ border: '1px solid #000', padding: '3px 6px', fontWeight: 'bold' }}>QUOTATION NO :</td>
                                <td style={{ border: '1px solid #000', padding: '3px 6px', textAlign: 'center' }}>{quotationNo}</td>
                            </tr>
                            <tr>
                                <td style={{ border: '1px solid #000', padding: '3px 6px', fontWeight: 'bold' }}>CUSTOMER ID :</td>
                                <td style={{ border: '1px solid #000', padding: '3px 6px', textAlign: 'center' }}>{customerId}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Main Items Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '15px', fontSize: '11px' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'center', width: '5%' }}>SL<br/>NO</th>
                        <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'center', width: '40%' }}>DESCRIPTION</th>
                        <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'center', width: '15%' }}>QUANTITY(SQFT)</th>
                        <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'center', width: '15%' }}>UNIT PRICE</th>
                        <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'center', width: '10%' }}>TAXES</th>
                        <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'center', width: '15%' }}>AMOUNT</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, idx) => (
                    <tr key={idx}>
                        <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>{idx + 1}</td>
                        <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'left' }}>{item.desc}</td>
                        <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>{item.qty}</td>
                        <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>₹ {parseFloat(item.rate).toFixed(2)} /Sq.ft.</td>
                        <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>-</td>
                        <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>₹ {((parseFloat(item.qty)||0)*(parseFloat(item.rate)||0)).toFixed(2)}</td>
                    </tr>
                    ))}
                </tbody>
            </table>

            {/* Bottom Layout (Bank Details + Totals Grid) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                
                {/* Left: Bank Details & QR */}
                <div style={{ width: '55%', border: '1px solid #000', padding: '8px', fontSize: '10px', display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ lineHeight: '1.6' }}>
                        <p style={{ margin: '0', fontWeight: 'bold', textDecoration: 'underline', marginBottom: '4px' }}>BANK DETAILS</p>
                        <p style={{ margin: '0' }}>Bank Name : UCO Bank</p>
                        <p style={{ margin: '0' }}>Branch: Fulbari</p>
                        <p style={{ margin: '0' }}>A/C No: 32790210002575</p>
                        <p style={{ margin: '0' }}>IFSC Code: UCBA0003279</p>
                        <p style={{ margin: '0' }}>Owner Name - Dayal Constructions & CO.</p>
                    </div>
                    <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <p style={{ margin: '0', fontWeight: 'bold', fontSize: '8px' }}>BHIM UPI PAYMENT ACCEPTED</p>
                        <p style={{ margin: '0 0 4px 0', fontSize: '7px', fontStyle: 'italic' }}>SCAN OR CODE TO PAY</p>
                        {img7 && <img src={img7} alt="QR" style={{ width: '70px', height: '70px' }} />}
                        <p style={{ margin: '4px 0 0 0', fontSize: '7px', fontWeight: 'bold' }}>OR ENTER PAYMENT ADDRESS</p>
                        <p style={{ margin: '0', fontSize: '8px', fontWeight: 'bold' }}>9749327676@uco</p>
                    </div>
                </div>

                {/* Right: Totals Grid */}
                <div style={{ width: '40%' }}>
                    <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '11px', fontWeight: 'bold' }}>
                        <tbody>
                            <tr>
                                <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'center', width: '50%' }}>SUBTOTAL</td>
                                <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'center', width: '50%' }}>₹ {subtotal.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'center' }}>DISCOUNT</td>
                                <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'center' }}>{discountAmt > 0 ? `- ₹ ${discountAmt.toFixed(2)}` : '-'}</td>
                            </tr>
                            <tr>
                                <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'center' }}>CGST @ {cgst||'0'}%</td>
                                <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'center' }}>{cgstAmt > 0 ? `₹ ${cgstAmt.toFixed(2)}` : '-'}</td>
                            </tr>
                            <tr>
                                <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'center' }}>SGST @ {sgst||'0'}%</td>
                                <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'center' }}>{sgstAmt > 0 ? `₹ ${sgstAmt.toFixed(2)}` : '-'}</td>
                            </tr>
                            <tr>
                                <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'center' }}>IGST @ {igst||'0'}%</td>
                                <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'center' }}>{igstAmt > 0 ? `₹ ${igstAmt.toFixed(2)}` : '-'}</td>
                            </tr>
                            <tr>
                                <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'center' }}>TOTAL</td>
                                <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'center' }}>₹ {totalAmount.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div style={{ textAlign: 'center', fontSize: '10px', fontWeight: 'bold', marginTop: '6px' }}>
                        ({amountInWords})
                    </div>
                </div>

            </div>

            {/* Footer Section (Notes + Signatures) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '10px', marginBottom: '20px' }}>
                <div style={{ fontSize: '10px', fontWeight: 'bold', lineHeight: '1.4' }}>
                    <p style={{ margin: '0' }}>*NOTE: 1. GST will be charge at applicable rate.</p>
                    <p style={{ margin: '0 0 0 35px' }}>2. No Refund will be given.</p>
                </div>
                
                <div style={{ position: 'relative', width: '200px', height: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
                    {/* Stamp */}
                    {img9 && <img src={img9} alt="Stamp" style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', width: '100px', opacity: 0.8 }} />}
                    {/* Signature */}
                    {img8 && <img src={img8} alt="Signature" style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', width: '80px', zIndex: 10 }} />}
                    
                    <p style={{ margin: '0', fontSize: '10px', fontWeight: 'bold', textDecoration: 'underline', position: 'relative', zIndex: 20 }}>
                        SIGNATURE WITH SEAL
                    </p>
                </div>
            </div>

            {/* Bottom Blue Bar */}
            <div style={{ border: '1px solid #000', textAlign: 'center', padding: '8px', color: '#0070C0', fontWeight: 'bold', fontSize: '14px' }}>
                Thanks For Your Business
            </div>

        </div>
      </div>

    </div>
  );
};

export default TabQuotationBuilder;
