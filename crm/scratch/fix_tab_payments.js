const fs = require('fs');
let code = fs.readFileSync('src/views/admin/projects/components/TabPayments.jsx', 'utf8');

code = code.replace(/await supabase\.from\("services"\)\.update/g, 'await supabase.from("projects").update');

fs.writeFileSync('src/views/admin/projects/components/TabPayments.jsx', code);
