const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://gdzligxryodasaxnhdco.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: leads } = await supabase.from('leads').select('name, service_type');
  console.log("LEADS:");
  for (let l of leads || []) {
      if (l.service_type && l.service_type.toLowerCase().includes('mutation')) {
          console.log(l.name, '=>', l.service_type);
      }
  }
}
check();
