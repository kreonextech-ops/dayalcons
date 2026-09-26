import os
import re

filepath = 'crm/src/views/admin/crm/index.jsx'
with open(filepath, 'r', encoding='utf-8') as f: content = f.read()

content = content.replace('const fetchLeads = async () => {\n    setLoading(true);', 'const fetchLeads = async (showLoader = true) => {\n    if (showLoader) setLoading(true);')
content = content.replace('onBack={() => { setSelectedLead(null); fetchLeads(); }}', 'onBack={() => { setSelectedLead(null); fetchLeads(false); }}')

with open(filepath, 'w', encoding='utf-8') as f: f.write(content)

filepath = 'crm/src/views/admin/clients/index.jsx'
with open(filepath, 'r', encoding='utf-8') as f: content = f.read()

content = content.replace('const fetchClients = async () => {\n    setLoading(true);', 'const fetchClients = async (showLoader = true) => {\n    if (showLoader) setLoading(true);')
content = content.replace('onBack={() => { setSelectedClient(null); fetchClients(); }}', 'onBack={() => { setSelectedClient(null); fetchClients(false); }}')

with open(filepath, 'w', encoding='utf-8') as f: f.write(content)
print("fetch patched")
