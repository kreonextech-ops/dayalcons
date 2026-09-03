const fs = require('fs');
let code = fs.readFileSync('src/views/admin/projects/components/TabScope.jsx', 'utf8');
code = code.replace('import Card from "components/card";', 'import { createClient } from "@supabase/supabase-js";\nimport Card from "components/card";');
code = code.replace('MdCheckCircle, MdFoundation', 'MdCheckCircle, MdSave, MdFoundation');
fs.writeFileSync('src/views/admin/projects/components/TabScope.jsx', code);
