const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(
  "https://gdzligxryodasaxnhdco.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg"
);

async function run() {
  // Get recent clients and check what fields actually have data
  const { data, error } = await supabase
    .from("clients")
    .select("id, name, phone, email, address, assigned_to, created_at")
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) { console.error(error); return; }
  
  console.log("\nRecent Clients - Phone/Email/Address in DB:");
  data.forEach(c => {
    console.log({
      name: c.name,
      phone: c.phone || "EMPTY",
      email: c.email || "EMPTY",
      address: c.address || "EMPTY",
      assigned_to: c.assigned_to || "UNASSIGNED"
    });
  });
}
run();
