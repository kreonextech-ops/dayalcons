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
    
    # 1. Remove min-h-screen and massive pb
    c = c.replace('min-h-screen pt-4 pb-24', 'h-auto pt-4 pb-8')
    c = c.replace('min-h-[100vh] pt-4 pb-24', 'h-auto pt-4 pb-8')
    c = c.replace('min-h-screen', 'h-auto')
    
    # 2. Remove min-h-[700px] and sticky wrappers
    c = re.sub(r'min-h-\[700px\]\s+flex\s+flex-col', 'block', c)
    c = re.sub(r'min-h-\[800px\]\s+flex\s+flex-col', 'block', c)
    
    # 3. Fix the Table Card container
    c = c.replace('Card extra="flex-1 flex flex-col min-h-0', 'Card extra="flex flex-col')
    
    # 4. Fix table overflow wrapper
    c = c.replace('<div className="flex-1 overflow-auto w-full">', '<div className="overflow-auto w-full max-h-[600px] custom-scrollbar">')
    
    # 5. Remove pagination slicing logic
    c = re.sub(r'const\s+paginated\s*=\s*filtered\.slice\([^)]+\);', 'const paginated = filtered;', c)
    c = re.sub(r'const\s+paginated\s*=\s*clients\.slice\([^)]+\);', 'const paginated = filtered;', c)
    c = re.sub(r'const\s+paginated\s*=\s*leads\.slice\([^)]+\);', 'const paginated = filtered;', c)
    
    # 6. Remove Pagination Footer visually
    # Find {/* Pagination */} to </Card>
    c = re.sub(r'\{\/\*\s*Pagination\s*\*\/\}.*?<\/div>\s*<\/Card>', '</Card>', c, flags=re.DOTALL)
    
    with open(fp, 'w', encoding='utf-8') as f:
        f.write(c)

print("Done")
