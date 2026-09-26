import os

filepath = 'crm/src/views/admin/clients/ClientDetail.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

old_init = """  const [clientData, setClientData] = useState({
    id: client?.id,
    name: client?.name || "",
    phone: client?.phone || "",
    email: client?.email || "",
    address: client?.address || "",
    company: client?.company || "",
    gst: client?.gst || "",
    status: client?.status || "Active",
    assigned_to: client?.assigned_to || null,
    leadData: client?.leadData || {},
  });"""

new_init = """  const [clientData, setClientData] = useState({
    id: client?.id,
    name: client?.name || "",
    phone: client?.phone || "",
    email: client?.email || "",
    address: client?.address || "",
    company: client?.company || "",
    gst: client?.gst || "",
    status: client?.status || "Active",
    assigned_to: client?.assigned_to || null,
    leadData: client?.leadData || {},
    created_at: client?.created_at || "",
    work_types: client?.work_types || "",
  });"""

content = content.replace(old_init, new_init)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("ClientDetail init patched")
