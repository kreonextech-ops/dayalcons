const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://gdzligxryodasaxnhdco.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    const employeeId = '6d627fac-9f3f-4dcc-9878-23c4c39c918b';
    const employeeRole = 'CRO';
    const orQuery = `assigned_to.ilike.%${employeeId}%,assigned_to.ilike.%${employeeRole}%`;
    const { data, error } = await supabase.from('leads').select('id, assigned_to').or(orQuery);
    console.log(data ? data.length : null, error);
}
check();
