const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://gdzligxryodasaxnhdco.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkNames() {
    const queries = [
        'Mamani', 
        'Mastaba', 'Mojtaba', 'Mujtaba', 'Mastafajur', 
        'Chanchal Barman', 
        'Rupa Hazari', 
        'Suraj Thapa', 
        'Nikam Tamang', 'Nikam'
    ];

    console.log('Checking database for names...');
    
    const { data, error } = await supabase.from('clients').select('name');
    
    if (error) {
        console.error('Error fetching clients:', error);
        return;
    }
    
    const clientNames = data.map(d => d.name.toLowerCase());
    
    const targetNames = [
        'Mamani Basmali',
        'Mastaba Juri Alam (or Mojtaba / Mujtaba / Mastafajur)',
        'Dr. Chanchal Barman',
        'Rupa Hazari',
        'Suraj Thapa',
        'Nikam Tamang'
    ];
    
    const results = {};
    
    targetNames.forEach(target => {
        // Simple heuristic matching
        const parts = target.toLowerCase().replace(/dr\.|or|\/|\(|\)/g, '').split(' ').filter(p => p.length > 2);
        
        let found = false;
        let matchedName = '';
        
        for (const dbName of clientNames) {
            for (const part of parts) {
                if (dbName.includes(part)) {
                    found = true;
                    matchedName = data.find(d => d.name.toLowerCase() === dbName).name;
                    break;
                }
            }
            if (found) break;
        }
        
        results[target] = found ? Found as:  : 'Missing';
    });
    
    console.table(results);
}

checkNames();
