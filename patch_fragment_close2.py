import os
import re

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if '<>' in content and '</>' not in content:
        content = re.sub(r'    </div>\n  \);\n};\n\nexport default', '    </div>\n    </>\n  );\n};\n\nexport default', content)
        with open(filepath, 'w', encoding='utf-8') as f: f.write(content)
        print(f"Fixed {filepath}")
    else:
        print(f"Already ok {filepath}")

fix_file('crm/src/views/admin/crm/index.jsx')
fix_file('crm/src/views/admin/clients/index.jsx')
