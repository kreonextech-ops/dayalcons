import os
import re

def remove_unused(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Normalize line endings
    content = content.replace('\r\n', '\n')

    # Remove state vars
    content = re.sub(r'[ \t]*const \[filterStatus, setFilterStatus\] = useState\(""\);\n', '', content)
    content = re.sub(r'[ \t]*const \[filterTemp, setFilterTemp\] = useState\(""\);\n', '', content)
    content = re.sub(r'[ \t]*const \[filterMonth, setFilterMonth\] = useState\(""\);\n', '', content)

    # Remove filtering logic blocks
    content = re.sub(r'[ \t]*if \(filterStatus\) \{\n[ \t]*filtered = filtered\.filter\(x => x\.status === filterStatus\);\n[ \t]*\}\n', '', content)
    content = re.sub(r'[ \t]*if \(filterTemp\) \{\n[ \t]*filtered = filtered\.filter\(x => x\.lead_temperature === filterTemp\);\n[ \t]*\}\n', '', content)
    content = re.sub(r'[ \t]*if \(filterMonth\) \{.*?\}\n', '', content, flags=re.DOTALL)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

remove_unused('crm/src/views/admin/crm/index.jsx')
remove_unused('crm/src/views/admin/clients/index.jsx')
print("Regex patch applied")
