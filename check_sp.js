const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://gdzligxryodasaxnhdco.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    const { data: s } = await supabase.from('services').select('*').limit(1);
    const { data: p } = await supabase.from('projects').select('*').limit(1);
    console.log('Services cols:', s ? Object.keys(s[0]) : null);
    console.log('Projects cols:', p ? Object.keys(p[0]) : null);
}
check();
