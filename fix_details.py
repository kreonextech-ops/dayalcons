import sys

with open('crm/src/views/admin/crm/LeadDetail.jsx', 'r') as f:
    content = f.read()

# Add Visit tab to tabs array if not present
if '"Visit"' not in content[content.find('const tabs = ['):content.find(']', content.find('const tabs = ['))]:
    content = content.replace('"Tasks", "Timeline"', '"Tasks", "Timeline", "Visit"')

# Add render logic for Visit tab
if 'activeTab === "Visit"' not in content:
    content = content.replace('{activeTab === "Documents" && <TabDocuments leadData={leadData} />}', '{activeTab === "Documents" && <TabDocuments leadData={leadData} />}\n            {activeTab === "Visit" && <TabSiteVisit leadData={leadData} />}')

with open('crm/src/views/admin/crm/LeadDetail.jsx', 'w') as f:
    f.write(content)

with open('crm/src/views/admin/clients/ClientDetail.jsx', 'r') as f:
    content2 = f.read()
content2 = content2.replace('<TabSiteVisit leadData={clientData} />', '<TabSiteVisit leadData={clientData} isClient={true} />')
with open('crm/src/views/admin/clients/ClientDetail.jsx', 'w') as f:
    f.write(content2)

print("Fixed tabs and isClient prop")
