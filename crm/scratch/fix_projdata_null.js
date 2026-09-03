const fs = require('fs');
let code = fs.readFileSync('src/views/admin/projects/ProjectDetail.jsx', 'utf8');
code = code.replace('const [activeTab, setActiveTab] = useState("Overview");', 'const [activeTab, setActiveTab] = useState("Overview");\n  if (!projData) return null;');
fs.writeFileSync('src/views/admin/projects/ProjectDetail.jsx', code);
