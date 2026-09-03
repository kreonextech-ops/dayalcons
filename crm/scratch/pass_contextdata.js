const fs = require('fs');
let code = fs.readFileSync('src/views/admin/tasks/TaskDetail.jsx', 'utf8');

// 1. Pass contextData to TabOverview
code = code.replace(
    '<TabOverview task={task} />',
    '<TabOverview task={task} contextData={contextData} />'
);

// 2. Remove the "Linked To" block from Hero Header (since user says "do that in overview")
const linkedToRegex = /\{\(contextData\.client \|\| contextData\.lead \|\| contextData\.project \|\| contextData\.service\) && \(\s*<div className="min-w-0 flex-1">[\s\S]*?<\/div>\s*\)\}/;
code = code.replace(linkedToRegex, '');

fs.writeFileSync('src/views/admin/tasks/TaskDetail.jsx', code);
