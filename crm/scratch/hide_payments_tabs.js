const fs = require('fs');

function hidePaymentsTab(file) {
    if (!fs.existsSync(file)) return;
    let code = fs.readFileSync(file, 'utf8');

    // Make tabs dynamic based on role
    const tabsRegex = /const tabs = \[(.*?)\];/;
    const match = code.match(tabsRegex);
    if (!match) return;

    const currentTabsStr = match[1];
    
    // We replace the constant tabs array with dynamic logic
    const replacement = `const userStr = localStorage.getItem('dayal_user');
  const loggedInUser = userStr ? JSON.parse(userStr) : null;
  const isAdmin = loggedInUser?.role === 'Admin';
  
  const allTabs = [${currentTabsStr}];
  const tabs = isAdmin ? allTabs : allTabs.filter(t => !t.toLowerCase().includes('payment') && !t.toLowerCase().includes('finance'));`;

    code = code.replace(tabsRegex, replacement);

    fs.writeFileSync(file, code);
}

hidePaymentsTab('src/views/admin/projects/ProjectDetail.jsx');
hidePaymentsTab('src/views/admin/services/ServiceDetail.jsx');
