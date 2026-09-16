import re

files = [
    'crm/src/views/admin/crm/index.jsx',
    'crm/src/views/admin/clients/index.jsx',
    'crm/src/views/admin/services/index.jsx',
    'crm/src/views/admin/projects/index.jsx'
]

replacements = {
    r'bg-\[#F8FAFC\](?! dark:bg-navy-900)': 'bg-[#F8FAFC] dark:bg-navy-900',
    r'text-\[#0F172A\](?! dark:text-white)': 'text-[#0F172A] dark:text-white',
    r'text-\[#475569\](?! dark:text-white)': 'text-[#475569] dark:text-white',
    r'text-\[#64748B\](?! dark:text-gray-400)': 'text-[#64748B] dark:text-gray-400',
    r'border-\[#E2E8F0\](?! dark:border-navy-700)': 'border-[#E2E8F0] dark:border-navy-700',
    r'\bbg-white(?! dark:bg-navy-800)(?!/)(?! \w)': 'bg-white dark:bg-navy-800',  # Avoid bg-white/10
}

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    for pattern, rep in replacements.items():
        content = re.sub(pattern, rep, content)
    
    # Specific fix for the inputs in the toolbar
    # We want the inputs to have dark background and text
    input_fixes = {
        r'bg-white dark:bg-navy-800 cursor-pointer': 'bg-transparent dark:bg-navy-900 cursor-pointer',
        r'bg-gray-100(?! dark:bg-navy-700)': 'bg-gray-100 dark:bg-navy-700',
        r'bg-gray-50(?! dark:bg-navy-900)': 'bg-gray-50 dark:bg-navy-900',
    }
    for pattern, rep in input_fixes.items():
        content = re.sub(pattern, rep, content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print('Done')
