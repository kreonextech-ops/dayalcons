import re

filepath = 'crm/src/views/admin/projects/index.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

old_logic = """                     if (filterType) {
                        filtered = filtered.filter(p => p.description && p.description.includes(filterType));
                     }"""

new_logic = """                     if (filterType) {
                        const typeLower = filterType.toLowerCase();
                        filtered = filtered.filter(p => 
                           (p.description && p.description.toLowerCase().includes(typeLower)) ||
                           (p.name && p.name.toLowerCase().includes(typeLower))
                        );
                     }"""

if 'const typeLower = filterType.toLowerCase();' not in content:
    content = content.replace(old_logic, new_logic)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Patched successfully")
else:
    print("Already patched")
