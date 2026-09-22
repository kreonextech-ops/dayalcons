const fs = require('fs');
const { execSync } = require('child_process');

console.log('--- Building CRM ---');
execSync('npm install --legacy-peer-deps --include=dev', { cwd: './crm', stdio: 'inherit' });
execSync('npm run build', { 
  cwd: './crm', 
  stdio: 'inherit',
  env: { ...process.env, CI: 'false' } 
});

console.log('--- Copying CRM to public/crm ---');
fs.rmSync('./public/crm', { recursive: true, force: true });
// cpSync is available in Node 16+
fs.cpSync('./crm/build', './public/crm', { recursive: true });

console.log('--- Building Next.js ---');
execSync('npx next build', { stdio: 'inherit' });
