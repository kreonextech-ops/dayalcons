const fs = require('fs');
let code = fs.readFileSync('src/layouts/admin/index.jsx', 'utf8');

const regex = /const isAdmin = user\?\.role === "Admin";[\s\S]*?if \(isAdmin\) \{[\s\S]*?hasPermission = true;\n\s*\} else if \(prop\.layout === "\/admin"\) \{[\s\S]*?\}\n\n\s*if \(prop\.layout === "\/admin" && hasPermission\)/;

const newLogic = `const isAdmin = user?.role === "Admin";
  
      return routes.map((prop, key) => {
        let hasPermission = false;
        if (isAdmin) {
          hasPermission = true;
        } else if (prop.layout === "/admin") {
          const allowedForEmployees = [
            "Dashboard", 
            "Leads", 
            "Clients", 
            "Design & Legal Services", 
            "Execution Projects", 
            "Tasks"
          ];
          if (allowedForEmployees.includes(prop.name)) {
            hasPermission = true;
          }
        }
  
        if (prop.layout === "/admin" && hasPermission)`;

code = code.replace(regex, newLogic);
fs.writeFileSync('src/layouts/admin/index.jsx', code);
