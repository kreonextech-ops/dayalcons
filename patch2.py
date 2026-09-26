import os

filepath = 'crm/src/views/admin/crm/index.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'className="sticky top-[80px] z-30 bg-[#F8FAFC] dark:bg-navy-900 pt-4 -mx-4 px-4',
    'className="sticky top-[80px] z-30 bg-[#F8FAFC] dark:bg-navy-900 pt-1 -mx-4 px-4'
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Done")
