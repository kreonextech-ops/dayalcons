const fs = require('fs');
let code = fs.readFileSync('src/views/admin/projects/index.jsx', 'utf8');

code = code.replace(/const DESIGN_SERVICES = \[[\s\S]*?\];/, `const EXECUTION_PROJECTS = [
  { id: "Turnkey Construction", icon: <MdFoundation size={24} /> },
  { id: "Commercial Construction", icon: <MdLocationCity size={24} /> },
  { id: "Industrial Setup", icon: <MdEngineering size={24} /> },
  { id: "Renovation & Remodeling", icon: <MdOutlineArchitecture size={24} /> },
  { id: "Interior Execution", icon: <MdBusinessCenter size={24} /> },
  { id: "Landscaping", icon: <MdCloudDownload size={24} /> },
];`);
code = code.replace(/DESIGN_SERVICES/g, 'EXECUTION_PROJECTS');

code = code.replace(
  /import \{[\s\S]*?\} from "react-icons\/md";/,
  'import { MdSearch, MdDesignServices, MdGavel, MdOutlineArchitecture, MdBusinessCenter, MdAttachMoney, MdAdd, MdCloudDownload, MdCloudUpload, MdMoreVert, MdFolder, MdChevronRight, MdChevronLeft, MdClose, MdCheckCircle, MdDelete, MdFoundation, MdLocationCity, MdEngineering } from "react-icons/md";'
);

code = code.replace('Pages / Design & Legal', 'Pages / Execution');

// Replace reference to ServiceDetail component to ProjectDetail
code = code.replace(/<ServiceDetail/g, '<ProjectDetail');
// Also the property name from serviceCase to projData
code = code.replace(/serviceCase=\{selectedCase\}/g, 'projData={selectedCase}');
// And the imports
code = code.replace(/import ServiceDetail from "\.\/ServiceDetail";/, 'import ProjectDetail from "./ProjectDetail";');

fs.writeFileSync('src/views/admin/projects/index.jsx', code);
