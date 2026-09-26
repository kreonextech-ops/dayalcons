const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(
  "https://gdzligxryodasaxnhdco.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg"
);

async function run() {
  // Check which clients actually have EMPTY phone/address in the DB
  const { data: empty } = await supabase
    .from("clients")
    .select("id, name, phone, address, created_at")
    .is("phone", null)
    .order("created_at", { ascending: false });

  console.log(`\nClients with NULL phone in DB (${empty?.length}):`);
  empty?.forEach(c => {
    console.log(`  - ${c.name} | address: ${c.address || "NULL"} | created: ${c.created_at?.split("T")[0]}`);
  });

  const { data: emptyAddr } = await supabase
    .from("clients")
    .select("id, name, phone, address, created_at")
    .is("address", null)
    .order("created_at", { ascending: false });

  console.log(`\nClients with NULL address in DB (${emptyAddr?.length}):`);
  emptyAddr?.slice(0,10).forEach(c => {
    console.log(`  - ${c.name} | phone: ${c.phone || "NULL"} | created: ${c.created_at?.split("T")[0]}`);
  });
}
run();
