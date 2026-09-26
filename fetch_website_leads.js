require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY
);

async function run() {
  const { data, error } = await supabase.from('leads').select('name, phone, email, source, created_at').in('source', ['Website Contact', 'Website', 'website', 'Website Form']);
  if (error) {
    console.error(error);
  } else {
    console.log(JSON.stringify(data, null, 2));
  }
}
run();
