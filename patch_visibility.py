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
    
    # Remove clients restriction
    c = re.sub(r'if \(!isAdmin && loggedInUser\?\.id\) \{\s*query = query\.like\(\'assigned_to\', `%[^%]+%`\);\s*\}', '', c)
    
    # Remove services/projects restriction
    c = re.sub(r'if \(!canSeeAllData && loggedInUser\?\.id\) \{\s*query = query\.like\(\'assigned_to\', `%[^%]+%`\);\s*\}', '', c)
    
    with open(fp, 'w', encoding='utf-8') as f:
        f.write(c)

print("Done")
