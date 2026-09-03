const fs = require('fs');
let code = fs.readFileSync('src/views/admin/profile/index.jsx', 'utf8');

// The string was: backgroundImage: \`url('...')\`
// Find that specific line and replace it
const lines = code.split('\n');
const fixedLines = lines.map(line => {
    if (line.includes('backgroundImage:')) {
        return '               <div className="relative mt-1 flex h-32 w-full justify-center rounded-xl bg-cover" style={{ backgroundImage: "url(\'https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80\')" }}>';
    }
    return line;
});

fs.writeFileSync('src/views/admin/profile/index.jsx', fixedLines.join('\n'));
