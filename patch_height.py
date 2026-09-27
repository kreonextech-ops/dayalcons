import os

directories = [
    'crm/src/views/admin/crm',
    'crm/src/views/admin/clients',
    'crm/src/views/admin/services',
    'crm/src/views/admin/projects',
    'crm/src/views/admin/tasks',
    'crm/src/views/admin/followups'
]

for d in directories:
    fp = os.path.join(d, 'index.jsx')
    if not os.path.exists(fp): continue
    
    with open(fp, 'r', encoding='utf-8') as f:
        c = f.read()
    
    # Increase the max height so it fits 10 rows comfortably even if text wraps
    c = c.replace('max-h-[600px]', 'max-h-[760px]')
    
    with open(fp, 'w', encoding='utf-8') as f:
        f.write(c)

print("Done")
