const fs = require('fs');
let code = fs.readFileSync('src/views/admin/employees/index.jsx', 'utf8');

code = code.replace(
  /phone: "", whatsapp: "", address: "", dob: "", joinDate: "", emergency: "", manager: "", location: "", empType: "", status: "Available"/g,
  'phone: emp.phone || "", whatsapp: "", address: "", dob: "", joinDate: emp.join_date || "", emergency: "", manager: "", location: "", empType: "", status: emp.status || "Active"'
);

fs.writeFileSync('src/views/admin/employees/index.jsx', code);
