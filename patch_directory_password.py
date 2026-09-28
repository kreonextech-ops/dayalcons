with open('crm/src/views/admin/employees/components/TabDirectory.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Replace Login Details header back to just Email
c = c.replace('<th className="py-4 px-4 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Login Details</th>', '<th className="py-4 px-4 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Email</th>')

# Remove password from the row
old_tds = """<td className="py-4 px-4">
                           <p className="text-[12px] text-[#0F172A] break-all">{emp.email}</p>
                           <p className="text-[12px] text-gray-500 font-mono">{emp.password}</p>
                        </td>"""
new_tds = """<td className="py-4 px-4">
                           <p className="text-[12px] text-[#0F172A] break-all">{emp.email}</p>
                        </td>"""
c = c.replace(old_tds, new_tds)

with open('crm/src/views/admin/employees/components/TabDirectory.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
