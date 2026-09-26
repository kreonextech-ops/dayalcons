const { createClient } = require("@supabase/supabase-js");
const supabase = createClient("https://gdzligxryodasaxnhdco.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg");

async function run() {
    const { data: emps } = await supabase.from("employees").select("*").ilike("name", "%amit%");
    console.log("Employees:", emps?.map(e => e.id + " - " + e.name) || []);

    const { data: leads } = await supabase.from("leads").select("*").ilike("name", "%amit%");
    console.log("Leads:", leads?.map(l => l.id + " - " + l.name) || []);

    const { data: clients } = await supabase.from("clients").select("*").ilike("name", "%amit%");
    console.log("Clients:", clients?.map(c => c.id + " - " + c.name) || []);
}
run();
