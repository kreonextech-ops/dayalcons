const fs = require('fs');
let code = fs.readFileSync('src/views/admin/clients/index.jsx', 'utf8');

const importLogicToReplace = `          const inserts = [];
          for (const row of json) {`;

const newImportLogic = `          // Fetch employees to map "FOLLOW BY" correctly
          const { data: empData } = await supabase.from('employees').select('id, name');
          const empMap = {};
          if (empData) {
             empData.forEach(emp => {
                if (emp.name) {
                   empMap[emp.name.toLowerCase().trim()] = emp.id;
                }
             });
          }

          const inserts = [];
          for (const row of json) {`;

code = code.replace(importLogicToReplace, newImportLogic);

const assignedToReplace = `                notes: row["REMARKS"] || null
             });`;

const newAssignedTo = `                notes: row["REMARKS"] || null,
                assigned_to: (row["FOLLOW BY"] && empMap[row["FOLLOW BY"].toLowerCase().trim()]) ? empMap[row["FOLLOW BY"].toLowerCase().trim()] : null
             });`;

code = code.replace(assignedToReplace, newAssignedTo);
fs.writeFileSync('src/views/admin/clients/index.jsx', code);
