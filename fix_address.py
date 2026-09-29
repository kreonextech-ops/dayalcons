with open('crm/src/views/admin/clients/ClientDetail.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

old_input = '<input type="text" className="border rounded p-2 text-sm outline-none border-[#16A34A]" value={clientData.address}'
new_input = '<input type="text" className="border rounded p-2 text-sm outline-none border-[#16A34A]" onBlur={handleSaveClientInfo} value={clientData.address}'

c = c.replace(old_input, new_input)

with open('crm/src/views/admin/clients/ClientDetail.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
