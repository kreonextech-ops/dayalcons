import sys
import re

files_to_patch = [
    'crm/src/views/admin/services/ServiceDetail.jsx',
    'crm/src/views/admin/projects/ProjectDetail.jsx'
]

old_isadmin = "const isAdmin = loggedInUser?.role === 'Admin' || loggedInUser?.role === 'CRO';"
new_isadmin = "const isAdmin = loggedInUser?.role === 'Admin' || (loggedInUser?.role && loggedInUser.role.toUpperCase() === 'CRO') || (loggedInUser?.designation && loggedInUser.designation.toUpperCase().includes('CRO'));"

for file in files_to_patch:
    with open(file, 'r') as f:
        content = f.read()
    
    if old_isadmin in content:
        content = content.replace(old_isadmin, new_isadmin)
    else:
        # Fallback regex just in case
        content = re.sub(r"const isAdmin = loggedInUser\?\.role === 'Admin'.*?;", new_isadmin, content)
        
    with open(file, 'w') as f:
        f.write(content)

print("Patched isAdmin for CRO in detail pages")
