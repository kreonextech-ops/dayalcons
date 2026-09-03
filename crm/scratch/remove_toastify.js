const fs = require('fs');
let code = fs.readFileSync('src/views/admin/profile/index.jsx', 'utf8');

code = code.replace(/import \{ toast, ToastContainer \} from "react-toastify";\nimport "react-toastify\/dist\/ReactToastify.css";/g, '');
code = code.replace(/<ToastContainer \/>/g, '');
code = code.replace(/toast.success\(/g, 'alert(');
code = code.replace(/toast.error\(/g, 'alert(');

fs.writeFileSync('src/views/admin/profile/index.jsx', code);
