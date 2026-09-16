import sys
import re

files_to_fix = [
    'crm/src/views/admin/crm/index.jsx',
    'crm/src/views/admin/clients/index.jsx'
]

md_icons = {"MdFoundation", "MdLocationCity", "MdEngineering", "MdOutlineArchitecture", "MdBusinessCenter", "MdCloudDownload", "MdDomainVerification", "MdLayers", "MdHouse", "MdWaterDrop", "MdPhotoSizeSelectSmall", "MdOutlineFoundation"}
fi_icons = {"FiFileText", "FiMap"}

for filepath in files_to_fix:
    with open(filepath, 'r') as f:
        content = f.read()

    # Remove the injected imports
    content = content.replace('import { MdFoundation, MdLocationCity, MdEngineering, MdOutlineArchitecture, MdBusinessCenter, MdCloudDownload, MdDomainVerification, MdLayers, MdHouse, MdWaterDrop, MdPhotoSizeSelectSmall } from "react-icons/md";\nimport { FiFileText, FiMap } from "react-icons/fi";\n', '')

    # Now find existing 'react-icons/md' import and inject missing icons
    md_match = re.search(r'import\s+\{([^}]+)\}\s+from\s+[\'"]react-icons/md[\'"]', content)
    if md_match:
        existing_md = set([x.strip() for x in md_match.group(1).split(',') if x.strip()])
        existing_md.update(md_icons)
        new_md_import = 'import { ' + ', '.join(sorted(list(existing_md))) + ' } from "react-icons/md"'
        content = content[:md_match.start()] + new_md_import + content[md_match.end():]
    else:
        content = 'import { ' + ', '.join(sorted(list(md_icons))) + ' } from "react-icons/md";\n' + content

    # Same for 'react-icons/fi'
    fi_match = re.search(r'import\s+\{([^}]+)\}\s+from\s+[\'"]react-icons/fi[\'"]', content)
    if fi_match:
        existing_fi = set([x.strip() for x in fi_match.group(1).split(',') if x.strip()])
        existing_fi.update(fi_icons)
        new_fi_import = 'import { ' + ', '.join(sorted(list(existing_fi))) + ' } from "react-icons/fi"'
        content = content[:fi_match.start()] + new_fi_import + content[fi_match.end():]
    else:
        content = 'import { ' + ', '.join(sorted(list(fi_icons))) + ' } from "react-icons/fi";\n' + content

    with open(filepath, 'w') as f:
        f.write(content)

print("Fixed imports")
