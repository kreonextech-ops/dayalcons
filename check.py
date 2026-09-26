import os
import re

files = [
    'crm/src/views/admin/clients/index.jsx',
    'crm/src/views/admin/crm/index.jsx',
    'crm/src/views/admin/services/index.jsx'
]

for f in files:
    with open(f, 'r', encoding='utf-8') as fh:
        content = fh.read()
        
        # Check table height
        table_match = re.search(r'<div className="[^"]*overflow[^"]*"', content)
        if table_match:
            print(f'--- {f} Table Container ---')
            print(table_match.group(0))
        else:
            print(f'--- {f} Table Container NOT FOUND ---')
            
        # Check DESIGN_SERVICES
        services_match = re.search(r'const DESIGN_SERVICES = \[.*?\];', content, re.DOTALL)
        if services_match:
            print(f'--- {f} DESIGN_SERVICES ---')
            print(services_match.group(0)[:300] + '...')
