const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://gdzligxryodasaxnhdco.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    const reshmaId = 'b953c1aa-58f1-4ce2-9952-e19c3498a864';
    const { data: leads } = await supabase.from('leads').select('id, name, assigned_to').ilike('assigned_to', `%${reshmaId}%`);
    const { data: tasks } = await supabase.from('tasks').select('id, title, assignee_id').eq('assignee_id', reshmaId);
    console.log('Leads assigned to Reshma (UUID):', leads ? leads.length : 0);
    console.log('Tasks assigned to Reshma:', tasks ? tasks.length : 0);
}
check();
