const fs = require('fs');
let code = fs.readFileSync('src/views/admin/crm/components/TabDocuments.jsx', 'utf8');

const toMove = `const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);`;

code = code.replace(toMove, '');

const afterImports = `import { 
  MdAdd, MdCloudUpload, MdFolder, MdInsertDriveFile, 
  MdSearch, MdMoreVert, MdClose, MdFileDownload, MdDelete, MdArrowBack
} from "react-icons/md";`;

code = code.replace(afterImports, afterImports + '\n\n' + toMove);

fs.writeFileSync('src/views/admin/crm/components/TabDocuments.jsx', code);
