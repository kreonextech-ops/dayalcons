const fs = require('fs');
let code = fs.readFileSync('src/views/admin/employees/EmployeeDetail.jsx', 'utf8');

code = code.replace(
   /const tabs = \[\s*"Overview", "Assigned Work", "Tasks"\s*\];/,
   'const tabs = ["Overview", "Assigned Work", "Tasks", "Activity", "Documents"];'
);

code = code.replace(
   /\{activeTab === "Tasks" && <TabMyTasks employee=\{employee\} \/>\}/,
   '{activeTab === "Tasks" && <TabMyTasks employee={employee} />}\n        {activeTab === "Activity" && <TabActivity employee={employee} />}\n        {activeTab === "Documents" && <TabDocuments employee={employee} />}'
);

code = code.replace(
   /import TabMyTasks from "\.\/components\/TabMyTasks";/,
   'import TabMyTasks from "./components/TabMyTasks";\nimport TabActivity from "./components/TabActivity";\nimport TabDocuments from "./components/TabDocuments";'
);

fs.writeFileSync('src/views/admin/employees/EmployeeDetail.jsx', code);
