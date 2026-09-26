const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://gdzligxryodasaxnhdco.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg';
const supabase = createClient(supabaseUrl, supabaseKey);

async function fixData() {
  console.log("Fixing leads...");
  const { data: leads } = await supabase.from('leads').select('*');
  for (let lead of leads || []) {
    let changed = false;
    let newServices = [];
    
    // Parse service_type which might be a comma separated string
    if (lead.service_type) {
       const types = lead.service_type.split(',').map(s => s.trim());
       for (let t of types) {
          if (t === "Mutation" || t === "Land Registration & Mutation") {
             // Depending on how they meant it, they might just have meant Mutation.
             // If they had "Mutation", we change it to "Mutation / Conversion"
             newServices.push("Mutation / Conversion");
             changed = true;
          } else if (t === "Land Registration") {
             newServices.push("Land Registration");
          } else {
             newServices.push(t);
          }
       }
       
       // Handle the case where they used the old combined one
       if (types.includes("Land Registration & Mutation")) {
          if (!newServices.includes("Land Registration")) {
             newServices.push("Land Registration");
          }
       }
    }
    
    if (changed) {
       const finalStr = [...new Set(newServices)].join(', ');
       console.log(`Updating lead ${lead.name} from "${lead.service_type}" to "${finalStr}"`);
       await supabase.from('leads').update({ service_type: finalStr }).eq('id', lead.id);
    }
  }

  console.log("Fixing clients...");
  const { data: clients } = await supabase.from('clients').select('*');
  for (let client of clients || []) {
    let changed = false;
    let newServices = [];
    
    if (client.work_types) {
       const types = client.work_types.split(',').map(s => s.trim());
       for (let t of types) {
          if (t === "Mutation" || t === "Land Registration & Mutation") {
             newServices.push("Mutation / Conversion");
             changed = true;
          } else {
             newServices.push(t);
          }
       }
       
       if (types.includes("Land Registration & Mutation") && !newServices.includes("Land Registration")) {
          newServices.push("Land Registration");
       }
    }
    
    if (changed) {
       const finalStr = [...new Set(newServices)].join(', ');
       console.log(`Updating client ${client.name} from "${client.work_types}" to "${finalStr}"`);
       await supabase.from('clients').update({ work_types: finalStr }).eq('id', client.id);
    }
  }

  console.log("Fixing services table...");
  const { data: services } = await supabase.from('services').select('*');
  for (let s of services || []) {
     if (s.service_name === "Mutation" || s.service_name === "Land Registration & Mutation") {
         console.log(`Updating service ${s.title} (${s.service_name})`);
         await supabase.from('services').update({ service_name: "Mutation / Conversion" }).eq('id', s.id);
     }
  }
  
  console.log("Done!");
}
fixData();
