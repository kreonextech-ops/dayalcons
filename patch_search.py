import re
with open('crm/src/views/admin/assignments/index.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = '''         let table = 'leads';
         if (assignType === 'Client') table = 'clients';
         if (assignType === 'Consultancy Service') table = 'services';
         if (assignType === 'Construction Project') table = 'projects';

         const { data } = await supabase.from(table).select('id, name, title');
         if (data) setAvailableRecords(data.map(d => ({ id: d.id, name: d.title || d.name })));'''

replacement = '''         let table = 'leads';
         let cols = 'id, name, phone';
         if (assignType === 'Client') { table = 'clients'; cols = 'id, name'; }
         if (assignType === 'Consultancy Service') { table = 'services'; cols = 'id, title'; }
         if (assignType === 'Construction Project') { table = 'projects'; cols = 'id, title, name'; }

         const { data, error } = await supabase.from(table).select(cols);
         if (data) {
             setAvailableRecords(data.map(d => ({ 
                 id: d.id, 
                 name: (d.title || d.name || '') + (d.phone ?  -  : '') 
             })));
         } else {
             console.error("Fetch error:", error);
         }'''

if target in content:
    content = content.replace(target, replacement)
    with open('crm/src/views/admin/assignments/index.jsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Patched successfully")
else:
    print("Target not found")
