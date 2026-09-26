const { createClient } = require("@supabase/supabase-js");
const supabase = createClient("https://gdzligxryodasaxnhdco.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg");

async function run() {
    await supabase.from("employees").delete().eq("id", "6d627fac-9f3f-4dcc-9878-23c4c39c918b");
    console.log("Deleted Amit (Tester)");
}
run();
