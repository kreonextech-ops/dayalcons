const fs = require('fs');
let code = fs.readFileSync('src/views/admin/employees/index.jsx', 'utf8');

code = code.replace(
  /permissions: newEmp\.permissions \|\| \{\}/g,
  'permissions: newEmp.permissions || {},\n         phone: newEmp.phone || "",\n         status: newEmp.status || "Active",\n         join_date: newEmp.joinDate || new Date().toISOString()'
);

code = code.replace(
  /phone: "", whatsapp: "", address: "", dob: "", joinDate: "", emergency: "", manager: "", location: "", empType: "", status: "Available"/g,
  'phone: emp.phone || "", whatsapp: "", address: "", dob: "", joinDate: emp.join_date || "", emergency: "", manager: "", location: "", empType: "", status: emp.status || "Active"'
);

fs.writeFileSync('src/views/admin/employees/index.jsx', code);
