const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(
  "https://gdzligxryodasaxnhdco.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg"
);

async function run() {
  // Get CRO employee record (exactly as stored in DB)
  const { data: cro } = await supabase
    .from("employees")
    .select("id, name, role, designation, is_active")
    .eq("email", "chhetrireshma559@gmail.com")
    .single();
  
  console.log("CRO Employee record:", JSON.stringify(cro, null, 2));

  // Simulate the isAdmin check exactly as code does it
  const loggedInUser = cro;
  const isAdmin = loggedInUser?.role === 'Admin' 
    || loggedInUser?.role === 'CRO' 
    || (loggedInUser?.designation && loggedInUser.designation.includes('OAS'));
  
  console.log("\nisAdmin result for CRO:", isAdmin);
  
  // Simulate what query she would get
  let query = supabase.from("clients").select("*").order('created_at', { ascending: false });
  if (!isAdmin && loggedInUser?.id) {
    console.log("\nFiltering by assigned_to:", loggedInUser.id);
    query = query.like('assigned_to', `%${loggedInUser.id}%`);
  } else {
    console.log("\nNo filter - sees ALL clients");
  }
  
  const { data: clients, error } = await query;
  if (error) { console.error(error); return; }
  console.log(`\nClients returned for CRO: ${clients.length}`);
  clients.slice(0,5).forEach(c => {
    console.log({ name: c.name, phone: c.phone || "EMPTY", address: c.address || "EMPTY", assigned_to: c.assigned_to || "NULL" });
  });
}
run();
