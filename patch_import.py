import re
with open('crm/src/views/admin/clients/index.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = re.sub(r'import \{([^}]*)MdDeleteOutline([^}]*)\} from "react-icons/md";', r'import {\1MdDeleteOutline, MdClose\2} from "react-icons/md";', c)

with open('crm/src/views/admin/clients/index.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
