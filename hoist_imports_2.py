import sys
import re

files_to_fix = [
    'crm/src/views/admin/crm/index.jsx',
    'crm/src/views/admin/clients/index.jsx'
]

for filepath in files_to_fix:
    with open(filepath, 'r') as f:
        content = f.read()

    imports = []
    # Match standard imports like import X from 'Y'; and multiline import { ... } from 'Y';
    pattern = re.compile(r'^import\s+.*?from\s+[\'"].*?[\'"];?', re.MULTILINE | re.DOTALL)
    
    pos = 0
    while True:
        match = pattern.search(content, pos)
        if not match:
            break
        imports.append(match.group(0))
        pos = match.end()

    # Now remove all imports from content
    content_no_imports = pattern.sub('', content)

    # Prepend imports to the top
    final_content = '\n'.join(imports) + '\n\n' + content_no_imports

    with open(filepath, 'w') as f:
        f.write(final_content)

print("Hoisted imports properly")
