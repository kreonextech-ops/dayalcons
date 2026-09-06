const xlsx = require('xlsx');
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://gdzligxryodasaxnhdco.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg');

function parseDate(str, lastValidDate) {
  if (!str) return lastValidDate;
  str = String(str).trim();
  
  str = str.replace(/20266/g, '2026');
  str = str.replace(/20255/g, '2025');

  if (str.includes('.')) {
    let [d, m, y] = str.split('.');
    if (y && y.length === 2) y = '20' + y;
    let dNum = parseInt(d), mNum = parseInt(m), yNum = parseInt(y);
    if (!isNaN(dNum) && !isNaN(mNum) && !isNaN(yNum)) {
       return new Date(`${yNum}-${String(mNum).padStart(2,'0')}-${String(dNum).padStart(2,'0')}T12:00:00Z`);
    }
  }
  
  if (str.includes('/')) {
    let [m, d, y] = str.split('/');
    if (y && y.length === 2) y = '20' + y;
    let dNum = parseInt(d), mNum = parseInt(m), yNum = parseInt(y);
    if (!isNaN(dNum) && !isNaN(mNum) && !isNaN(yNum)) {
       if (mNum > 12) {
          let temp = mNum;
          mNum = dNum;
          dNum = temp;
       }
       return new Date(`${yNum}-${String(mNum).padStart(2,'0')}-${String(dNum).padStart(2,'0')}T12:00:00Z`);
    }
  }

  if (str.match(/^[a-zA-Z]{3}-\d{2}$/)) {
     const [mStr, yStr] = str.split('-');
     const yNum = parseInt(yStr) + 2000;
     const mNum = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'].indexOf(mStr.toLowerCase()) + 1;
     if (mNum > 0) return new Date(`${yNum}-${String(mNum).padStart(2,'0')}-01T12:00:00Z`);
  }
  
  return lastValidDate;
}

(async () => {
  console.log('Fetching all IDs to delete...');
  const { data: leadsToDelete } = await supabase.from('leads').select('id');
  for(let i=0; i<leadsToDelete.length; i+=100) {
     const ids = leadsToDelete.slice(i, i+100).map(l => l.id);
     await supabase.from('leads').delete().in('id', ids);
  }

  const { data: clientsToDelete } = await supabase.from('clients').select('id');
  for(let i=0; i<clientsToDelete.length; i+=100) {
     const ids = clientsToDelete.slice(i, i+100).map(c => c.id);
     await supabase.from('clients').delete().in('id', ids);
  }
  console.log('Wipe complete.');

  const workbook = xlsx.readFile('C:/Users/Mr/Downloads/crm.xlsx');
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const json = xlsx.utils.sheet_to_json(sheet, { defval: '', raw: false, range: 1 });

  const leads = [], clients = [];
  let lastValid = new Date('2024-01-01T12:00:00Z');

  json.forEach(row => {
    if(!row['CLIENT DETAILS']) return;
    const r = (row['REMARKS']||'').toUpperCase().trim();
    
    let dateStr = row['LEAD ARRIVING DATE'] || '';
    let parsedD = parseDate(dateStr, lastValid);
    if (!isNaN(parsedD) && parsedD) lastValid = parsedD;
    let createdAt = lastValid.toISOString();
    
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
