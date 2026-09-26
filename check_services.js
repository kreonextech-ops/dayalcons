const { createClient } = require("@supabase/supabase-js");
const supabase = createClient("https://gdzligxryodasaxnhdco.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg");

async function run() {
    const { data: services, error: sErr } = await supabase.from("services").select("*");
    if (sErr) console.log(sErr);
    else if (services.length > 0) console.log("Service keys:", Object.keys(services[0]));
    
    const { data: projects, error: pErr } = await supabase.from("projects").select("*");
    if (pErr) console.log(pErr);
    else if (projects.length > 0) console.log("Project keys:", Object.keys(projects[0]));
    
    console.log("Services:", [...new Set(services?.map(s => s.title))]);
    console.log("Projects:", [...new Set(projects?.map(p => p.name))]);
}
run();
