const fs = require('fs');
let code = fs.readFileSync('src/views/admin/crm/LeadDetail.jsx', 'utf8');

code = code.replace(
  'await supabase.from("leads").update({ lead_temperature: newTemp }).eq("id", leadData.id);',
  'const {error} = await supabase.from("leads").update({ lead_temperature: newTemp }).eq("id", leadData.id); if (error) { alert("Failed to update temperature: " + error.message); }'
);

fs.writeFileSync('src/views/admin/crm/LeadDetail.jsx', code);
