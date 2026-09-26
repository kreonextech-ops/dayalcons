with open("crm/src/views/admin/clients/ClientDetail.jsx", "r", encoding="utf-8") as f:
    content = f.read()

bad_code = """<span className="text-[#16A34A] flex items-center gap-1 font-bold text-sm text-xs italic">Auto-saves on click away</span>
                       <button onClick={() => setIsEditingClient(false)} className="ml-3 px-3 py-1 bg-gray-100 rounded text-xs font-bold hover:bg-gray-200">Done Editing</button>"""

good_code = """<div className="flex items-center">
                         <span className="text-[#16A34A] flex items-center gap-1 font-bold text-xs italic">Auto-saves on click away</span>
                         <button onClick={() => setIsEditingClient(false)} className="ml-3 px-3 py-1 bg-gray-100 rounded text-xs font-bold hover:bg-gray-200">Done Editing</button>
                       </div>"""

content = content.replace(bad_code, good_code)

with open("crm/src/views/admin/clients/ClientDetail.jsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Patched JSX error")
