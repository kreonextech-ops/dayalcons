const fs = require('fs');
let code = fs.readFileSync('src/views/admin/crm/components/TabDocuments.jsx', 'utf8');

// We need to rewrite processFiles to actually upload to R2 and Supabase.
// First, add imports if not present.
if (!code.includes('uploadFileToR2')) {
    code = code.replace(
        'import { createClient } from "@supabase/supabase-js";',
        `import { createClient } from "@supabase/supabase-js";
import { uploadFileToR2, getR2FileUrl, deleteR2File } from "utils/r2Storage";`
    );
}

// Rewrite processFiles
const processFilesRegex = /const processFiles = \(files\) => \{\s*if \(files\.length > 0\) \{\s*const newDocs = files\.map\(f => \(\{\s*id: Date\.now\(\) \+ Math\.random\(\),\s*name: f\.name,\s*size: \(f\.size \/ 1024\)\.toFixed\(2\) \+ " KB",\s*date: new Date\(\)\.toLocaleDateString\(\),\s*folderId: activeFolder \? activeFolder\.id : null,\s*category: "General",\s*uploadedBy: "Current User"\s*\}\)\);\s*setDocuments\(\[\.\.\.documents, \.\.\.newDocs\]\);\s*\}\s*\};/m;

const newProcessFiles = `
  const processFiles = async (files) => {
     if (files.length > 0) {
        let uploadedDocs = [];
        
        for (const file of files) {
            try {
                // Upload to R2
                const fileKey = await uploadFileToR2(file, 'clients/documents');
                
                // Insert into Supabase (documents table)
                const { data, error } = await supabase.from('documents').insert([{
                    client_id: leadData?.id || null, // Ensure we tie it to the client
                    name: file.name,
                    file_url: fileKey
                }]).select();
                
                if (data && data[0]) {
                    uploadedDocs.push({
                       id: data[0].id,
                       name: data[0].name,
                       size: (file.size / 1024).toFixed(2) + " KB",
                       date: new Date(data[0].created_at).toLocaleDateString(),
                       folderId: activeFolder ? activeFolder.id : null,
                       category: "General",
                       uploadedBy: "Current User",
                       file_url: data[0].file_url
                    });
                }
            } catch (err) {
                console.error("Failed to upload document", err);
                alert("Failed to upload " + file.name + ". Ensure Cloudflare CORS is configured.");
            }
        }
        
        if (uploadedDocs.length > 0) {
            setDocuments([...documents, ...uploadedDocs]);
        }
     }
  };
`;

code = code.replace(processFilesRegex, newProcessFiles);

// Now rewrite the "fetch" logic on mount to load from DB
// Currently there is no useEffect for fetching in TabDocuments, it initializes state with `[]`
const stateInitRegex = /const \[documents, setDocuments\] = useState\(\[\]\);/;
const stateInitWithFetch = `const [documents, setDocuments] = useState([]);
  
  useEffect(() => {
     const fetchDocs = async () => {
        if (!leadData?.id) return;
        const { data } = await supabase.from('documents').select('*').eq('client_id', leadData.id);
        if (data) {
           const mapped = data.map(d => ({
              id: d.id,
              name: d.name,
              size: "—",
              date: new Date(d.created_at).toLocaleDateString(),
              folderId: null,
              category: "General",
              uploadedBy: "System",
              file_url: d.file_url
           }));
           setDocuments(mapped);
        }
     };
     fetchDocs();
  }, [leadData]);
`;

code = code.replace(stateInitRegex, stateInitWithFetch);

// Now update the delete handler and download handler
// The rows in table have: onClick={() => setDocuments(documents.filter(doc => doc.id !== d.id))}
const deleteRegex = /<MdDelete className="cursor-pointer hover:text-red-500 inline-block" onClick=\{[^}]+\} \/>/g;
code = code.replace(deleteRegex, `<MdDelete className="cursor-pointer hover:text-red-500 inline-block" onClick={async (e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this document?")) return;
    try {
       await deleteR2File(d.file_url);
       await supabase.from('documents').delete().eq('id', d.id);
       setDocuments(documents.filter(doc => doc.id !== d.id));
    } catch (err) {
       alert("Failed to delete.");
    }
}} />`);

// Make rows clickable to download
const trRegex = /<tr key=\{d\.id\} className="border-b border-\[\#EDF2F7\] hover:bg-gray-50 transition">/g;
code = code.replace(trRegex, `<tr key={d.id} className="border-b border-[#EDF2F7] hover:bg-gray-50 transition cursor-pointer" onClick={async () => {
    try {
       const url = await getR2FileUrl(d.file_url);
       window.open(url, "_blank");
    } catch (e) {
       alert("Failed to open file.");
    }
}}>`);

fs.writeFileSync('src/views/admin/crm/components/TabDocuments.jsx', code);
