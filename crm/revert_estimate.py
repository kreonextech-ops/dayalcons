import re

filepath = 'crm/src/views/admin/clients/ClientDetail.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    '<TabFinancials clientData={clientData} />',
    '<TabEstimate leadData={clientData} isClient={true} />'
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print('Reverted TabFinancials to TabEstimate in ClientDetail.jsx')
