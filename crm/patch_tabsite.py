filepath = 'crm/src/views/admin/crm/components/TabSiteVisit.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

import re
fixed_span = '''<span className={\px-2 py-1 text-xs font-bold rounded-full \\}>'''
content = re.sub(r'<span className=\{\\px-2 py-1 text-xs font-bold rounded-full \\\\\}>', fixed_span, content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print('Fixed!')
