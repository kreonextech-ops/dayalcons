import re
import base64

# 1. Read image1.png as base64
with open('crm/public/assets/img/quotation/image1.png', 'rb') as img_f:
    img_b64 = base64.b64encode(img_f.read()).decode('utf-8')
logo_src = f"data:image/png;base64,{img_b64}"

# 2. Fix TabEstimate.jsx (Close button & Add Proposal text)
with open('crm/src/views/admin/crm/components/TabEstimate.jsx', 'r', encoding='utf-8') as f:
    est_c = f.read()

est_c = est_c.replace(
    '<button onClick={() => setShowAddProposal(true)} className="flex items-center gap-2 h-10 px-5 rounded-[10px] bg-[#F1F5F9] text-[#475569] font-bold text-[14px] hover:bg-[#E2E8F0] transition shadow-sm">\n               <MdUploadFile size={20} /> Upload PDF\n             </button>',
    '<button onClick={() => setShowAddProposal(true)} className="flex items-center gap-2 h-10 px-5 rounded-[10px] bg-[#F1F5F9] text-[#475569] font-bold text-[14px] hover:bg-[#E2E8F0] transition shadow-sm">\n               <MdUploadFile size={20} /> Add Next Proposal (PDF)\n             </button>'
)

old_modal = """<div className="fixed inset-0 z-[100] bg-gray-100 dark:bg-navy-900 overflow-y-auto">
             <div className="max-w-7xl mx-auto py-8 px-4 relative">
                 <button onClick={() => setShowBuilder(false)} className="absolute top-4 right-4 bg-white p-2 rounded-full shadow hover:bg-gray-50 text-gray-600">
                     <MdClose size={24} />
                 </button>
                 <TabQuotationBuilder leadData={leadData} isClient={isClient} />
             </div>
         </div>"""

new_modal = """<div className="fixed inset-0 z-[100] bg-gray-100 dark:bg-navy-900 overflow-y-auto">
             <button onClick={() => setShowBuilder(false)} className="fixed top-6 right-6 z-[101] bg-white p-3 rounded-full shadow-2xl border border-red-100 hover:bg-red-50 text-red-600 transition flex items-center justify-center">
                 <MdClose size={28} />
             </button>
             <div className="max-w-7xl mx-auto py-12 px-4 relative">
                 <TabQuotationBuilder leadData={leadData} isClient={isClient} />
             </div>
         </div>"""
est_c = est_c.replace(old_modal, new_modal)

with open('crm/src/views/admin/crm/components/TabEstimate.jsx', 'w', encoding='utf-8') as f:
    f.write(est_c)

# 3. Fix TabQuotationBuilder.jsx (Tax fields, math, PDF width, logo base64)
with open('crm/src/views/admin/crm/components/TabQuotationBuilder.jsx', 'r', encoding='utf-8') as f:
    qb_c = f.read()

# Add Tax state
qb_c = qb_c.replace('const [items, setItems] = useState(defaultItems);', 'const [items, setItems] = useState(defaultItems);\n  const [taxRate, setTaxRate] = useState("");')

# Fix math
old_math = """const totalAmount = items.reduce((sum, item) => sum + (parseFloat(item.qty) || 0) * (parseFloat(item.rate) || 0), 0);
  const amountInWords = numberToWords(Math.round(totalAmount));"""
new_math = """const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.qty) || 0) * (parseFloat(item.rate) || 0), 0);
  const taxAmount = taxRate ? subtotal * (parseFloat(taxRate) / 100) : 0;
  const totalAmount = subtotal + taxAmount;
  const amountInWords = numberToWords(Math.round(totalAmount));"""
qb_c = qb_c.replace(old_math, new_math)

# Fix save payload
qb_c = qb_c.replace('subtotal: totalAmount,', 'subtotal: subtotal,\n         tax_rate: taxRate,\n         tax_amount: taxAmount,')

# Fix tax UI inputs
old_ui_totals = """<div className="text-right">
                   <p className="text-sm text-gray-500">Total Amount</p>
                   <p className="text-2xl font-bold text-navy-700">₹{totalAmount.toLocaleString('en-IN')}</p>
                </div>"""
new_ui_totals = """<div className="flex gap-6 items-end">
                   <div>
                       <label className="text-sm text-gray-500 font-bold block mb-1">GST Tax (%)</label>
                       <input type="number" value={taxRate} onChange={e=>setTaxRate(e.target.value)} placeholder="0" className="w-24 p-2 border rounded outline-none focus:border-blue-500" />
                   </div>
                   <div className="text-right">
                       <p className="text-sm text-gray-500">Subtotal: ₹{subtotal.toLocaleString('en-IN')}</p>
                       {taxAmount > 0 && <p className="text-sm text-gray-500">Tax: ₹{taxAmount.toLocaleString('en-IN')}</p>}
                       <p className="text-2xl font-bold text-navy-700 mt-1">₹{totalAmount.toLocaleString('en-IN')}</p>
                   </div>
                </div>"""
qb_c = qb_c.replace(old_ui_totals, new_ui_totals)

# Fix PDF width and logo
qb_c = qb_c.replace("width: '800px'", "width: '700px'")
qb_c = qb_c.replace('src="/assets/img/quotation/image1.png"', f'src="{logo_src}"')

# Fix PDF table totals row
old_pdf_total = """<tr>
                        <td colSpan="4" style={{ border: '1px solid #000', padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>GRAND TOTAL</td>
                        <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center', fontWeight: 'bold' }}>₹{totalAmount.toLocaleString('en-IN')}</td>
                    </tr>"""
new_pdf_total = """<tr>
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
                    </tr>"""
qb_c = qb_c.replace(old_pdf_total, new_pdf_total)

with open('crm/src/views/admin/crm/components/TabQuotationBuilder.jsx', 'w', encoding='utf-8') as f:
    f.write(qb_c)
