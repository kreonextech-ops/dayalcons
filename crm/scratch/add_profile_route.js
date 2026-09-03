const fs = require('fs');
let code = fs.readFileSync('src/routes.js', 'utf8');

// Add Profile component import
const profileImport = 'import ProfileSettings from "views/admin/profile";';
if (!code.includes('ProfileSettings')) {
    code = code.replace(
        '// Auth Imports',
        `${profileImport}\n\n// Auth Imports`
    );
}

// Add route
const profileRoute = `
  {
    name: "Profile Settings",
    layout: "/admin",
    path: "profile",
    icon: <MdPerson className="h-6 w-6" />,
    component: <ProfileSettings />,
    secondary: true,
  },`;

if (!code.includes('path: "profile"')) {
    code = code.replace(
        'const routes = [',
        `const routes = [${profileRoute}`
    );
}

fs.writeFileSync('src/routes.js', code);
