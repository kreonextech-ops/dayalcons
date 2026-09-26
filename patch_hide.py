import os

filepath = 'crm/src/views/admin/crm/index.jsx'
with open(filepath, 'r', encoding='utf-8') as f: content = f.read()

# Replace the return block
old_return = """  if (selectedLead) {
    return <LeadDetail lead={selectedLead} onBack={() => { setSelectedLead(null); fetchLeads(false); }} />;
  }

  return (
    <div className="w-full max-w-full bg-[#F8FAFC] dark:bg-navy-900 min-h-screen pt-4 pb-24">"""

new_return = """  return (
    <>
    {selectedLead && <LeadDetail lead={selectedLead} onBack={() => { setSelectedLead(null); fetchLeads(false); }} />}
    <div className={`w-full max-w-full bg-[#F8FAFC] dark:bg-navy-900 min-h-screen pt-4 pb-24 ${selectedLead ? 'hidden' : 'block'}`}>"""

content = content.replace(old_return, new_return)
# Need to close the fragment at the end of the component!
# Let's find the last </div> before the final brace.
# Actually, the file ends with something like:
#     </div>
#   );
# }
# export default CRMLeads;
content = content.replace('    </div>\n  );\n}\n\nexport default CRMLeads;', '    </div>\n    </>\n  );\n}\n\nexport default CRMLeads;')

with open(filepath, 'w', encoding='utf-8') as f: f.write(content)

filepath = 'crm/src/views/admin/clients/index.jsx'
with open(filepath, 'r', encoding='utf-8') as f: content = f.read()

old_return_c = """  if (selectedClient) {
    return <ClientDetail client={selectedClient} onBack={() => { setSelectedClient(null); fetchClients(false); }} />;
  }

  return (
    <div className="w-full max-w-full bg-[#F8FAFC] dark:bg-navy-900 min-h-screen pt-4 pb-24">"""

new_return_c = """  return (
    <>
    {selectedClient && <ClientDetail client={selectedClient} onBack={() => { setSelectedClient(null); fetchClients(false); }} />}
    <div className={`w-full max-w-full bg-[#F8FAFC] dark:bg-navy-900 min-h-screen pt-4 pb-24 ${selectedClient ? 'hidden' : 'block'}`}>"""

content = content.replace(old_return_c, new_return_c)
content = content.replace('    </div>\n  );\n}\n\nexport default Clients;', '    </div>\n    </>\n  );\n}\n\nexport default Clients;')

with open(filepath, 'w', encoding='utf-8') as f: f.write(content)
print("Hide patched")
