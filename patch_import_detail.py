import re
with open('crm/src/views/admin/clients/ClientDetail.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

if 'MdClose' not in c.split('from "react-icons/md"')[0]:
    c = re.sub(r'import \{([^}]*)MdArrowBack([^}]*)\} from "react-icons/md";', r'import {\1MdArrowBack, MdClose\2} from "react-icons/md";', c)

with open('crm/src/views/admin/clients/ClientDetail.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
