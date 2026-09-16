import sys
import re

files_to_fix = [
    'crm/src/views/admin/crm/index.jsx',
    'crm/src/views/admin/clients/index.jsx'
]

for filepath in files_to_fix:
    with open(filepath, 'r') as f:
        lines = f.readlines()
    
    imports = []
    other = []
    
    for line in lines:
        if line.startswith('import '):
            imports.append(line)
        else:
            other.append(line)
            
    with open(filepath, 'w') as f:
        f.writelines(imports + ['\n'] + other)

print("Hoisted imports")
