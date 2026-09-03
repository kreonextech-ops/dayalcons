const fs = require('fs');
let code = fs.readFileSync('src/views/admin/projects/components/TabSteps.jsx', 'utf8');

const replaceFrom = `const DEFAULT_STEPS = [
  { id: 1, title: "Initial Consultation & Requirements Gathering", completed: false },
  { id: 2, title: "Site Visit & Measurement", completed: false },
  { id: 3, title: "Drafting Initial Plans / Design", completed: false },
  { id: 4, title: "Client Review & Feedback", completed: false },
  { id: 5, title: "Revisions & Final Adjustments", completed: false },
  { id: 6, title: "Final Approval & Handover", completed: false }
];`;

const replaceTo = `const DEFAULT_STEPS = [
  { id: 1, title: "Site Setup & Mobilization", completed: false },
  { id: 2, title: "Excavation & Foundation", completed: false },
  { id: 3, title: "Structural Framework & Superstructure", completed: false },
  { id: 4, title: "Masonry & Core Works", completed: false },
  { id: 5, title: "MEP Rough-ins (Plumbing, Electrical, HVAC)", completed: false },
  { id: 6, title: "Plastering, Flooring & Finishes", completed: false },
  { id: 7, title: "Handover & Final Inspection", completed: false }
];`;

code = code.replace(replaceFrom, replaceTo);
fs.writeFileSync('src/views/admin/projects/components/TabSteps.jsx', code);
