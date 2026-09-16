import re

filepath = 'crm/src/views/admin/clients/index.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add work_types to state
content = content.replace(
    'name: "", phone: "", email: "", address: "", company: "", gst: "", source: ""',
    'name: "", phone: "", email: "", address: "", company: "", gst: "", source: "", work_types: ""'
)
content = content.replace(
    'setNewClient({ name: "", phone: "", email: "", address: "", company: "", gst: "" });',
    'setNewClient({ name: "", phone: "", email: "", address: "", company: "", gst: "", source: "", work_types: "" });'
)

# 2. Add work_types to Supabase Insert
insert_pattern = r"name: newClient\.name,\n\s*status: 'active'\n\s*\}\]\)\.select\(\);"
insert_replacement = "name: newClient.name,\n        status: 'active',\n        work_types: newClient.work_types\n      }]).select();"
content = re.sub(insert_pattern, insert_replacement, content)

# 3. Add work_types input field to Modal Form
form_field = '''<div>
                  <label className="block text-[12px] font-bold text-[#475569] dark:text-gray-200 dark:text-white mb-1.5 uppercase tracking-wide">Work Types</label>
                  <input value={newClient.work_types} onChange={e=>setNewClient({...newClient, work_types: e.target.value})} type="text" placeholder="e.g., L.U.C.C, Building Plan" className="w-full h-11 px-3 rounded-[10px] border border-[#E2E8F0] dark:border-navy-700 text-[14px] text-[#0F172A] dark:text-white outline-none focus:border-[#2563EB] transition-colors bg-transparent dark:bg-navy-900" />
                </div>'''

content = content.replace(
    'placeholder="Enter tax ID"',
    'placeholder="Enter tax ID"'
)
# insert after gst field
gst_div = r'(<div>\s*<label[^>]*>GST / PAN \(Tax ID\)</label>\s*<input[^>]*value=\{newClient\.gst\}[^>]*>\s*</div>)'
content = re.sub(gst_div, r'\1\n                ' + form_field, content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print('Patched clients index.jsx')
