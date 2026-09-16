import re

files = [
    'crm/src/views/admin/crm/index.jsx',
    'crm/src/views/admin/clients/index.jsx',
    'crm/src/views/admin/services/index.jsx',
    'crm/src/views/admin/projects/index.jsx'
]

replacements = {
    r'bg-white cursor-pointer': 'bg-transparent dark:bg-navy-900 cursor-pointer',
    r'bg-white(?!/)(?! dark:bg-navy-800)': 'bg-white dark:bg-navy-800', # safer catchall
    r'bg-white dark:bg-navy-800 dark:bg-navy-800': 'bg-white dark:bg-navy-800', # dedup
    r'hover:bg-gray-50 dark:bg-navy-900': 'hover:bg-gray-50 dark:hover:bg-navy-800',
    r'hover:bg-gray-50(?! dark:hover:bg-navy-800)': 'hover:bg-gray-50 dark:hover:bg-navy-800',
    r'bg-gray-100(?! dark:bg-navy-700)': 'bg-gray-100 dark:bg-navy-700',
    r'bg-[#F8FAFC](?! dark:bg-navy-900)': 'bg-[#F8FAFC] dark:bg-navy-900',
    r'bg-\[\#F8FAFC\] dark:bg-navy-900 dark:bg-navy-900': 'bg-[#F8FAFC] dark:bg-navy-900', # dedup
    r'border-b border-[#E2E8F0](?! dark:border-navy-700)': 'border-b border-[#E2E8F0] dark:border-navy-700',
    r'text-gray-700(?! dark:text-gray-200)': 'text-gray-700 dark:text-gray-200',
    r'text-\[\#0F172A\](?! dark:text-white)': 'text-[#0F172A] dark:text-white',
    r'text-\[\#475569\](?! dark:text-gray-200)': 'text-[#475569] dark:text-gray-200',
    r'text-\[\#475569\] dark:text-white': 'text-[#475569] dark:text-gray-200', # fix earlier patch
}

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    for pattern, rep in replacements.items():
        content = re.sub(pattern, rep, content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print('Done')
