with open('crm/src/views/admin/crm/components/TabEstimate.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

import re

old_btn_pattern = r'<button onClick=\{\(\) => setShowAddProposal\(true\)\} className="[^"]*">\s*<MdAdd[^>]*/> Add Next Proposal\s*</button>'

new_btn = """<div className="flex gap-2">
             <button onClick={() => setShowBuilder(true)} className="flex items-center gap-2 h-10 px-5 rounded-[10px] bg-[#2563EB] text-white font-bold text-[14px] hover:bg-[#1D4ED8] transition shadow-sm">
               <MdAdd size={20} /> Generate New Quote
             </button>
             <button onClick={() => setShowAddProposal(true)} className="flex items-center gap-2 h-10 px-5 rounded-[10px] bg-[#F1F5F9] text-[#475569] font-bold text-[14px] hover:bg-[#E2E8F0] transition shadow-sm">
               <MdUploadFile size={20} /> Upload PDF
             </button>
           </div>"""

c = re.sub(old_btn_pattern, new_btn, c)

with open('crm/src/views/admin/crm/components/TabEstimate.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
