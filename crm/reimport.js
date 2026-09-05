const xlsx = require('xlsx');
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://gdzligxryodasaxnhdco.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg');

(async () => {
  console.log('Deleting existing records...');
  await supabase.from('leads').delete().neq('id', 0);
  await supabase.from('clients').delete().neq('id', 0);

  const workbook = xlsx.readFile('C:/Users/Mr/Downloads/crm.xlsx');
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const json = xlsx.utils.sheet_to_json(sheet, { defval: '', raw: false, range: 1 });

  const leads = [], clients = [];
  json.forEach(row => {
    if(!row['CLIENT DETAILS']) return;
    const r = (row['REMARKS']||'').toUpperCase().trim();
    
    let createdAt = new Date().toISOString();
    let dateStr = row['LEAD ARRIVING DATE'] || '';
    if (dateStr) {
        if (dateStr.includes('.')) {
           const [d, m, y] = dateStr.split('.');
           if (d && m && y) {
              const parsed = new Date(`${y}-${m}-${d}T12:00:00Z`);
              if (!isNaN(parsed)) createdAt = parsed.toISOString();
           }
        } else if (dateStr.includes('/')) {
           const parts = dateStr.split('/');
           // Assuming DD/MM/YYYY
           if (parts.length === 3) {
              const parsed = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T12:00:00Z`);
              if (!isNaN(parsed)) createdAt = parsed.toISOString();
           }
        } else {
           const parsed = new Date(dateStr);
           if (!isNaN(parsed)) createdAt = parsed.toISOString();
        }
    }
    
    if(r==='SUCCESS') clients.push({
        name: row['CLIENT DETAILS'],
        status:'Active',
        created_at: createdAt
    });
    else leads.push({
        name: row['CLIENT DETAILS'],
        phone: row['PHONE NO.'] || null,
        address: row['ADDRESS'] || null,
        source: row['SOURCE'] || null,
        service_type: row['REQUIREMENT'] || null,
        created_at: createdAt,
        status: (r === 'CLOSED' ? 'Lost' : (r === 'ONGOING' ? 'Contacted' : 'New')),
        lead_temperature: (r.includes('HOT') ? 'Hot' : (r.includes('WARM') ? 'Warm' : 'Cold')),
        assigned_to: row['FOLLOW BY'] || null,
        notes: row['REMARKS'] || null
    });
  });

  console.log('Leads:', leads.length, 'Clients:', clients.length);
  
  for(let i=0; i<leads.length; i+=100) {
      let chunk = leads.slice(i, i+100);
      let res = await supabase.from('leads').insert(chunk);
      if(res.error) console.error(res.error);
  }
  for(let i=0; i<clients.length; i+=100) {
      let chunk = clients.slice(i, i+100);
      let res = await supabase.from('clients').insert(chunk);
      if(res.error) console.error(res.error);
  }
  console.log('Re-import Done!');
})();
