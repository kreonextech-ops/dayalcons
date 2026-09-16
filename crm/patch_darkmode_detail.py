import re

files = [
    'crm/src/views/admin/crm/LeadDetail.jsx',
    'crm/src/views/admin/clients/ClientDetail.jsx',
    'crm/src/views/admin/services/ServiceDetail.jsx',
    'crm/src/views/admin/projects/ProjectDetail.jsx',
    'crm/src/views/admin/projects/components/TabOverview.jsx',
    'crm/src/views/admin/services/components/TabOverview.jsx',
    'crm/src/views/admin/tasks/index.jsx',
    'crm/src/views/admin/tasks/TaskDetail.jsx'
]

replacements = {
    r'bg-white cursor-pointer': 'bg-transparent dark:bg-navy-900 cursor-pointer',
    r'bg-white(?!/)(?! dark:bg-navy-800)': 'bg-white dark:bg-navy-800', 
    r'bg-white dark:bg-navy-800 dark:bg-navy-800': 'bg-white dark:bg-navy-800', 
    r'hover:bg-gray-50 dark:bg-navy-900': 'hover:bg-gray-50 dark:hover:bg-navy-800',
    r'hover:bg-gray-50(?! dark:hover:bg-navy-800)': 'hover:bg-gray-50 dark:hover:bg-navy-800',
    r'bg-gray-100(?! dark:bg-navy-700)': 'bg-gray-100 dark:bg-navy-700',
    r'bg-\[\#F8FAFC\](?! dark:bg-navy-900)': 'bg-[#F8FAFC] dark:bg-navy-900',
    r'bg-\[\#F8FAFC\] dark:bg-navy-900 dark:bg-navy-900': 'bg-[#F8FAFC] dark:bg-navy-900', 
    r'border-\[\#E2E8F0\](?! dark:border-navy-700)': 'border-[#E2E8F0] dark:border-navy-700',
    r'text-gray-700(?! dark:text-gray-200)': 'text-gray-700 dark:text-gray-200',
    r'text-\[\#0F172A\](?! dark:text-white)': 'text-[#0F172A] dark:text-white',
    r'text-\[\#475569\](?! dark:text-gray-200)(?! dark:text-white)': 'text-[#475569] dark:text-gray-200',
    r'text-\[\#64748B\](?! dark:text-gray-400)': 'text-[#64748B] dark:text-gray-400',
}

import os
for filepath in files:
    if not os.path.exists(filepath): continue
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    for pattern, rep in replacements.items():
        content = re.sub(pattern, rep, content)

    # Cleanup any weird doubles if they happen
    content = content.replace('dark:text-gray-200 dark:text-white', 'dark:text-white')
    content = content.replace('dark:bg-navy-800 cursor-pointer bg-white dark:bg-navy-800', 'bg-transparent dark:bg-navy-900 cursor-pointer')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print('Done')
