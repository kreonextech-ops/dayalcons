const fs = require('fs');
let code = fs.readFileSync('src/utils/r2Storage.js', 'utf8');

// Replace Body: file with Body: new Uint8Array(await file.arrayBuffer())
const oldBody = 'Body: file,';
const newBody = 'Body: new Uint8Array(await file.arrayBuffer()),';

if (code.includes(oldBody)) {
    code = code.replace(oldBody, newBody);
} else {
    console.log("Could not find Body: file, in r2Storage.js");
}

fs.writeFileSync('src/utils/r2Storage.js', code);
