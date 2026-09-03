const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://gdzligxryodasaxnhdco.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg'
);

const ADMIN_ID = '91d9c66b-118d-4a3a-8bd5-fc1288bd93ce';

async function clearAll() {
  console.log('🧹 Starting data wipe...\n');

  // 1. tasks (may have FK to leads, clients, projects, services, employees)
  let res = await supabase.from('tasks').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  console.log('tasks deleted:', res.error ? res.error.message : '✅ done');

  // 2. documents
  res = await supabase.from('documents').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  console.log('documents deleted:', res.error ? res.error.message : '✅ done');

  // 3. services
  res = await supabase.from('services').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  console.log('services deleted:', res.error ? res.error.message : '✅ done');

  // 4. projects
  res = await supabase.from('projects').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  console.log('projects deleted:', res.error ? res.error.message : '✅ done');

  // 5. leads (before clients in case of FK)
  res = await supabase.from('leads').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  console.log('leads deleted:', res.error ? res.error.message : '✅ done');

  // 6. clients
  res = await supabase.from('clients').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  console.log('clients deleted:', res.error ? res.error.message : '✅ done');

  // 7. employees (skip the admin)
  res = await supabase.from('employees').delete().neq('id', ADMIN_ID);
  console.log('employees deleted (kept Admin):', res.error ? res.error.message : '✅ done');

  console.log('\n✅ All test data wiped. Admin account preserved.');

  // Verify counts
  console.log('\n📊 Final counts:');
  const tables = ['employees','leads','clients','services','projects','tasks','documents'];
  for (const t of tables) {
    const { count } = await supabase.from(t).select('*', { count: 'exact', head: true });
    console.log(`  ${t}: ${count}`);
  }
}

clearAll();
