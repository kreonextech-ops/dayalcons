import re
with open('crm/src/routes.js', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(r'import SiteVisits from "views/admin/site-visits";\n', '', content)
content = re.sub(r'\{\s*name: "Site Visits",\s*layout: "/admin",\s*icon: <MdLocationCity className="h-6 w-6" />,\s*path: "site-visits",\s*component: <SiteVisits />,\s*\},', '', content)

with open('crm/src/routes.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Done")
