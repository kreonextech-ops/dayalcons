import sys

with open('crm/src/views/admin/crm/components/TabSiteVisit.jsx', 'r') as f:
    content = f.read()

content = content.replace("{\px-2 py-1 text-xs font-bold rounded-full \}", "{px-2 py-1 text-xs font-bold rounded-full }")

with open('crm/src/views/admin/crm/components/TabSiteVisit.jsx', 'w') as f:
    f.write(content)

print("Fixed TabSiteVisit")
