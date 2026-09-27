import os
import re

views = [
    'crm/src/views/admin/crm/index.jsx',
    'crm/src/views/admin/clients/index.jsx',
    'crm/src/views/admin/services/index.jsx',
    'crm/src/views/admin/projects/index.jsx',
    'crm/src/views/admin/tasks/index.jsx',
    'crm/src/views/admin/followups/index.jsx',
]

for v in views:
    if os.path.exists(v):
        with open(v, 'r', encoding='utf-8') as f:
            content = f.read()
            matches = re.finditer(r'<input[^>]*placeholder=[\'"].*?Search.*?[\'"][^>]*>', content, re.IGNORECASE)
            for m in matches:
                tag = m.group(0)
                if 'onChange' not in tag and 'ref=' not in tag:
                    print('Missing onChange in', v, '\n', tag, '\n')
