with open('crm/src/views/admin/employees/components/TabRoles.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Update the Card to show the actual permissions
old_card_bottom = """                <div className="mt-4 pt-4 border-t border-[#E2E8F0] dark:border-navy-700 flex justify-between items-center">
                   <span className="text-[12px] text-[#64748B]">{r.permissions.length} Permissions</span>
                   <div className="text-right">
                      <p className="text-[10px] font-bold text-[#64748B] uppercase">Users</p>
                      <p className="text-[13px] font-bold text-[#0F172A] dark:text-white">{empCounts[r.name] || 0}</p>
                   </div>
                </div>"""
new_card_bottom = """                <div className="mt-4 pt-4 border-t border-[#E2E8F0] dark:border-navy-700 flex flex-col gap-3">
                   <div className="flex flex-wrap gap-1">
                      {r.permissions.length === 0 ? <span className="text-[11px] text-gray-400 italic">No permissions</span> : 
                       r.permissions.slice(0, 5).map(p => <span key={p} className="bg-orange-50 text-orange-600 text-[10px] px-2 py-0.5 rounded-full border border-orange-100">{p}</span>)
                      }
                      {r.permissions.length > 5 && <span className="text-[10px] text-gray-500">+{r.permissions.length - 5} more</span>}
                   </div>
                   <div className="flex justify-between items-center mt-1">
                      <span className="text-[12px] font-bold text-[#64748B]">{r.permissions.length} Total</span>
                      <div className="text-right">
                         <p className="text-[10px] font-bold text-[#64748B] uppercase">Users</p>
                         <p className="text-[13px] font-bold text-[#0F172A] dark:text-white">{empCounts[r.name] || 0}</p>
                      </div>
                   </div>
                </div>"""
c = c.replace(old_card_bottom, new_card_bottom)

with open('crm/src/views/admin/employees/components/TabRoles.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
