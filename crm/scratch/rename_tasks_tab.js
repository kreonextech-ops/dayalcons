const fs = require('fs');
let code = fs.readFileSync('src/views/admin/employees/EmployeeDetail.jsx', 'utf8');

code = code.replace(/"My Tasks"/g, '"Tasks"');
code = code.replace(/'My Tasks'/g, "'Tasks'");

fs.writeFileSync('src/views/admin/employees/EmployeeDetail.jsx', code);
