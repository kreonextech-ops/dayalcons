const fs = require('fs');

function applyRBACFilter(file, tableName, fetchFunctionName) {
    if (!fs.existsSync(file)) return;
    let code = fs.readFileSync(file, 'utf8');

    // Make sure we have the isAdmin variables at the top of the component
    if (!code.includes('const loggedInUser =')) {
        const componentMatch = code.match(/const [a-zA-Z0-9]+ = \(\) => \{\n/);
        if (componentMatch) {
            code = code.replace(componentMatch[0], `${componentMatch[0]}  const userStr = localStorage.getItem('dayal_user');\n  const loggedInUser = userStr ? JSON.parse(userStr) : null;\n  const isAdmin = loggedInUser?.role === 'Admin';\n\n`);
        }
    }

    // A more robust regex for the supabase fetch
    const fetchRegex = new RegExp(`const \\{ data, error \\} = await supabase\\.from\\(['"]${tableName}['"]\\)\\.select\\(['"]\\*['"]\\)\\.order\\(['"]created_at['"], \\{ ascending: false \\}\\);`);
    
    const replacement = `let query = supabase.from('${tableName}').select('*').order('created_at', { ascending: false });
          if (!isAdmin && loggedInUser?.id) {
             query = query.like('assigned_to', \`%\${loggedInUser.id}%\`);
          }
          const { data, error } = await query;`;

    if (code.match(fetchRegex)) {
        code = code.replace(fetchRegex, replacement);
        fs.writeFileSync(file, code);
        console.log(`Updated ${file}`);
    } else {
        console.log(`Could not find fetch for ${tableName} in ${file}`);
    }
}

applyRBACFilter('src/views/admin/crm/index.jsx', 'leads', 'fetchLeads');
applyRBACFilter('src/views/admin/clients/index.jsx', 'clients', 'fetchClients');
applyRBACFilter('src/views/admin/services/index.jsx', 'services', 'fetchServices');
applyRBACFilter('src/views/admin/projects/index.jsx', 'projects', 'fetchProjects');
