import os, re

filepath = 'crm/src/views/admin/crm/index.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

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

content = re.sub(r'         // Merge with localStorage\s*const merged = data\.map\(lead => \{\s*const localData = JSON\.parse\(localStorage\.getItem\(`lead_\$\{lead\.id\}`\) \|\| "\{\}"\);\s*return \{ \.\.\.lead, \.\.\.localData \};\s*\}\);\s*setLeads\(merged\);', replacement, content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Regex patch applied.")
