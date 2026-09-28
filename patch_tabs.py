# TabDepartments.jsx
with open('crm/src/views/admin/employees/components/TabDepartments.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

import re
old_effect = """  useEffect(() => {
     const saved = localStorage.getItem("dayal_departments");
     if (saved) setDepts(JSON.parse(saved));
  }, []);

  const handleSave = () => {
     if (!newDept.name) return;
     const updated = [...depts, { ...newDept, empCount: 0, projects: 0 }];
     localStorage.setItem("dayal_departments", JSON.stringify(updated));
     setDepts(updated);
     setNewDept({ name: "", head: "" });
     setShowModal(false);
  };"""
new_effect = """  useEffect(() => {
     const fetchDepts = async () => {
        const { data } = await __import__('createClient').createClient(
           process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co",
           process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg"
        ).from('employees').select('department');
        
        if (data) {
           const grouped = {};
           data.forEach(d => {
               if (d.department) {
                   grouped[d.department] = (grouped[d.department] || 0) + 1;
               }
           });
           const final = Object.keys(grouped).map(k => ({ name: k, head: "Assigned Automatically", empCount: grouped[k], projects: "-" }));
           setDepts(final);
        }
     };
     fetchDepts();
  }, []);

  const handleSave = () => {
     alert("Departments are created automatically when you assign them to an employee.");
     setShowModal(false);
  };"""
c = c.replace(old_effect, new_effect)
c = c.replace('import { MdAdd, MdMoreVert, MdFolder, MdClose, MdCheckCircle } from "react-icons/md";', 'import { MdAdd, MdMoreVert, MdFolder, MdClose, MdCheckCircle } from "react-icons/md";\nimport { createClient } from "@supabase/supabase-js";')
c = c.replace("__import__('createClient').createClient", "createClient")

with open('crm/src/views/admin/employees/components/TabDepartments.jsx', 'w', encoding='utf-8') as f:
    f.write(c)


# TabDesignations.jsx
with open('crm/src/views/admin/employees/components/TabDesignations.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

old_effect_desig = """  useEffect(() => {
     const saved = localStorage.getItem("dayal_designations");
     if (saved) setDesigs(JSON.parse(saved));
  }, []);

  const handleSave = () => {
     if (!newDesig.title) return;
     const updated = [...desigs, { ...newDesig, empCount: 0 }];
     localStorage.setItem("dayal_designations", JSON.stringify(updated));
     setDesigs(updated);
     setNewDesig({ title: "", department: "", level: "Junior" });
     setShowModal(false);
  };"""
new_effect_desig = """  useEffect(() => {
     const fetchDesigs = async () => {
        const { data } = await createClient(
           process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co",
           process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg"
        ).from('employees').select('designation, department');
        
        if (data) {
           const grouped = {};
           data.forEach(d => {
               if (d.designation) {
                   if (!grouped[d.designation]) grouped[d.designation] = { count: 0, dept: d.department || "Unknown" };
                   grouped[d.designation].count++;
               }
           });
           const final = Object.keys(grouped).map(k => ({ title: k, department: grouped[k].dept, level: "Standard", empCount: grouped[k].count }));
           setDesigs(final);
        }
     };
     fetchDesigs();
  }, []);

  const handleSave = () => {
     alert("Designations are created automatically when you assign them to an employee.");
     setShowModal(false);
  };"""
c = c.replace(old_effect_desig, new_effect_desig)
c = c.replace('import { MdAdd, MdMoreVert, MdEngineering, MdClose, MdCheckCircle } from "react-icons/md";', 'import { MdAdd, MdMoreVert, MdEngineering, MdClose, MdCheckCircle } from "react-icons/md";\nimport { createClient } from "@supabase/supabase-js";')

with open('crm/src/views/admin/employees/components/TabDesignations.jsx', 'w', encoding='utf-8') as f:
    f.write(c)


# TabRoles.jsx
with open('crm/src/views/admin/employees/components/TabRoles.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

old_effect_roles = """  useEffect(() => {
     const saved = localStorage.getItem("dayal_roles");
     if (saved) setRoles(JSON.parse(saved));
  }, []);

  const handleSave = () => {
     if (!newRole.name) return;
     const updated = [...roles, { ...newRole, userCount: 0 }];
     localStorage.setItem("dayal_roles", JSON.stringify(updated));
     setRoles(updated);
     setNewRole({ name: "", permissions: [] });
     setShowModal(false);
  };"""
new_effect_roles = """  useEffect(() => {
     const fetchRoles = async () => {
        const { data } = await createClient(
           process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co",
           process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg"
        ).from('employees').select('role');
        
        if (data) {
           const grouped = {};
           data.forEach(d => {
               if (d.role) {
                   grouped[d.role] = (grouped[d.role] || 0) + 1;
               }
           });
           const final = Object.keys(grouped).map(k => ({ name: k, permissions: ["View", "Edit"], userCount: grouped[k] }));
           setRoles(final);
        }
     };
     fetchRoles();
  }, []);

  const handleSave = () => {
     alert("Roles are created automatically when you assign them to an employee.");
     setShowModal(false);
  };"""
c = c.replace(old_effect_roles, new_effect_roles)
c = c.replace('import { MdAdd, MdMoreVert, MdSecurity, MdClose, MdCheckCircle } from "react-icons/md";', 'import { MdAdd, MdMoreVert, MdSecurity, MdClose, MdCheckCircle } from "react-icons/md";\nimport { createClient } from "@supabase/supabase-js";')

with open('crm/src/views/admin/employees/components/TabRoles.jsx', 'w', encoding='utf-8') as f:
    f.write(c)

