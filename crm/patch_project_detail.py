import re

filepath = 'crm/src/views/admin/projects/ProjectDetail.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

view_pattern = r'(<span className="text-\[12px\] font-medium text-\[\#64748B\] dark:text-gray-400">Current \nStatus</span>)'
view_replacement = r'<div className="flex flex-col"><span className="text-[12px] font-medium text-[#64748B] dark:text-gray-400">Signature of Payee</span><span className="text-[14px] font-semibold text-[#0F172A] dark:text-white">{projData.signature_of_payee || "—"}</span></div>\n                       <div className="flex flex-col"><span className="text-[12px] font-medium text-[#64748B] dark:text-gray-400">Progress Details</span><span className="text-[14px] font-semibold text-[#0F172A] dark:text-white">{projData.progress_details || "—"}</span></div>\n                       \1'

# We need to find the correct string since it breaks on lines
view_pattern = r'(<div className="flex flex-col">\s*<span className="text-\[12px\] font-medium text-\[\#64748B\] dark:text-gray-400">Current \nStatus</span>)'
view_replacement = r'<div className="flex flex-col"><span className="text-[12px] font-medium text-[#64748B] dark:text-gray-400">Signature of Payee</span><span className="text-[14px] font-semibold text-[#0F172A] dark:text-white">{projData.signature_of_payee || "—"}</span></div>\n                       <div className="flex flex-col"><span className="text-[12px] font-medium text-[#64748B] dark:text-gray-400">Progress Details</span><span className="text-[14px] font-semibold text-[#0F172A] dark:text-white">{projData.progress_details || "—"}</span></div>\n                       \1'
content = re.sub(view_pattern, view_replacement, content)

# Try simpler replacement if regex fails
if 'Signature of Payee' not in content:
    content = content.replace(
        '<span className="text-[12px] font-medium text-[#64748B] dark:text-gray-400">Current \nStatus</span>',
        '</div><div className="flex flex-col"><span className="text-[12px] font-medium text-[#64748B] dark:text-gray-400">Signature of Payee</span><span className="text-[14px] font-semibold text-[#0F172A] dark:text-white">{projData.signature_of_payee || "—"}</span></div>\n<div className="flex flex-col"><span className="text-[12px] font-medium text-[#64748B] dark:text-gray-400">Progress Details</span><span className="text-[14px] font-semibold text-[#0F172A] dark:text-white">{projData.progress_details || "—"}</span></div>\n<div className="flex flex-col"><span className="text-[12px] font-medium text-[#64748B] dark:text-gray-400">Current Status</span>'
    )

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print('Patched ProjectDetail.jsx')
