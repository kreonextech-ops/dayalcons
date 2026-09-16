import re

files = [
    'crm/src/views/admin/default/index.jsx'
]

replacements = {
    r'text-\[\#0F172A\](?! dark:text-white)': 'text-[#0F172A] dark:text-white',
    r'text-\[\#64748B\](?! dark:text-gray-400)': 'text-[#64748B] dark:text-gray-400',
}

import os
for filepath in files:
    if not os.path.exists(filepath): continue
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    for pattern, rep in replacements.items():
        content = re.sub(pattern, rep, content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print('Done')
