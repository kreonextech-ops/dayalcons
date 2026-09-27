with open('crm/src/views/admin/clients/index.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

s1 = '<th className="py-4 px-4 text-[12px] font-medium text-[#64748B] dark:text-gray-400 uppercase tracking-wider">Date Created</th>'
r1 = '<th className="py-4 px-4 text-[12px] font-medium text-[#64748B] dark:text-gray-400 uppercase tracking-wider">Status</th>\n                  <th className="py-4 px-4 text-[12px] font-medium text-[#64748B] dark:text-gray-400 uppercase tracking-wider">Date Created</th>'
c = c.replace(s1, r1)

s2 = '''<td className="py-4 px-4 text-[12px] text-gray-500">
                                {client.created_at ? new Date(client.created_at).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' }) : "-"}
                             </td>'''
r2 = '''<td className="py-2 px-4 text-sm">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${client.status === 'Ongoing' ? 'bg-yellow-100 text-yellow-700' : client.status === 'Closed' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                                 {client.status || 'Ongoing'}
                              </span>
                           </td>
                           <td className="py-4 px-4 text-[12px] text-gray-500">
                                {client.created_at ? new Date(client.created_at).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' }) : "-"}
                             </td>'''
c = c.replace(s2, r2)

with open('crm/src/views/admin/clients/index.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
