const fs = require('fs');
let code = fs.readFileSync('src/components/navbar/index.jsx', 'utf8');

if (!code.includes('import { getR2FileUrl }')) {
    code = code.replace(
        'import React from "react";',
        `import React, { useState, useEffect } from "react";\nimport { getR2FileUrl } from "utils/r2Storage";`
    );
}

// Replace the Profile dropdown button entirely to support avatar URL fetching.
const dropdownButtonRegex = /<Dropdown\s+button=\{\s*<div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold\s*text-sm cursor-pointer shadow-sm">.*?<\/div>\s*\}\s+children=\{/s;

const newDropdownButton = `<Dropdown
            button={
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold text-sm cursor-pointer shadow-sm relative overflow-hidden">
                {(() => {
                  const userStr = localStorage.getItem("dayal_user");
                  const user = userStr ? JSON.parse(userStr) : { name: "User", permissions: {} };
                  
                  // Use state for real-time updates of avatar
                  const [avatar, setAvatar] = React.useState(null);
                  
                  React.useEffect(() => {
                     const loadUserAvatar = async () => {
                         const uStr = localStorage.getItem("dayal_user");
                         if (uStr) {
                             const u = JSON.parse(uStr);
                             if (u.permissions?.avatar) {
                                 try {
                                     const url = await getR2FileUrl(u.permissions.avatar);
                                     setAvatar(url);
                                 } catch(e) {}
                             }
                         }
                     };
                     loadUserAvatar();
                     
                     const handleStorage = () => loadUserAvatar();
                     window.addEventListener('storage', handleStorage);
                     return () => window.removeEventListener('storage', handleStorage);
                  }, []);
                  
                  if (avatar) {
                     return <img src={avatar} className="w-full h-full object-cover" alt="Profile" />;
                  }
                  
                  const names = user.name.split(" ");
                  if (names.length > 1) {
                    return (names[0][0] + names[1][0]).toUpperCase();
                  }
                  return user.name.substring(0, 2).toUpperCase();
                })()}
              </div>
            }
            children={`;

code = code.replace(dropdownButtonRegex, newDropdownButton);

// Replace Newsletter Settings and update Profile Settings
const newsletterRegex = /<a\s*href=" "\s*className="text-sm text-gray-800 dark:text-white hover:dark:text-white"\s*>\s*Profile Settings\s*<\/a>\s*<a\s*href=" "\s*className="mt-3 text-sm text-gray-800 dark:text-white hover:dark:text-white"\s*>\s*Newsletter Settings\s*<\/a>/;

const updatedProfileLink = `<Link
                    to="/admin/profile"
                    className="text-sm text-gray-800 dark:text-white hover:dark:text-white"
                  >
                    Profile Settings
                  </Link>`;

code = code.replace(newsletterRegex, updatedProfileLink);

// Some occurrences might not match if whitespace varies, so let's use a safer search.
if (!code.includes('<Link to="/admin/profile"')) {
   const exactMatch = `<a
                    href=" "
                    className="text-sm text-gray-800 dark:text-white hover:dark:text-white"
                  >
                    Profile Settings
                  </a>
                  <a
                    href=" "
                    className="mt-3 text-sm text-gray-800 dark:text-white hover:dark:text-white"
                  >
                    Newsletter Settings
                  </a>`;
    code = code.replace(exactMatch, updatedProfileLink);
}

fs.writeFileSync('src/components/navbar/index.jsx', code);
