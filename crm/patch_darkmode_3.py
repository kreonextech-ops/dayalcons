import re

files = [
    'crm/src/views/admin/crm/index.jsx',
    'crm/src/views/admin/clients/index.jsx',
    'crm/src/views/admin/services/index.jsx',
    'crm/src/views/admin/projects/index.jsx'
]

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    content = content.replace('dark:text-gray-200 dark:text-white', 'dark:text-white')
    content = content.replace('dark:bg-navy-800 cursor-pointer bg-white dark:bg-navy-800', 'bg-transparent dark:bg-navy-900 cursor-pointer')
    content = content.replace('bg-white cursor-pointer', 'bg-transparent dark:bg-navy-900 cursor-pointer')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print('Done')
