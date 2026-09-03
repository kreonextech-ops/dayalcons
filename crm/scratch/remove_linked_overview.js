const fs = require('fs');
let code = fs.readFileSync('src/views/admin/tasks/components/TabOverview.jsx', 'utf8');

// The Linked Entity Data card starts with {/* Linked Entity Data */} and goes to the end of the grid.
const startIdx = code.indexOf('{/* Linked Entity Data */}');
if (startIdx !== -1) {
   // The end is the closing div of the grid.
   // We can just slice it out.
   const endIdx = code.lastIndexOf('</div>\n  );\n};');
   if (endIdx !== -1) {
       code = code.substring(0, startIdx) + '\n    ' + code.substring(endIdx);
   }
}

// We also don't need relatedRecord state or fetchRelated anymore.
code = code.replace(/const \[relatedRecord, setRelatedRecord\] = useState\(null\);\n/g, '');
code = code.replace(/useEffect\(\(\) => \{\n\s*const fetchRelated = async \(\) => \{[\s\S]*?fetchRelated\(\);\n\s*\}, \[task\]\);\n/, '');

fs.writeFileSync('src/views/admin/tasks/components/TabOverview.jsx', code);
