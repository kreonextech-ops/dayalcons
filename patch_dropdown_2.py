with open('crm/src/views/admin/assignments/index.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

bad_str = """                       {isAdmin ? employees.map(emp => (
                          <option key={emp.id} value={emp.id}>{emp.name}</option>
                       )) : (
                          <option value={user?.id}>Myself ({user?.name})</option>
                       )}"""

good_str = """                       {employees.map(emp => (
                          <option key={emp.id} value={emp.id}>{emp.name}</option>
                       ))}"""

if bad_str in content:
    content = content.replace(bad_str, good_str)
    with open('crm/src/views/admin/assignments/index.jsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Dropdown patched")
else:
    print("Target not found")
