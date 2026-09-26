import os

filepath = 'crm/src/views/admin/crm/LeadDetail.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("split(\\'T\\')", "split('T')")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Slashes fixed")
