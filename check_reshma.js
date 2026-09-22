const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://gdzligxryodasaxnhdco.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    const { data: reshma } = await supabase.from('employees').select('*').ilike('name', '%reshma%').limit(1);
    console.log('Reshma:', reshma);

    if (reshma && reshma.length > 0) {
        const r = reshma[0];
        const orQuery = `assigned_to.ilike.%${r.id}%,assigned_to.ilike.%${r.role}%`;
        const { data: leads } = await supabase.from('leads').select('id, name, assigned_to').or(orQuery);
        console.log('Leads fetched for Reshma:', leads ? leads.length : 'error');
        // Let's also check JUST by id
        const { data: leadsId } = await supabase.from('leads').select('id, name, assigned_to').ilike('assigned_to', `%${r.id}%`);
        console.log('Leads assigned specifically by ID:', leadsId ? leadsId.length : 'error');
    }
}
check();
