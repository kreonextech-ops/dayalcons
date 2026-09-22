with open('crm/src/routes.js', 'r', encoding='utf-8') as f:
    content = f.read()

target = '''  {
    name: "Tasks",
    layout: "/admin",
    icon: <MdAssignment className="h-6 w-6" />,
    path: "tasks",
    component: <Tasks />,
  },'''

new_hub = '''  {
    name: "Tasks",
    layout: "/admin",
    icon: <MdAssignment className="h-6 w-6" />,
    path: "tasks",
    component: <Tasks />,
  },
  {
    name: "Assignment Hub",
    layout: "/admin",
    icon: <MdAssignment className="h-6 w-6" />,
    path: "assignments",
    component: <AssignmentHub />,
  },'''

content = content.replace(target, new_hub)

# check imports
if 'import AssignmentHub from "views/admin/assignments";' not in content:
    content = content.replace('import Employees from "views/admin/employees";', 'import Employees from "views/admin/employees";\nimport AssignmentHub from "views/admin/assignments";')

with open('crm/src/routes.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed routes")
