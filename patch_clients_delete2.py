import os, re

filepath = 'crm/src/views/admin/clients/index.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target = r'<td className="py-4 px-6 text-right">\s*<button onClick=\{\(e\) => \{ e\.stopPropagation\(\); handleDeleteClient\(client\.id\); \}\} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition" title="Delete Client">\s*<MdDeleteOutline size=\{20\} \/>\s*<\/button>\s*<\/td>'

replacement = """<td className="py-4 px-6 text-right">
                                {isAdmin && (
                                   <button onClick={(e) => { e.stopPropagation(); handleDeleteClient(client.id); }} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition" title="Delete Client">
                                      <MdDeleteOutline size={20} />
                                   </button>
                                )}
                             </td>"""

content = re.sub(target, replacement, content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Patched Clients index.jsx with regex")
