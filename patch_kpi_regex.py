import re
with open('crm/src/views/admin/employees/index.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = re.sub(r'const kpis = \[\s*\{ title: "Total Employees"[^\]]+\];', '''const kpis = [
    { title: "Total Employees", value: empCount, icon: <MdPeople className="text-[#2563EB]" />, bg: "bg-blue-50" },
    { title: "System Admins", value: adminCount, icon: <MdAdminPanelSettings className="text-[#F59E0B]" />, bg: "bg-orange-50" },
    { title: "Departments", value: deptCount, icon: <MdDomain className="text-[#10B981]" />, bg: "bg-green-50" },
    { title: "Designations", value: desigCount, icon: <MdEngineering className="text-[#8B5CF6]" />, bg: "bg-purple-50" },
  ];''', c)

with open('crm/src/views/admin/employees/index.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
