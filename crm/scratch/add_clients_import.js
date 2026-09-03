const fs = require('fs');

let cCode = fs.readFileSync('src/views/admin/clients/index.jsx', 'utf8');

if (!cCode.includes('import * as XLSX from "xlsx"')) {
   cCode = cCode.replace(
      'import { createClient } from "@supabase/supabase-js";',
      'import { createClient } from "@supabase/supabase-js";\nimport * as XLSX from "xlsx";\nimport { useRef } from "react";'
   );
   
   // Hook injections
   cCode = cCode.replace(
      'const [searchTerm, setSearchTerm] = useState("");',
      `const [searchTerm, setSearchTerm] = useState("");
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
             
             let status = row["STATUS"] || "Active";
             
             let createdAt = new Date().toISOString();
             if (row["CLIENT DATE"]) {
                 const parsed = new Date(row["CLIENT DATE"]);
                 if (!isNaN(parsed)) createdAt = parsed.toISOString();
             } else if (row["LEAD ARRIVING DATE"]) {
                 const parsed = new Date(row["LEAD ARRIVING DATE"]);
                 if (!isNaN(parsed)) createdAt = parsed.toISOString();
             }
             
             inserts.push({
                name: clientName,
                phone: row["PHONE NO."] || null,
                address: row["ADDRESS"] || null,
                company: row["COMPANY"] || null,
                created_at: createdAt,
                status: status,
                notes: row["REMARKS"] || null
             });
          }
          
          const { error } = await supabase.from('clients').insert(inserts);
          if (error) {
             alert("Import failed (Make sure you ran the SQL query to add missing columns!): " + error.message);
          } else {
             alert(\`Successfully imported \${inserts.length} clients!\`);
             fetchClients();
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
      const dataToExport = clients.map(c => ({
         "CLIENT DETAILS": c.name,
         "ADDRESS": c.address || "",
         "PHONE NO.": c.phone || "",
         "COMPANY": c.company || "",
         "CLIENT DATE": new Date(c.created_at).toLocaleDateString(),
         "STATUS": c.status,
         "REMARKS": c.notes || ""
      }));
      const ws = XLSX.utils.json_to_sheet(dataToExport);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Clients");
      XLSX.writeFile(wb, "Clients_Export.xlsx");
  };
`
   );

   // Header buttons replacement
   cCode = cCode.replace(
      /<button className="h-10 px-4 rounded-\[12px\] border border-\[\#E2E8F0\] bg-white text-\[14px\] font-bold text-\[\#0F172A\] hover:bg-gray-50 flex items-center gap-2 transition">\s*<MdCloudDownload \/> Export CSV\s*<\/button>/,
      `<input type="file" ref={fileInputRef} onChange={handleImport} accept=".csv, .xlsx, .xls" className="hidden" />
            <button onClick={() => fileInputRef.current.click()} disabled={importing} className="h-10 px-4 rounded-[12px] border border-[#E2E8F0] bg-white text-[14px] font-bold text-[#0F172A] hover:bg-gray-50 flex items-center gap-2 transition disabled:opacity-50">
              <MdCloudDownload /> {importing ? "Importing..." : "Import Excel"}
            </button>
            <button onClick={handleExport} className="h-10 px-4 rounded-[12px] border border-[#E2E8F0] bg-white text-[14px] font-bold text-[#0F172A] hover:bg-gray-50 flex items-center gap-2 transition">
              <MdCloudDownload /> Export Data
            </button>`
   );
   
   fs.writeFileSync('src/views/admin/clients/index.jsx', cCode);
}
