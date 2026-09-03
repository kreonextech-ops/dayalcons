const fs = require('fs');
let code = fs.readFileSync('src/views/admin/projects/components/TabScope.jsx', 'utf8');
code = code.replace(/const EXECUTION_PROJECTS = \[\s*\{ id: "Land[\s\S]*?\];/, `const EXECUTION_PROJECTS = [
  { id: "Turnkey Construction", icon: <MdFoundation size={24} /> },
  { id: "Commercial Construction", icon: <MdLocationCity size={24} /> },
  { id: "Industrial Setup", icon: <MdEngineering size={24} /> },
  { id: "Renovation & Remodeling", icon: <MdOutlineArchitecture size={24} /> },
  { id: "Interior Execution", icon: <MdBusinessCenter size={24} /> },
  { id: "Landscaping", icon: <MdCloudDownload size={24} /> }
];`);
fs.writeFileSync('src/views/admin/projects/components/TabScope.jsx', code);
