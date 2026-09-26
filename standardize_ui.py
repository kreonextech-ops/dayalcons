import glob
import re

files = [
    'crm/src/views/admin/crm/index.jsx',
    'crm/src/views/admin/clients/index.jsx',
    'crm/src/views/admin/services/index.jsx',
    'crm/src/views/admin/projects/index.jsx',
    'crm/src/views/admin/tasks/index.jsx',
    'crm/src/views/admin/followups/index.jsx',
    'crm/src/views/admin/auditlogs/index.jsx'
]

for filepath in files:
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # 1. Standardize Green Part
        content = re.sub(
            r'\{/\*\s*GREEN PART: STICKY WRAPPER\s*\*/\}\s*<div className="[^"]+"',
            r'{/* GREEN PART: STICKY WRAPPER */}\n          <div className="sticky top-[80px] z-30 bg-[#F8FAFC] dark:bg-navy-900 pt-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 h-[calc(100vh-130px)] flex flex-col pb-2"',
            content
        )

        # 2. Standardize Search Bar wrapper
        content = re.sub(
            r'<div className="flex flex-col lg:flex-row justify-between items-center gap-4">',
            r'<div className="flex flex-row justify-between items-center gap-4 w-full overflow-x-auto pb-1">',
            content
        )
        content = re.sub(
            r'<div className="flex flex-wrap gap-2 w-full lg:w-auto">',
            r'<div className="flex gap-3 flex-nowrap items-center shrink-0">',
            content
        )
        # Also handle any variations like w-full lg:w-[350px]
        content = re.sub(
            r'<div className="relative w-full lg:w-\[350px\]">',
            r'<div className="relative flex-1 min-w-[200px] max-w-[400px]">',
            content
        )

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Patched {filepath}")
    except Exception as e:
        print(f"Skipped {filepath}: {e}")
