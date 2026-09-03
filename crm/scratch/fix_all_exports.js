const fs = require('fs');

function fixDateExport(file) {
    if (!fs.existsSync(file)) return;
    let code = fs.readFileSync(file, 'utf8');
    
    code = code.replace(
       /"CLIENT DATE": new Date\(c\.created_at\)\.toLocaleDateString\(\),/g,
       '"CLIENT DATE": c.created_at ? new Date(c.created_at).toLocaleDateString() : "",'
    );
    code = code.replace(
       /"PROJECT DATE": new Date\(p\.created_at\)\.toLocaleDateString\(\),/g,
       '"PROJECT DATE": p.created_at ? new Date(p.created_at).toLocaleDateString() : "",'
    );
    code = code.replace(
       /"SERVICE DATE": new Date\(s\.created_at\)\.toLocaleDateString\(\),/g,
       '"SERVICE DATE": s.created_at ? new Date(s.created_at).toLocaleDateString() : "",'
    );
    
    fs.writeFileSync(file, code);
}

fixDateExport('src/views/admin/clients/index.jsx');
fixDateExport('src/views/admin/projects/index.jsx');
fixDateExport('src/views/admin/services/index.jsx');
