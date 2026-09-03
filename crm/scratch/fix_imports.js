const fs = require('fs');

let code = fs.readFileSync('src/views/admin/tasks/TaskDetail.jsx', 'utf8');

code = code.replace(
  'import Card from "components/card";\nimport { createClient } from "@supabase/supabase-js";\nimport { useEffect } from "react";',
  'import Card from "components/card";'
);

code = 'import { createClient } from "@supabase/supabase-js";\nimport { useEffect } from "react";\n' + code;

fs.writeFileSync('src/views/admin/tasks/TaskDetail.jsx', code);
