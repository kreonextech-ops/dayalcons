const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://gdzligxryodasaxnhdco.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: leads } = await supabase.from('leads').select('*');
  for (let l of leads || []) {
      if (l.service_type && l.service_type.toLowerCase().includes('mutation')) {
          let updated = l.service_type.replace(/\(1\)\s*MUTATION/gi, "Mutation / Conversion");
          updated = updated.replace(/MUTATION/gi, "Mutation / Conversion");
          // cleanup double replacements just in case
          updated = updated.replace(/Mutation \/ Conversion \/ Conversion/gi, "Mutation / Conversion");
          
          if (l.service_type !== updated) {
             console.log(`Updating ${l.name} from "${l.service_type}" to "${updated}"`);
             await supabase.from('leads').update({ service_type: updated }).eq('id', l.id);
          }
      }
  }
}
check();
