const fs = require('fs');
let code = fs.readFileSync('src/views/admin/clients/index.jsx', 'utf8');

const exportReplace = `        const dataToExport = filtered.map(l => ({
           "CLIENT DETAILS": l.name,
           "PHONE NO.": l.phone || "",
           "ADDRESS": l.address || "",
           "COMPANY": l.company || "",
           "CLIENT DATE": new Date(l.created_at).toLocaleDateString(),
           "STATUS": l.status,
           "REMARKS": l.notes || ""
        }));`;

const newExport = `        const { data: empData } = await supabase.from('employees').select('id, name');
        const empIdMap = {};
        if (empData) {
           empData.forEach(emp => {
              empIdMap[emp.id] = emp.name;
           });
        }
        
        const dataToExport = filtered.map(l => ({
           "CLIENT DETAILS": l.name,
           "PHONE NO.": l.phone || "",
           "ADDRESS": l.address || "",
           "COMPANY": l.company || "",
           "CLIENT DATE": new Date(l.created_at).toLocaleDateString(),
           "STATUS": l.status,
           "FOLLOW BY": (l.assigned_to && empIdMap[l.assigned_to]) ? empIdMap[l.assigned_to] : (l.assigned_to || ""),
           "REMARKS": l.notes || ""
        }));`;

code = code.replace(exportReplace, newExport);
fs.writeFileSync('src/views/admin/clients/index.jsx', code);
