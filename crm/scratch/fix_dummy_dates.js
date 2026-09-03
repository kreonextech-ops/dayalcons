const fs = require('fs');

function fixDummyDate(file) {
    if (!fs.existsSync(file)) return;
    let code = fs.readFileSync(file, 'utf8');
    
    code = code.replace(/\{new Date\(nextTask\.due_date\)\.toLocaleString\(\)\}/g, 
        "{nextTask.due_date ? new Date(nextTask.due_date).toLocaleString() : 'No Due Date'}");
    
    fs.writeFileSync(file, code);
}

fixDummyDate('src/views/admin/clients/ClientDetail.jsx');
fixDummyDate('src/views/admin/crm/LeadDetail.jsx');
