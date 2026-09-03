const fs = require('fs');
let code = fs.readFileSync('src/views/admin/clients/ClientDetail.jsx', 'utf8');

const anchor = 'const [newComment, setNewComment] = useState("");';
const newVars = `
    const [agreements, setAgreements] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = React.useRef(null);
    
    React.useEffect(() => {
       const fetchAgreements = async () => {
          if (!client?.id) return;
          const { data } = await supabase.from('documents').select('*').eq('client_id', client.id);
          if (data) setAgreements(data);
       };
       fetchAgreements();
    }, [client]);
    
    const handleUploadClick = () => { fileInputRef.current?.click(); };
    
    const handleFileChange = async (e) => {
       const file = e.target.files[0];
       if (!file || !client?.id) return;
       setIsUploading(true);
       
       try {
           const fileKey = await uploadFileToR2(file, 'clients');
           const { data, error } = await supabase.from('documents').insert([{
              client_id: client.id,
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
`;

code = code.replace(anchor, anchor + newVars);
fs.writeFileSync('src/views/admin/clients/ClientDetail.jsx', code);
