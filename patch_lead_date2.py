import os
import re

filepath = 'crm/src/views/admin/crm/LeadDetail.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Normalize line endings
content = content.replace('\r\n', '\n')

pattern_editing = re.compile(r'([ \t]*<div className="flex flex-col"><label className="text-xs text-gray-500">Source<\/label>)')
replacement_editing = r'                          <div className="flex flex-col"><label className="text-xs text-gray-500">Arriving Date</label><input type="date" className="border rounded p-1 text-sm outline-none border-[#2563EB]" value={leadData.created_at ? new Date(leadData.created_at).toISOString().split(\'T\')[0] : ""} onChange={e => setLeadData({...leadData, created_at: e.target.value})} /></div>\n\1'

# We don't need to replace the view one since it's mapped from an array!
# Wait, look at LeadDetail view:
#                           ].map((item, i) => (
# It's an array of `{ label: "...", val: "..." }`
# I saw `{ label: "Arriving Date", val: leadData.created_at ... }` in the array! So I don't need to change the view part, only the edit form!

content = re.sub(pattern_editing, replacement_editing, content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("LeadDetail date patched again")
