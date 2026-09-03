const fs = require('fs');

let code = fs.readFileSync('services_index.txt', 'utf8');

// Replacements
code = code.replace(/Design & Legal Services/g, 'Execution Projects');
code = code.replace(/Manage standalone architectural, legal, planning, engineering, and interior consultancy services./g, 'Manage turnkey construction, interior execution, and remodeling projects.');
code = code.replace(/Service Case/g, 'Project');
code = code.replace(/Service Cases/g, 'Projects');
code = code.replace(/New Service/g, 'New Project');
code = code.replace(/Service Requirements/g, 'Project Requirements');
code = code.replace(/Service/g, 'Project');
code = code.replace(/service/g, 'project');
code = code.replace(/Services/g, 'Projects');
code = code.replace(/services/g, 'projects');
code = code.replace(/srv/g, 'proj');

code = code.replace('const DESIGN_PROJECTS = [', 'const EXECUTION_PROJECTS = [');
code = code.replace('DESIGN_PROJECTS', 'EXECUTION_PROJECTS');

// We need to fix the services array definitions.
code = code.replace(/const DESIGN_PROJECTS = \[[\s\S]*?\];/, `const EXECUTION_PROJECTS = [
  { id: "Turnkey Construction", icon: <MdFoundation size={24} /> },
  { id: "Commercial Construction", icon: <MdLocationCity size={24} /> },
  { id: "Industrial Setup", icon: <MdEngineering size={24} /> },
  { id: "Renovation & Remodeling", icon: <MdOutlineArchitecture size={24} /> },
  { id: "Interior Execution", icon: <MdBusinessCenter size={24} /> },
  { id: "Landscaping", icon: <MdCloudDownload size={24} /> },
];`);
code = code.replace(/const EXECUTION_PROJECTS = \[[\s\S]*?\];/, `const EXECUTION_PROJECTS = [
  { id: "Turnkey Construction", icon: <MdFoundation size={24} /> },
  { id: "Commercial Construction", icon: <MdLocationCity size={24} /> },
  { id: "Industrial Setup", icon: <MdEngineering size={24} /> },
  { id: "Renovation & Remodeling", icon: <MdOutlineArchitecture size={24} /> },
  { id: "Interior Execution", icon: <MdBusinessCenter size={24} /> },
  { id: "Landscaping", icon: <MdCloudDownload size={24} /> },
];`);

// Fix missing icons imports
code = code.replace(
  'import { \n  MdSearch, MdAdd, MdClose, MdCheckCircle, MdDesignServices,\n  MdGavel, MdOutlineArchitecture, MdMap, MdAccountBalance, MdHomeWork,\n  MdOutlineAssignment, MdColorLens, MdWaterDrop\n} from "react-icons/md";',
  'import { MdSearch, MdAdd, MdClose, MdCheckCircle, MdDesignServices, MdGavel, MdOutlineArchitecture, MdMap, MdAccountBalance, MdHomeWork, MdOutlineAssignment, MdColorLens, MdWaterDrop, MdFoundation, MdLocationCity, MdEngineering, MdBusinessCenter, MdCloudDownload } from "react-icons/md";'
);

code = code.replace("import ProjectDetail from './ProjectDetail';", "import ProjectDetail from './ProjectDetail';");

fs.writeFileSync('src/views/admin/projects/index.jsx', code);
