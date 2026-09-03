const fs = require('fs');
let code = fs.readFileSync('src/views/admin/projects/index.jsx', 'utf8');

code = code.replace(
  'import { MdSearch, MdDesignServices',
  'import { createClient } from "@supabase/supabase-js";\nimport { MdSearch, MdDesignProjects, MdDesignServices'
);

fs.writeFileSync('src/views/admin/projects/index.jsx', code);
