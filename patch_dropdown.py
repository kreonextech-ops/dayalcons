with open('crm/src/views/admin/assignments/index.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = """                    <select value={assignEmployeeId} onChange={e => setAssignEmployeeId(e.target.value)} className="w-full h-11 px-3 border border-gray-300 rounded-lg outline-none">
                       <option value="">Select Employee</option>
                       {isAdmin ? employees.map(emp => (
                          <option key={emp.id} value={emp.id}>{emp.name}</option>
                       )) : (
                          <option value={user?.id}>Myself ({user?.name})</option>
                       )}
                    </select>"""

replacement = """                    <select value={assignEmployeeId} onChange={e => setAssignEmployeeId(e.target.value)} className="w-full h-11 px-3 border border-gray-300 rounded-lg outline-none">
                       <option value="">Select Employee</option>
                       {employees.map(emp => (
                          <option key={emp.id} value={emp.id}>{emp.name}</option>
                       ))}
                    </select>"""

if target in content:
    content = content.replace(target, replacement)
    with open('crm/src/views/admin/assignments/index.jsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Dropdown patched")
else:
    print("Target not found")
