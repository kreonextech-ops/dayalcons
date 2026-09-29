import re

with open('crm/src/views/admin/crm/components/TabEstimate.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Add import
c = c.replace('import { uploadFileToR2, getR2FileUrl, deleteR2File } from "utils/r2Storage";', 'import { uploadFileToR2, getR2FileUrl, deleteR2File } from "utils/r2Storage";\nimport TabQuotationBuilder from "./TabQuotationBuilder";')

# Add state
c = c.replace('const [showAddProposal, setShowAddProposal] = useState(false);', 'const [showAddProposal, setShowAddProposal] = useState(false);\n  const [showBuilder, setShowBuilder] = useState(false);')

# Replace button
old_btn = """<button onClick={() => setShowAddProposal(true)} className="flex items-center gap-2 h-10 px-5 rounded-[10px] bg-[#2563EB] text-white font-bold text-[14px] hover:bg-blue-700 transition">
             <MdAdd className="text-lg"/> Add Next Proposal
           </button>"""
new_btn = """<div className="flex gap-2">
             <button onClick={() => setShowBuilder(true)} className="flex items-center gap-2 h-10 px-5 rounded-[10px] bg-[#2563EB] text-white font-bold text-[14px] hover:bg-blue-700 transition">
               <MdAdd className="text-lg"/> Generate New Quote
             </button>
             <button onClick={() => setShowAddProposal(true)} className="flex items-center gap-2 h-10 px-5 rounded-[10px] bg-[#F1F5F9] text-[#475569] font-bold text-[14px] hover:bg-[#E2E8F0] transition">
               <MdUploadFile className="text-lg"/> Upload PDF
             </button>
           </div>"""
c = c.replace(old_btn, new_btn)

# Add Builder Modal at the bottom
builder_modal = """
      {/* Quotation Builder Full Screen Modal */}
      {showBuilder && (
         <div className="fixed inset-0 z-[100] bg-gray-100 dark:bg-navy-900 overflow-y-auto">
             <div className="max-w-7xl mx-auto py-8 px-4 relative">
                 <button onClick={() => setShowBuilder(false)} className="absolute top-4 right-4 bg-white p-2 rounded-full shadow hover:bg-gray-50 text-gray-600">
                     <MdClose size={24} />
                 </button>
                 <TabQuotationBuilder leadData={leadData} isClient={isClient} />
             </div>
         </div>
      )}
"""
c = c.replace('return (', 'return (\n    <div className="relative">\n' + builder_modal)
c = c.replace('</Card>\n      </div>', '</Card>\n      </div>\n    </div>')
# Actually let's just append it before the final </div> if we can safely target it.
# Instead of doing that complex replace, let's target the very end of the component.
c = re.sub(r'(</Card>\s*</div>\s*\)\s*;\s*};)', builder_modal + r'\1', c)

with open('crm/src/views/admin/crm/components/TabEstimate.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
