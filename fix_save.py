with open('crm/src/views/admin/clients/ClientDetail.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Fix Done Editing button to actually call handleSaveClientInfo instead of just setIsEditingClient(false)
c = c.replace(
    '<button onClick={() => setIsEditingClient(false)} className="ml-3 px-3 py-1 bg-gray-100 rounded text-xs font-bold hover:bg-gray-200">Done Editing</button>',
    '<button onClick={handleSaveClientInfo} className="ml-3 px-3 py-1 bg-[#16A34A] text-white rounded text-xs font-bold hover:bg-green-700 transition shadow">Save Changes</button>'
)

# Also add onBlur to Work Types and Source just in case
c = c.replace(
    '<input type="text" className="border rounded p-2 text-sm outline-none border-[#16A34A]" value={clientData.work_types || ""}',
    '<input type="text" className="border rounded p-2 text-sm outline-none border-[#16A34A]" onBlur={handleSaveClientInfo} value={clientData.work_types || ""}'
)
c = c.replace(
    '<select className="border rounded p-2 text-sm outline-none border-[#16A34A] custom-scrollbar max-h-[150px]" value={clientData.source || ""}',
    '<select className="border rounded p-2 text-sm outline-none border-[#16A34A] custom-scrollbar max-h-[150px]" onBlur={handleSaveClientInfo} value={clientData.source || ""}'
)

with open('crm/src/views/admin/clients/ClientDetail.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
