import os
import re

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
    
    # 1. Remove mb-X on the KPI grid
    c = re.sub(r'className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2-4] gap-4 mb-[46]"', 'className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-1"', c)
    c = re.sub(r'className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2-4] gap-4 mb-[46] 3xl:grid-cols-4"', 'className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-1 3xl:grid-cols-4"', c)
    
    # Actually just match any `gap-4 mb-\d`
    c = re.sub(r'gap-4 mb-\d', 'gap-4 mb-1', c)
    
    # 2. Remove pt-2 from the sticky wrapper
    c = c.replace('sticky top-[60px] z-30 bg-[#F8FAFC] dark:bg-navy-900 pt-2', 'sticky top-[60px] z-30 bg-[#F8FAFC] dark:bg-navy-900 pt-0')
    
    with open(fp, 'w', encoding='utf-8') as f:
        f.write(c)

print("Done")
