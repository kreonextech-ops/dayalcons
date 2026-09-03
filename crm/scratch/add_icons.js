const fs = require('fs');
let code = fs.readFileSync('src/views/admin/clients/ClientDetail.jsx', 'utf8');

code = code.replace(
    'MdCheckCircle, MdPerson, MdClose',
    'MdCheckCircle, MdPerson, MdClose, MdDownload, MdDelete'
);

fs.writeFileSync('src/views/admin/clients/ClientDetail.jsx', code);
