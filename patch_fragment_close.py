import os
import re

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if <> is there
    if '<>' in content and '</>' not in content:
        # replace the last </div> before );
        content = re.sub(r'    </div>\s*\);\s*}\s*export default', '    </div>\n    </>\n  );\n}\n\nexport default', content)
        with open(filepath, 'w', encoding='utf-8') as f: f.write(content)
        print(f"Fixed {filepath}")
    elif '<>' not in content:
        print(f"No fragment found in {filepath}")
    else:
        print(f"Already closed in {filepath}")

fix_file('crm/src/views/admin/crm/index.jsx')
fix_file('crm/src/views/admin/clients/index.jsx')
