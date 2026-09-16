import re

filepath = 'crm/src/routes.js'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

import_pattern = r'(import Vendors from "views/admin/vendors";)'
content = re.sub(import_pattern, r'\1\nimport SiteVisits from "views/admin/site-visits";', content)

route_pattern = r'(\{\s*name: "Design & Legal Services",)'
site_visit_route = '''{
    name: "Site Visits",
    layout: "/admin",
    icon: <MdLocationCity className="h-6 w-6" />,
    path: "site-visits",
    component: <SiteVisits />,
  },
  '''
content = re.sub(route_pattern, site_visit_route + r'\1', content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print('Patched routes.js')
