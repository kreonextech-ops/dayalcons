const fs = require('fs');

let lCode = fs.readFileSync('src/views/admin/crm/index.jsx', 'utf8');

if (!lCode.includes('import * as XLSX from "xlsx"')) {
   lCode = lCode.replace(
      'import { createClient } from "@supabase/supabase-js";',
      'import { createClient } from "@supabase/supabase-js";\nimport * as XLSX from "xlsx";\nimport { useRef } from "react";'
   );
   
   // Hook injections
   lCode = lCode.replace(
      'const [convertLeadData, setConvertLeadData] = useState(null);',
      `const [convertLeadData, setConvertLeadData] = useState(null);
  const fileInputRef = useRef(null);
  const [importing, setImporting] = useState(false);

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImporting(true);
    try {
      const reader = new FileReader();
      reader.onload = async (evt) => {
        try {
          const data = evt.target.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });

          const inserts = [];
          for (const row of json) {
             const clientName = row["CLIENT DETAILS"];
             if (!clientName) continue;
             
             let leadTemp = "Cold";
             let status = row["STATUS"] || "New";
             const rawStatus = status.toUpperCase();
             if (rawStatus.includes("HOT")) { leadTemp = "Hot"; status = "New"; }
             else if (rawStatus.includes("WARM")) { leadTemp = "Warm"; status = "New"; }
             else if (rawStatus.includes("COLD")) { leadTemp = "Cold"; status = "New"; }
             
             let createdAt = new Date().toISOString();
             if (row["LEAD ARRIVING DATE"]) {
                 const parsed = new Date(row["LEAD ARRIVING DATE"]);
                 if (!isNaN(parsed)) createdAt = parsed.toISOString();
             }
             
             inserts.push({
                name: clientName,
                phone: row["PHONE NO."] || null,
                address: row["ADDRESS"] || null,
                source: row["SOURCE"] || null,
                service_type: row["REQUIREMENT"] || null,
                created_at: createdAt,
                status: status,
                lead_temperature: leadTemp,
                assigned_to: row["FOLLOW BY"] || null,
                notes: row["REMARKS"] || null
             });
          }
          
          const { error } = await supabase.from('leads').insert(inserts);
          if (error) {
             alert("Import failed (Make sure you ran the SQL query to add missing columns!): " + error.message);
          } else {
             alert(\`Successfully imported \${inserts.length} leads!\`);
             fetchLeads();
          }
        } catch (innerErr) {
          alert("Parse error: " + innerErr.message);
        }
        setImporting(false);
        e.target.value = null; // reset input
      };
      reader.readAsBinaryString(file);
    } catch(err) {
      alert("Error reading file.");
      setImporting(false);
      e.target.value = null;
    }
  };

  const handleExport = () => {
      const dataToExport = leads.map(l => ({
         "CLIENT DETAILS": l.name,
         "ADDRESS": l.address || "",
         "PHONE NO.": l.phone || "",
         "SOURCE": l.source || "",
         "REQUIREMENT": l.service_type || "",
         "LEAD ARRIVING DATE": new Date(l.created_at).toLocaleDateString(),
         "STATUS": l.status,
         "TEMPERATURE": l.lead_temperature || "",
         "FOLLOW BY": l.assigned_to || "",
         "REMARKS": l.notes || ""
      }));
      const ws = XLSX.utils.json_to_sheet(dataToExport);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Leads");
      XLSX.writeFile(wb, "Leads_Export.xlsx");
  };
`
   );

   // Header buttons replacement
   lCode = lCode.replace(
      /<button className="h-10 px-4 rounded-\[12px\] border border-\[\#E2E8F0\] bg-white text-\[14px\] font-bold text-\[\#0F172A\] hover:bg-gray-50 flex items-center gap-2 transition">\s*<MdCloudDownload \/> Import Leads\s*<\/button>/,
      `<input type="file" ref={fileInputRef} onChange={handleImport} accept=".csv, .xlsx, .xls" className="hidden" />
            <button onClick={() => fileInputRef.current.click()} disabled={importing} className="h-10 px-4 rounded-[12px] border border-[#E2E8F0] bg-white text-[14px] font-bold text-[#0F172A] hover:bg-gray-50 flex items-center gap-2 transition disabled:opacity-50">
              <MdCloudDownload /> {importing ? "Importing..." : "Import Excel"}
            </button>
            <button onClick={handleExport} className="h-10 px-4 rounded-[12px] border border-[#E2E8F0] bg-white text-[14px] font-bold text-[#0F172A] hover:bg-gray-50 flex items-center gap-2 transition">
              <MdCloudDownload /> Export Data
            </button>`
   );
   
   fs.writeFileSync('src/views/admin/crm/index.jsx', lCode);
}
