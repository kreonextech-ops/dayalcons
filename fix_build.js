const fs = require('fs');

function fix(filePath, arrName) {
    let c = fs.readFileSync(filePath, 'utf8');

    c = c.replace(/finalFiltered/g, arrName);

    fs.writeFileSync(filePath, c);
}

fix('crm/src/views/admin/crm/index.jsx', 'leads');
fix('crm/src/views/admin/clients/index.jsx', 'clients');
