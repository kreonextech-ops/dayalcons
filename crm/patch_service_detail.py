import re

filepath = 'crm/src/views/admin/services/ServiceDetail.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add "Legal Details" to tabs array
tabs_pattern = r'("Payments",)'
content = re.sub(tabs_pattern, r'\1 "Legal Details",', content)

# 2. Add TabLegal import and rendering
import_pattern = r'(import TabPayments from "\./components/TabPayments";)'
content = re.sub(import_pattern, r'\1\nimport TabLegal from "./components/TabLegal";', content)

render_pattern = r'(\{activeTab === "Payments" && <TabPayments service=\{serviceData\} \/>\})'
content = re.sub(render_pattern, r'\1\n            {activeTab === "Legal Details" && <TabLegal service={serviceData} />}', content)

# 3. Add to Overview view (Next to Service Title)
# Look for Service Title label in Overview
view_pattern = r'(<span className="text-\[12px\] font-medium text-\[\#64748B\] dark:text-gray-400">Target Date</span><span className="text-\[14px\] font-semibold text-\[\#0F172A\] dark:text-white">\{serviceData\.target_date \|\| "—"\}</span></div>)'
view_replacement = r'\1\n                     <div className="flex flex-col"><span className="text-[12px] font-medium text-[#64748B] dark:text-gray-400">Service Sub-Type</span><span className="text-[14px] font-semibold text-brand-500">{serviceData.service_sub_type || "—"}</span></div>'
content = re.sub(view_pattern, view_replacement, content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print('Patched ServiceDetail.jsx')
