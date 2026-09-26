const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://gdzligxryodasaxnhdco.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('leads').select('*').limit(1);
  if (error) {
     console.log("Error:", error);
  } else if (data && data.length > 0) {
     console.log("Columns:", Object.keys(data[0]));
  }
}
check();
