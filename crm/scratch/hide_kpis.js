const fs = require('fs');

function hideFinancialKPIs(file) {
    if (!fs.existsSync(file)) return;
    let code = fs.readFileSync(file, 'utf8');

    // Add isAdmin check if not present
    if (!code.includes('const isAdmin =')) {
        code = code.replace(/const \[projects, setProjects\] = useState\(\[\]\);|const \[services, setServices\] = useState\(\[\]\);/, (match) => {
            return `const userStr = localStorage.getItem('dayal_user');
  const loggedInUser = userStr ? JSON.parse(userStr) : null;
  const isAdmin = loggedInUser?.role === 'Admin';
  
  ${match}`;
        });
    }

    // Replace the KPIs array dynamically
    const kpiRegex = /const kpis = \[\s*\{.*?\}\s*\];/s; // This might be brittle if it has multiple lines, let's be careful.
    
    // Better way: simply find `{ title: "Total Revenue", value: "₹ 0" },` and conditionally include it.
    code = code.replace(/\{ title: "Total Revenue", value: "₹ 0" \},/g, `...(isAdmin ? [{ title: "Total Revenue", value: "₹ 0" }] : []),`);
    code = code.replace(/\{ title: "Received", value: "₹ 0" \},/g, `...(isAdmin ? [{ title: "Received", value: "₹ 0" }] : []),`);
    code = code.replace(/\{ title: "Pending", value: "₹ 0" \}/g, `...(isAdmin ? [{ title: "Pending", value: "₹ 0" }] : [])`);
    
    fs.writeFileSync(file, code);
}

hideFinancialKPIs('src/views/admin/projects/index.jsx');
hideFinancialKPIs('src/views/admin/services/index.jsx');
