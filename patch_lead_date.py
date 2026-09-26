import os
import re

filepath = 'crm/src/views/admin/crm/LeadDetail.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Normalize line endings
content = content.replace('\r\n', '\n')

search_editing = """                          <div className="flex flex-col"><label className="text-xs text-gray-500">Source</label>"""
new_editing = """                          <div className="flex flex-col"><label className="text-xs text-gray-500">Arriving Date</label><input type="date" className="border rounded p-1 text-sm outline-none border-[#2563EB]" value={leadData.created_at ? new Date(leadData.created_at).toISOString().split('T')[0] : ""} onChange={e => setLeadData({...leadData, created_at: e.target.value})} /></div>
                          <div className="flex flex-col"><label className="text-xs text-gray-500">Source</label>"""

content = content.replace(search_editing, new_editing)

search_view = """                          <div className="flex flex-col"><span className="text-[12px] font-medium text-[#64748B] dark:text-gray-400">Source</span>"""
new_view = """                          <div className="flex flex-col"><span className="text-[12px] font-medium text-[#64748B] dark:text-gray-400">Arriving Date</span><span className="text-[14px] font-semibold text-[#0F172A] dark:text-white">{leadData.created_at ? new Date(leadData.created_at).toLocaleDateString('en-GB') : "N/A"}</span></div>
                          <div className="flex flex-col"><span className="text-[12px] font-medium text-[#64748B] dark:text-gray-400">Source</span>"""

content = content.replace(search_view, new_view)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("LeadDetail date patched")
