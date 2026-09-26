const fs = require('fs');

function fix(filePath, arrName) {
    let c = fs.readFileSync(filePath, 'utf8');

    c = c.replace(
        `Showing {${arrName}.length > 0 ? ((currentPage - 1) * 10 + 1) : 0} - {Math.min(currentPage * 10, ${arrName}.length)} of {${arrName}.length} ${arrName}</span>`,
        `Showing {finalFiltered.length > 0 ? ((currentPage - 1) * 10 + 1) : 0} - {Math.min(currentPage * 10, finalFiltered.length)} of {finalFiltered.length} ${arrName}</span>`
    );

    c = c.replace(
        `disabled={currentPage * 10 >= ${arrName}.length}`,
        `disabled={currentPage * 10 >= finalFiltered.length}`
    );

    fs.writeFileSync(filePath, c);
}

fix('crm/src/views/admin/crm/index.jsx', 'leads');
fix('crm/src/views/admin/clients/index.jsx', 'clients');
