with open("crm/src/views/admin/clients/index.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add filterStatus state
if "const [filterStatus, setFilterStatus] = useState(\"\");" not in content:
    content = content.replace(
        'const [filterEmployee, setFilterEmployee] = useState("");',
        'const [filterStatus, setFilterStatus] = useState("");\n  const [filterEmployee, setFilterEmployee] = useState("");'
    )

# 2. Add filterStatus logic
if "if (filterStatus)" not in content:
    filter_logic_old = """  let filtered = [...clients];
  
  if (!isAdmin && loggedInUser?.id) {"""
    filter_logic_new = """  let filtered = [...clients];
  
  if (filterStatus) {
    filtered = filtered.filter(x => x.status === filterStatus);
  }
  
  if (!isAdmin && loggedInUser?.id) {"""
    content = content.replace(filter_logic_old, filter_logic_new)

# 3. Add Status Filter Dropdown
status_dropdown = """                  <div className="flex gap-3 flex-nowrap items-center shrink-0">
                      <select 
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="h-10 px-4 rounded-[10px] border border-[#E2E8F0] dark:border-navy-700 text-[14px] text-[#475569] dark:text-gray-200 dark:text-white outline-none focus:border-[#2563EB] bg-transparent dark:bg-navy-900 cursor-pointer w-[160px] truncate"
                        title="Filter by Status"
                      >
                        <option value="">All Statuses</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Hold">Hold</option>
                        <option value="Closed">Closed</option>
                      </select>"""
content = content.replace('                  <div className="flex gap-3 flex-nowrap items-center shrink-0">', status_dropdown, 1)

# 4. Make Status column a dropdown and update colors
status_col_old = """                        <td className="p-4 py-3 align-middle border-b border-gray-100 dark:border-navy-700">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                            client.status === 'Active' ? 'bg-[#ECFDF5] text-[#059669]' : 
                            'bg-gray-100 text-gray-600 dark:bg-navy-700 dark:text-gray-300'
                          }`}>
                            {client.status || 'Active'}
                          </span>
                        </td>"""

status_col_new = """                        <td className="p-4 py-3 align-middle border-b border-gray-100 dark:border-navy-700">
                          <select 
                            value={client.status || 'Ongoing'}
                            onChange={async (e) => {
                              const newStatus = e.target.value;
                              await supabase.from('clients').update({ status: newStatus }).eq('id', client.id);
                            }}
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold capitalize appearance-none cursor-pointer outline-none shadow-sm ${
                              client.status === 'Ongoing' ? 'bg-yellow-500 text-white' : 
                              client.status === 'Hold' ? 'bg-blue-500 text-white' : 
                              client.status === 'Closed' ? 'bg-red-500 text-white' :
                              'bg-yellow-500 text-white'
                            }`}
                          >
                            <option value="Ongoing" className="bg-white text-black">Ongoing</option>
                            <option value="Hold" className="bg-white text-black">Hold</option>
                            <option value="Closed" className="bg-white text-black">Closed</option>
                          </select>
                        </td>"""
content = content.replace(status_col_old, status_col_new)

# 5. Fix Default Status in newClient
content = content.replace('status: client?.status || "Active"', 'status: client?.status || "Ongoing"')
content = content.replace('status: "Active"', 'status: "Ongoing"')

with open("crm/src/views/admin/clients/index.jsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated clients/index.jsx")
