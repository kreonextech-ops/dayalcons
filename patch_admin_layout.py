with open('crm/src/layouts/admin/index.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# patch CRO
target_cro = """          const allowedForCRO = [
            "Dashboard",
            "Leads",
            "Clients",
            "Consultancy Services",
            "Construction Projects",
            "Tasks",
            "Follow Ups",
            "Profile Settings"
          ];"""

new_cro = """          const allowedForCRO = [
            "Dashboard",
            "Leads",
            "Clients",
            "Consultancy Services",
            "Construction Projects",
            "Tasks",
            "Follow Ups",
            "Assignment Workflow",
            "Profile Settings"
          ];"""

if target_cro in content:
    content = content.replace(target_cro, new_cro)

# patch employees
target_emp = """          const allowedForEmployees = [
            "Dashboard", 
            "Leads", 
            "Clients", 
            "Consultancy Services", 
            "Construction Projects", 
            "Tasks",
            "Follow Ups",
            "Profile Settings"
          ];"""

new_emp = """          const allowedForEmployees = [
            "Dashboard", 
            "Leads", 
            "Clients", 
            "Consultancy Services", 
            "Construction Projects", 
            "Tasks",
            "Follow Ups",
            "Assignment Workflow",
            "Profile Settings"
          ];"""

if target_emp in content:
    content = content.replace(target_emp, new_emp)

with open('crm/src/layouts/admin/index.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Patched layout permissions")
