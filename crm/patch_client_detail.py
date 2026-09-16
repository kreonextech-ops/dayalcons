import re

filepath = 'crm/src/views/admin/clients/ClientDetail.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add Quotations to tabs array
tabs_pattern = r'("Documents"\s*\];)'
content = re.sub(tabs_pattern, r'"Documents", "Quotations"\n    ];', content)

# 2. Add work_types to edit mode
edit_pattern = r'(<div className="flex flex-col"><label className="text-xs text-gray-500">Billing Address</label><input type="text" className="border rounded p-2 text-sm outline-none border-\[\#16A34A\]" value=\{clientData\.address\} onChange=\{e => setClientData\(\{\.\.\.clientData, address: e\.target\.value\}\)\} /></div>)'
edit_replacement = r'\1\n                          <div className="flex flex-col"><label className="text-xs text-gray-500">Work Types</label><input type="text" className="border rounded p-2 text-sm outline-none border-[#16A34A]" value={clientData.work_types || ""} onChange={e => setClientData({...clientData, work_types: e.target.value})} /></div>'
content = re.sub(edit_pattern, edit_replacement, content)

# 3. Add work_types to view mode
view_pattern = r'(<div className="flex flex-col"><span className="text-\[12px\] font-medium text-\[\#64748B\] dark:text-gray-400">Billing Address</span><span className="text-\[14px\] font-semibold text-\[\#0F172A\] dark:text-white">\{clientData\.address \|\| "—"\}</span></div>)'
view_replacement = r'\1\n                          <div className="flex flex-col"><span className="text-[12px] font-medium text-[#64748B] dark:text-gray-400">Work Types / Tags</span><span className="text-[14px] font-semibold text-brand-500">{clientData.work_types || "None"}</span></div>'
content = re.sub(view_pattern, view_replacement, content)

# 4. Add TabQuotations import and tab rendering
import_pattern = r'(import TabDocuments from "\.\./crm/components/TabDocuments";)'
content = re.sub(import_pattern, r'\1\nimport TabQuotations from "./components/TabQuotations";', content)

render_pattern = r'(\{activeTab === "Documents" && \(\s*<TabDocuments clientId=\{clientData\.id\} \/>\s*\)\})'
content = re.sub(render_pattern, r'\1\n            {activeTab === "Quotations" && (\n              <TabQuotations clientId={clientData.id} />\n            )}', content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print('Patched ClientDetail.jsx')
