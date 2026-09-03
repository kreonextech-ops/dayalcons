const fs = require('fs');
let lines = fs.readFileSync('src/views/admin/projects/ProjectDetail.jsx', 'utf8').split('\n');

// Remove all instances of "if (!projData) return null;"
lines = lines.filter(l => !l.includes('if (!projData) return null;'));

// Find "return (" and insert it before
const returnIdx = lines.findIndex(l => l.trim() === 'return (');
if (returnIdx !== -1) {
  lines.splice(returnIdx, 0, '  if (!projData) return null;');
} else {
  console.log("Could not find 'return ('");
}

fs.writeFileSync('src/views/admin/projects/ProjectDetail.jsx', lines.join('\n'));
