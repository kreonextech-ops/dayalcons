const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(
  "https://gdzligxryodasaxnhdco.supabase.co",
  process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg"
);

async function run() {
  const users = [
    {
      name: "Amit Admin",
      email: "amitsz3675@gmail.com",
      role: "Admin",
      designation: "Administrator",
      password: "Password@123",
      is_active: true,
      department: "Management",
      status: "Active"
    },
    {
      name: "Test Employee",
      email: "test.employee.crm@gmail.com",
      role: "Employee",
      designation: "Tester",
      password: "Password@123",
      is_active: true,
      department: "Testing",
      status: "Active"
    }
  ];

  for (const u of users) {
    const { data, error } = await supabase.from("employees").insert([u]).select();
    if (error) {
      console.log(`Failed to add ${u.email}:`, error.message);
    } else {
      console.log(`Added ${u.email}`);
    }
  }
}
run();
