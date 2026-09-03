const fs = require('fs');
let code = fs.readFileSync('src/views/admin/tasks/components/TabFiles.jsx', 'utf8');

code = code.replace(
    'import { uploadFileToR2, getR2FileUrl, deleteR2File } from "../../../utils/r2Storage";',
    'import { uploadFileToR2, getR2FileUrl, deleteR2File } from "utils/r2Storage";'
);

// Fallback in case it wasn't an exact match
code = code.replace(
    /from\s+['"]\.\.\/\.\.\/\.\.\/utils\/r2Storage['"]/,
    'from "utils/r2Storage"'
);

fs.writeFileSync('src/views/admin/tasks/components/TabFiles.jsx', code);
