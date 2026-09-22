import os

filepath = 'crm/src/views/admin/crm/components/TabServiceRequirement.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target_props = "const TabServiceRequirement = ({ leadData, setLeadData }) => {"
new_props = "const TabServiceRequirement = ({ leadData, setLeadData, handleSaveToDB }) => {"
content = content.replace(target_props, new_props)

target_btn = """               <button onClick={() => setIsEditing(false)} className="h-10 px-6 rounded-[12px] bg-[#16A34A] text-white text-[14px] font-bold flex items-center gap-2 hover:bg-[#15803D] transition shadow-md">
                 <MdSave /> Save
               </button>"""

new_btn = """               <button onClick={async () => {
                 setIsEditing(false);
                 if (handleSaveToDB) await handleSaveToDB();
               }} className="h-10 px-6 rounded-[12px] bg-[#16A34A] text-white text-[14px] font-bold flex items-center gap-2 hover:bg-[#15803D] transition shadow-md">
                 <MdSave /> Save
               </button>"""
content = content.replace(target_btn, new_btn)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Patched TabServiceRequirement.jsx")
