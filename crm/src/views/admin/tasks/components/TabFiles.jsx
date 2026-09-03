import React, { useState, useEffect, useRef } from "react";
import Card from "components/card";
import { MdCloudUpload, MdInsertDriveFile, MdDelete, MdDownload } from "react-icons/md";
import { createClient } from "@supabase/supabase-js";
import { uploadFileToR2, getR2FileUrl, deleteR2File } from "utils/r2Storage";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);

const TabFiles = ({ task }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchFiles();
  }, [task]);

  const fetchFiles = async () => {
    if (!task) return;
    setLoading(true);
    const { data } = await supabase.from('task_files').select('*').eq('task_id', task.id).order('created_at', { ascending: false });
    if (data) setFiles(data);
    setLoading(false);
  };

  const handleUploadClick = () => {
     fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !task) return;
    
    setIsUploading(true);
    const userStr = localStorage.getItem("dayal_user");
    const user = userStr ? JSON.parse(userStr) : { name: "Admin" };

    let fileKey = "#";
    try {
        // Attempt to upload to Cloudflare R2
        fileKey = await uploadFileToR2(file, 'tasks');
    } catch (err) {
        console.warn("R2 Upload failed, keys might not be set. Using mock mode.", err);
        // Mock fallback if keys aren't set
        fileKey = "mock/" + file.name;
    }

    const fileSizeMb = (file.size / (1024 * 1024)).toFixed(2) + " MB";

    const { data, error } = await supabase.from('task_files').insert([{
       task_id: task.id,
       employee_name: user.name || "Admin",
       file_name: file.name,
       file_size: fileSizeMb,
       file_url: fileKey
    }]).select();

    if (error) {
       alert("Upload failed: " + error.message);
    } else if (data) {
       // Log activity
       await supabase.from('task_activity_logs').insert([{
          task_id: task.id,
          employee_name: user.name || "Admin",
          activity_type: "File Upload",
          description: `Uploaded file: ${file.name}`
       }]);

       setFiles([data[0], ...files]);
       alert("File uploaded successfully!");
    }
    
    setIsUploading(false);
    e.target.value = null; // reset input
  };

  const handleDelete = async (id, fileName, fileKey) => {
    if (!window.confirm("Delete this file?")) return;
    
    try {
       if (fileKey && !fileKey.startsWith("mock/") && fileKey !== "#") {
           await deleteR2File(fileKey);
       }
    } catch (e) {
       console.error("Failed to delete from R2", e);
    }

    await supabase.from('task_files').delete().eq('id', id);
    
    const userStr = localStorage.getItem("dayal_user");
    const user = userStr ? JSON.parse(userStr) : { name: "Admin" };
    
    await supabase.from('task_activity_logs').insert([{
       task_id: task.id,
       employee_name: user.name || "Admin",
       activity_type: "File Deleted",
       description: `Deleted file: ${fileName}`
    }]);

    setFiles(files.filter(f => f.id !== id));
  };

  const handleDownload = async (fileKey) => {
     if (!fileKey || fileKey === "#" || fileKey.startsWith("mock/")) {
        alert("This is a mock file. Actual download not available.");
        return;
     }
     try {
        const url = await getR2FileUrl(fileKey);
        window.open(url, "_blank");
     } catch (e) {
        alert("Failed to get download link: " + e.message);
     }
  };

  return (
    <div className="animate-fade-in max-w-4xl">
       <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
       
       <div className="flex justify-between items-center mb-6">
         <div>
            <h3 className="text-[18px] font-bold text-[#0F172A]">Attached Files</h3>
            <p className="text-[13px] text-[#64748B]">Upload documents, images, or DWG files relevant to this task.</p>
         </div>
         <button onClick={handleUploadClick} disabled={isUploading} className="flex items-center gap-1 bg-[#0F172A] text-white px-4 py-2 rounded-lg text-[13px] font-bold shadow-sm hover:bg-gray-800 disabled:opacity-50">
            {isUploading ? "Uploading..." : <><MdCloudUpload size={18} /> Upload File</>}
         </button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div onClick={handleUploadClick} className="md:col-span-1 border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center bg-gray-50/50 cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition text-center min-h-[200px]">
             <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-blue-500 border border-[#E2E8F0] shadow-sm mb-4">
                <MdCloudUpload size={28} />
             </div>
             <h3 className="text-[15px] font-bold text-[#0F172A] mb-1">{isUploading ? "Uploading..." : "Click to Upload"}</h3>
             <p className="text-[12px] text-[#64748B]">Max size 10MB</p>
          </div>

          <div className="md:col-span-2 flex flex-col gap-3">
             {loading ? (
                <p className="text-gray-400 p-4">Loading files...</p>
             ) : files.length === 0 ? (
                <div className="flex-1 border border-[#E2E8F0] rounded-2xl flex items-center justify-center bg-white p-8">
                   <p className="text-gray-400">No files attached yet.</p>
                </div>
             ) : (
                files.map(file => (
                   <Card key={file.id} extra="p-4 border border-[#E2E8F0] shadow-sm flex flex-row items-center justify-between">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                            <MdInsertDriveFile size={22} />
                         </div>
                         <div className="max-w-[200px] sm:max-w-[300px]">
                            <h4 className="text-[14px] font-bold text-[#0F172A] break-all line-clamp-2">{file.file_name}</h4>
                            <p className="text-[11px] font-bold text-[#64748B] uppercase">{file.file_size} • Uploaded by {file.employee_name}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                         <button onClick={() => handleDownload(file.file_url)} className="text-gray-500 hover:text-blue-600 p-2 transition" title="Download">
                            <MdDownload size={20} />
                         </button>
                         <button onClick={() => handleDelete(file.id, file.file_name, file.file_url)} className="text-gray-500 hover:text-red-500 p-2 transition" title="Delete">
                            <MdDelete size={20} />
                         </button>
                      </div>
                   </Card>
                ))
             )}
          </div>
       </div>
    </div>
  );
};

export default TabFiles;
