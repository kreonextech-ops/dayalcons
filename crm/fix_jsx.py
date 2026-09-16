import os

filepath_1 = 'crm/src/views/admin/clients/components/TabQuotations.jsx'
with open(filepath_1, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'className={\px-2 py-1 text-xs font-bold rounded-full \\}',
    'className={px-2 py-1 text-xs font-bold rounded-full }'
)
with open(filepath_1, 'w', encoding='utf-8') as f:
    f.write(content)

filepath_2 = 'crm/src/views/admin/site-visits/index.jsx'
with open(filepath_2, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'className={\px-2 py-1 text-xs font-bold rounded-full \\}',
    'className={px-2 py-1 text-xs font-bold rounded-full }'
)
with open(filepath_2, 'w', encoding='utf-8') as f:
    f.write(content)

print('Done fixing JSX')
