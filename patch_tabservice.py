import os

filepath = 'crm/src/views/admin/crm/components/TabServiceRequirement.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove isEditing state
content = content.replace('const [isEditing, setIsEditing] = useState(false);\n', '')

# Replace buttons
btn_old = """        <div className="mt-4 md:mt-0 flex gap-3">
          {isEditing ? (
             <button onClick={() => setIsEditing(false)} className="h-10 px-6 rounded-[12px] bg-[#16A34A] text-white text-[14px] font-bold flex items-center gap-2 hover:bg-[#15803D] transition shadow-md">
               <MdSave /> Save
             </button>
          ) : (
             <button onClick={() => setIsEditing(true)} className="h-10 px-6 rounded-[12px] border border-[#E2E8F0] bg-white text-[#0F172A] text-[14px] font-bold flex items-center gap-2 hover:bg-gray-50 transition">
               <MdEdit /> Edit Form
             </button>
          )}
        </div>"""
btn_new = """        <div className="mt-4 md:mt-0 flex gap-3">
             <button onClick={() => { if(handleSaveToDB) handleSaveToDB(); }} className="h-10 px-6 rounded-[12px] bg-[#2563EB] text-white text-[14px] font-bold flex items-center gap-2 hover:bg-[#1D4ED8] transition shadow-md">
               <MdSave /> Save Requirements
             </button>
        </div>"""
content = content.replace(btn_old, btn_new)

# Remove editing badge
badge_old = """{isEditing && <span className="text-[12px] font-bold text-[#2563EB] bg-blue-50 px-3 py-1 rounded-full">Editing Mode</span>}"""
content = content.replace(badge_old, '')

# Replace Grid blocks (isEditing ? ... : ...)
grid_old = """          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isEditing ? (
             <>
               <div className="flex flex-col"><label className="text-[12px] font-medium text-[#64748B] mb-1">Project Priority</label><input type="text" placeholder="e.g. High" className="h-10 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none focus:border-[#2563EB]" value={leadData.priority || ''} onChange={e => setLeadData({...leadData, priority: e.target.value})} /></div>
               <div className="flex flex-col"><label className="text-[12px] font-medium text-[#64748B] mb-1">Expected Start</label><input type="text" placeholder="e.g. Within 1 month" className="h-10 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none focus:border-[#2563EB]" value={leadData.expectedStart || ''} onChange={e => setLeadData({...leadData, expectedStart: e.target.value})} /></div>
               <div className="flex flex-col"><label className="text-[12px] font-medium text-[#64748B] mb-1">Budget</label><input type="text" placeholder="e.g. ₹50 Lakhs" className="h-10 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none focus:border-[#2563EB]" value={leadData.budget || ''} onChange={e => setLeadData({...leadData, budget: e.target.value})} /></div>
               <div className="flex flex-col"><label className="text-[12px] font-medium text-[#64748B] mb-1">Timeline</label><input type="text" placeholder="e.g. 6 Months" className="h-10 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none focus:border-[#2563EB]" value={leadData.timeline || ''} onChange={e => setLeadData({...leadData, timeline: e.target.value})} /></div>
               <div className="flex flex-col"><label className="text-[12px] font-medium text-[#64748B] mb-1">Preferred Communication</label><input type="text" placeholder="e.g. WhatsApp" className="h-10 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none focus:border-[#2563EB]" value={leadData.preferredComm || ''} onChange={e => setLeadData({...leadData, preferredComm: e.target.value})} /></div>
               <div className="flex flex-col"><label className="text-[12px] font-medium text-[#64748B] mb-1">Decision Maker</label><input type="text" placeholder="e.g. Self" className="h-10 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none focus:border-[#2563EB]" value={leadData.decisionMaker || ''} onChange={e => setLeadData({...leadData, decisionMaker: e.target.value})} /></div>
             </>
          ) : (
             <>
               <div className="flex flex-col"><span className="text-[12px] font-medium text-[#64748B]">Project Priority</span><span className="text-[15px] font-bold text-[#0F172A]">{leadData.priority || '—'}</span></div>
               <div className="flex flex-col"><span className="text-[12px] font-medium text-[#64748B]">Expected Start</span><span className="text-[15px] font-bold text-[#0F172A]">{leadData.expectedStart || '—'}</span></div>
               <div className="flex flex-col"><span className="text-[12px] font-medium text-[#64748B]">Budget</span><span className="text-[15px] font-bold text-[#0F172A]">{leadData.budget || '—'}</span></div>
               <div className="flex flex-col"><span className="text-[12px] font-medium text-[#64748B]">Timeline</span><span className="text-[15px] font-bold text-[#0F172A]">{leadData.timeline || '—'}</span></div>
               <div className="flex flex-col"><span className="text-[12px] font-medium text-[#64748B]">Preferred Communication</span><span className="text-[15px] font-bold text-[#0F172A]">{leadData.preferredComm || '—'}</span></div>
               <div className="flex flex-col"><span className="text-[12px] font-medium text-[#64748B]">Decision Maker</span><span className="text-[15px] font-bold text-[#0F172A]">{leadData.decisionMaker || '—'}</span></div>
             </>
          )}
        </div>"""

grid_new = """          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               <div className="flex flex-col"><label className="text-[12px] font-medium text-[#64748B] mb-1">Project Priority</label><input type="text" placeholder="e.g. High" className="h-10 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none focus:border-[#2563EB]" value={leadData.priority || ''} onChange={e => setLeadData({...leadData, priority: e.target.value})} /></div>
               <div className="flex flex-col"><label className="text-[12px] font-medium text-[#64748B] mb-1">Expected Start</label><input type="text" placeholder="e.g. Within 1 month" className="h-10 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none focus:border-[#2563EB]" value={leadData.expectedStart || ''} onChange={e => setLeadData({...leadData, expectedStart: e.target.value})} /></div>
               <div className="flex flex-col"><label className="text-[12px] font-medium text-[#64748B] mb-1">Budget</label><input type="text" placeholder="e.g. ₹50 Lakhs" className="h-10 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none focus:border-[#2563EB]" value={leadData.budget || ''} onChange={e => setLeadData({...leadData, budget: e.target.value})} /></div>
               <div className="flex flex-col"><label className="text-[12px] font-medium text-[#64748B] mb-1">Timeline</label><input type="text" placeholder="e.g. 6 Months" className="h-10 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none focus:border-[#2563EB]" value={leadData.timeline || ''} onChange={e => setLeadData({...leadData, timeline: e.target.value})} /></div>
               <div className="flex flex-col"><label className="text-[12px] font-medium text-[#64748B] mb-1">Preferred Communication</label><input type="text" placeholder="e.g. WhatsApp" className="h-10 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none focus:border-[#2563EB]" value={leadData.preferredComm || ''} onChange={e => setLeadData({...leadData, preferredComm: e.target.value})} /></div>
               <div className="flex flex-col"><label className="text-[12px] font-medium text-[#64748B] mb-1">Decision Maker</label><input type="text" placeholder="e.g. Self" className="h-10 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none focus:border-[#2563EB]" value={leadData.decisionMaker || ''} onChange={e => setLeadData({...leadData, decisionMaker: e.target.value})} /></div>
          </div>"""

# Ensure line endings match before replace
content = content.replace('\r\n', '\n')
grid_old = grid_old.replace('\r\n', '\n')

content = content.replace(grid_old, grid_new)

# Replace textarea block
text_old = """          {isEditing ? (
             <textarea 
               placeholder="Enter detailed client requirements..." 
               className="w-full rounded-[10px] border border-[#E2E8F0] p-4 text-[14px] outline-none focus:border-[#2563EB]"
               rows="4"
               value={leadData.serviceNotes || ''}
               onChange={e => setLeadData({...leadData, serviceNotes: e.target.value})}
             ></textarea>
          ) : (
             <div className="w-full rounded-[10px] bg-[#F8FAFC] p-4 text-[14px] text-[#475569] min-h-[100px] border border-[#E2E8F0]">
               {leadData.serviceNotes || 'No notes provided.'}
             </div>
          )}"""
text_new = """             <textarea 
               placeholder="Enter detailed client requirements..." 
               className="w-full rounded-[10px] border border-[#E2E8F0] p-4 text-[14px] outline-none focus:border-[#2563EB]"
               rows="4"
               value={leadData.serviceNotes || ''}
               onChange={e => setLeadData({...leadData, serviceNotes: e.target.value})}
             ></textarea>"""
content = content.replace(text_old, text_new)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("TabServiceRequirement patched")
