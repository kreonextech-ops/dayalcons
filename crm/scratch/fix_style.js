const fs = require('fs');
let code = fs.readFileSync('src/views/admin/profile/index.jsx', 'utf8');

// Replace the buggy style string
code = code.replace(
    /backgroundImage: \\`url\('([^']+)'\)\\`/g,
    'backgroundImage: `url(\\'$1\\')`'
);

fs.writeFileSync('src/views/admin/profile/index.jsx', code);
