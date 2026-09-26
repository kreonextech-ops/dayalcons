import os
import re

filepath = 'crm/src/views/admin/crm/components/TabServiceRequirement.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('MdArchitecture, MdBusiness, MdCheck, MdSave, MdEdit,', 'MdArchitecture, MdBusiness, MdCheck, MdSave,')
content = content.replace('MdEdit, ', '')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("MdEdit removed")
