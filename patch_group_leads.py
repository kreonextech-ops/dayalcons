import os

filepath = 'crm/src/views/admin/crm/index.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target = """         // Merge with localStorage
         const merged = data.map(lead => {
            const localData = JSON.parse(localStorage.getItem(`lead_${lead.id}`) || "{}");
            return { ...lead, ...localData };
         });
         setLeads(merged);"""

replacement = """         // Merge with localStorage
         const merged = data.map(lead => {
            const localData = JSON.parse(localStorage.getItem(`lead_${lead.id}`) || "{}");
            return { ...lead, ...localData };
         });
         
         // Group duplicates by phone number
         const groupedMap = {};
         const finalLeads = [];
         merged.forEach(lead => {
            if (!lead.phone || lead.phone.trim() === "") {
               finalLeads.push(lead);
            } else {
               const phoneStr = lead.phone.trim();
               if (groupedMap[phoneStr]) {
                  const primary = groupedMap[phoneStr];
                  if (!primary.duplicate_history) primary.duplicate_history = [];
                  primary.duplicate_history.push(lead);
               } else {
                  groupedMap[phoneStr] = lead;
                  finalLeads.push(lead);
               }
            }
         });
         
         setLeads(finalLeads);"""

if target in content:
    content = content.replace(target, replacement)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Grouped leads successfully.")
else:
    print("Target not found in crm index.jsx")
