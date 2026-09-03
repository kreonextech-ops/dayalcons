const fs = require('fs');
let code = fs.readFileSync('src/components/sidebar/components/Links.jsx', 'utf8');

const regex = /if \(isAdmin\) \{[\s\S]*?\} else if \(route\.layout === "\/admin"\) \{[\s\S]*?\}\s*\}/;

const newLogic = `if (isAdmin) {
        hasPermission = true;
      } else if (route.layout === "/admin") {
        const allowedForEmployees = [
           "Dashboard", 
           "Leads", 
           "Clients", 
           "Design & Legal Services", 
           "Execution Projects", 
           "Tasks"
        ];
        if (allowedForEmployees.includes(route.name)) {
           hasPermission = true;
        }
      }`;

code = code.replace(regex, newLogic);
fs.writeFileSync('src/components/sidebar/components/Links.jsx', code);
