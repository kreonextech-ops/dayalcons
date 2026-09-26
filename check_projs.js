const { createClient } = require("@supabase/supabase-js");
const supabase = createClient("https://gdzligxryodasaxnhdco.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg");

async function run() {
    const { data: projects } = await supabase.from("projects").select("id, name, description").ilike("name", "%Construction%");
    console.log(projects.slice(0, 5));
}
run();
