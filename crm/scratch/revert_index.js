const fs = require('fs');
let code = fs.readFileSync('src/views/admin/employees/index.jsx', 'utf8');

// Revert handleCompleteOnboarding
code = code.replace(
  'permissions: newEmp.permissions || {},\n         phone: newEmp.phone || "",\n         status: newEmp.status || "Active",\n         join_date: newEmp.joinDate || new Date().toISOString()',
  'permissions: newEmp.permissions || {}'
);

// Revert handleEditProfile
code = code.replace(
  'phone: emp.phone || "", whatsapp: "", address: "", dob: "", joinDate: emp.join_date || "", emergency: "", manager: "", location: "", empType: "", status: emp.status || "Active"',
  'phone: "", whatsapp: "", address: "", dob: "", joinDate: "", emergency: "", manager: "", location: "", empType: "", status: "Available"'
);

fs.writeFileSync('src/views/admin/employees/index.jsx', code);
