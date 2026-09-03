const fs = require('fs');
let code = fs.readFileSync('src/views/admin/clients/ClientDetail.jsx', 'utf8');

// Add imports
if (!code.includes('uploadFileToR2')) {
    code = code.replace(
        'import { createClient } from "@supabase/supabase-js";',
        `import { createClient } from "@supabase/supabase-js";
import { uploadFileToR2, getR2FileUrl, deleteR2File } from "utils/r2Storage";`
    );
}

// Add state and refs inside ClientDetail component
if (!code.includes('const [agreements, setAgreements]')) {
    code = code.replace(
        'const [clientData, setClientData] = useState(client);',
        `const [clientData, setClientData] = useState(client);
    const [agreements, setAgreements] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);
    
    useEffect(() => {
       const fetchAgreements = async () => {
          if (!clientData.id) return;
          const { data } = await supabase.from('documents').select('*').eq('client_id', clientData.id);
          if (data) setAgreements(data);
       };
       fetchAgreements();
    }, [clientData.id]);
    
    const handleUploadClick = () => { fileInputRef.current?.click(); };
    
    const handleFileChange = async (e) => {
       const file = e.target.files[0];
       if (!file || !clientData.id) return;
       setIsUploading(true);
       
       try {
           const fileKey = await uploadFileToR2(file, 'clients');
           const { data, error } = await supabase.from('documents').insert([{
              client_id: clientData.id,
              name: file.name,
              file_url: fileKey
           }]).select();
           
           if (data) setAgreements([...agreements, data[0]]);
       } catch (err) {
           console.error("Upload failed", err);
           alert("Upload failed. Ensure R2 keys are set.");
       }
       setIsUploading(false);
       e.target.value = null;
    };
    
    const handleDownload = async (fileKey) => {
        try {
            const url = await getR2FileUrl(fileKey);
            window.open(url, "_blank");
        } catch (e) {
            alert("Download failed.");
        }
    };
    
    const handleDeleteFile = async (docId, fileKey) => {
        if (!window.confirm("Delete this agreement?")) return;
        try {
            await deleteR2File(fileKey);
            await supabase.from('documents').delete().eq('id', docId);
            setAgreements(agreements.filter(a => a.id !== docId));
        } catch (e) {
            alert("Delete failed.");
        }
    };
    `
    );
}

// Replace the Master Contracts card
const oldCardRegex = /<Card extra="p-6">\s*<div className="flex justify-between items-center mb-4">\s*<h3 className="text-\[16px\] font-semibold text-\[\#0F172A\]">Master Contracts & Agreements<\/h3>\s*<button className="text-sm font-bold text-\[\#16A34A\] hover:underline">Upload NDA\/MSA<\/button>\s*<\/div>\s*<div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed \n?border-\[\#E2E8F0\] rounded-xl bg-gray-50">\s*<MdFolder className="text-4xl text-gray-300 mb-2" \/>\s*<p className="text-sm text-\[\#64748B\]">No master agreements uploaded yet\.<\/p>\s*<\/div>\s*<\/Card>/m;

// Because regex across multiple lines with whitespace is tricky, let's just do a string replace of the exact block we found earlier.
const oldCard = `<Card extra="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-[16px] font-semibold text-[#0F172A]">Master Contracts & Agreements</h3>
                      <button className="text-sm font-bold text-[#16A34A] hover:underline">Upload NDA/MSA</button>
                    </div>
                    <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed 
border-[#E2E8F0] rounded-xl bg-gray-50">
                      <MdFolder className="text-4xl text-gray-300 mb-2" />
                      <p className="text-sm text-[#64748B]">No master agreements uploaded yet.</p>
                    </div>
                  </Card>`;

// Actually let's locate it via string operations safely
const startStr = '{/* Master Contracts Card */}';
const endStr = ' <Card extra="col-span-1 md:col-span-2 p-6 flex flex-col h-[500px]">';

let startIndex = code.indexOf(startStr);
let endIndex = code.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
    const newCard = `{/* Master Contracts Card */}
                  <Card extra="p-6">
                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-[16px] font-semibold text-[#0F172A]">Master Contracts & Agreements</h3>
                      <button onClick={handleUploadClick} disabled={isUploading} className="text-sm font-bold text-[#16A34A] hover:underline disabled:opacity-50">
                          {isUploading ? "Uploading..." : "Upload NDA/MSA"}
                      </button>
                    </div>
                    {agreements.length === 0 ? (
                        <div onClick={handleUploadClick} className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed border-[#E2E8F0] rounded-xl bg-gray-50 cursor-pointer hover:bg-green-50 hover:border-green-300 transition">
                          <MdFolder className="text-4xl text-gray-300 mb-2" />
                          <p className="text-sm text-[#64748B]">{isUploading ? "Uploading..." : "Click here to upload master agreements."}</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3 max-h-[150px] overflow-y-auto custom-scrollbar">
                           {agreements.map(doc => (
                              <div key={doc.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-white shadow-sm">
                                 <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="w-8 h-8 rounded bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                                       <MdFolder size={18} />
                                    </div>
                                    <span className="text-[13px] font-semibold text-[#0F172A] truncate" title={doc.name}>{doc.name}</span>
                                 </div>
                                 <div className="flex items-center gap-2 shrink-0">
                                    <button onClick={() => handleDownload(doc.file_url)} className="text-gray-500 hover:text-blue-600 p-1 transition"><MdDownload size={18} /></button>
                                    <button onClick={() => handleDeleteFile(doc.id, doc.file_url)} className="text-gray-500 hover:text-red-500 p-1 transition"><MdDelete size={18} /></button>
                                 </div>
                              </div>
                           ))}
                        </div>
                    )}
                  </Card>
                  
                 `;
    
    code = code.substring(0, startIndex) + newCard + code.substring(endIndex);
} else {
    console.log("Could not find card boundaries");
}

fs.writeFileSync('src/views/admin/clients/ClientDetail.jsx', code);
