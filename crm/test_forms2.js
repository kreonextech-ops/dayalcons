const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://gdzligxryodasaxnhdco.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg"
);

async function run() {
  console.log("Testing Homepage Bottom Form (ContactSection.tsx)...");
  const res1 = await supabase.from('leads').insert([{
    name: 'Auto-Test Homepage Form',
    email: 'test1@dayalcons.com',
    phone: '0000000001',
    source: 'Website Contact',
    status: 'New',
    lead_temperature: 'Warm',
  }]);
  console.log("Homepage form result:", res1.error ? res1.error.message : "SUCCESS!");

  console.log("Testing Main Contact Us Page Form (contact/page.tsx)...");
  const res2 = await supabase.from('leads').insert([{
    name: 'Auto-Test Contact Page',
    email: 'test2@dayalcons.com',
    phone: '0000000002',
    source: 'Website Contact Page',
    status: 'New',
    lead_temperature: 'Warm',
  }]);
  console.log("Contact Us page result:", res2.error ? res2.error.message : "SUCCESS!");
}
run();
