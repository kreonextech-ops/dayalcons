const xlsx = require('xlsx');
const workbook = xlsx.readFile('C:/Users/Mr/Downloads/crm.xlsx');
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const json = xlsx.utils.sheet_to_json(sheet, { defval: '', raw: false, range: 1 });

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

let lastValid = new Date('2024-01-01T12:00:00Z');
for (const row of json) {
   if (!row['CLIENT DETAILS']) continue;
   let str = row['LEAD ARRIVING DATE'] || '';
   let d = parseDate(str, lastValid);
   if (!isNaN(d) && d) {
      lastValid = d;
      // print a few to verify
      if (row['CLIENT DETAILS'].includes('AJEET') || row['CLIENT DETAILS'].includes('SAMRAT') || row['CLIENT DETAILS'].includes('AJIJAR') || row['CLIENT DETAILS'].includes('BASUDEB') || row['CLIENT DETAILS'].includes('UMANG')) {
         console.log(row['CLIENT DETAILS'], 'RAW:', str, 'PARSED:', d.toISOString());
      }
   }
}
