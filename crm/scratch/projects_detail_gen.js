const fs = require('fs');

let code = fs.readFileSync('services_detail.txt', 'utf8');

// Replacements
code = code.replace(/ServiceDetail/g, 'ProjectDetail');
code = code.replace(/serviceCase/g, 'projData');
code = code.replace(/Service/g, 'Project');
code = code.replace(/service/g, 'project');
code = code.replace(/Services/g, 'Projects');
code = code.replace(/services/g, 'projects');

// We need to keep the execution specific tabs. In ServiceDetail we had:
// Overview, Workspace, Requirements, Steps, Payments, Tasks, Timeline, Communication
// For Projects, what are the execution specific tabs? 
// The user said: "from overview to communication", which means they literally want the SAME tabs or similar structure.
// I'll keep the exact same tabs, but maybe swap "Requirements" for "Scope".
// Actually, using the exact same tabs is safest since they said "whatever feature system is done... make that in execution projects also"

// Let's replace "Requirements" with "Scope"
code = code.replace(/"Requirements"/g, '"Scope"');
code = code.replace(/TabRequirements/g, 'TabScope');

// In TabScope, we might need a file called TabScope.jsx in projects folder. I'll just copy TabRequirements.jsx to TabScope.jsx.

fs.writeFileSync('src/views/admin/projects/ProjectDetail.jsx', code);
