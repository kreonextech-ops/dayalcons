import os

filepath = 'crm/src/views/admin/clients/index.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target = """                             <td className="py-4 px-6 text-right">
                                <button onClick={(e) => { e.stopPropagation(); handleDeleteClient(client.id); }} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition" title="Delete Client">
                                   <MdDeleteOutline size={20} />
                                </button>
                             </td>"""

replacement = """                             <td className="py-4 px-6 text-right">
                                {isAdmin && (
                                   <button onClick={(e) => { e.stopPropagation(); handleDeleteClient(client.id); }} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition" title="Delete Client">
                                      <MdDeleteOutline size={20} />
                                   </button>
                                )}
                             </td>"""

if target in content:
    content = content.replace(target, replacement)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Patched Clients index.jsx for delete restriction")
else:
    print("Target not found.")
