import React, { useState, useEffect } from "react";
import Card from "components/card";
import { MdFolder, MdCloudUpload, MdInsertDriveFile, MdDelete, MdDownload } from "react-icons/md";
import { createClient } from "@supabase/supabase-js";
import { uploadFileToR2, getR2FileUrl, deleteR2File } from "utils/r2Storage";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);

const TabDocuments = ({ employee }) => {
  const [documents, setDocuments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
     if (employee?.permissions?.documents) {
        setDocuments(employee.permissions.documents);
     }
  }, [employee]);

  const handleUpload = async (e) => {
     const file = e.target.files[0];
     if (!file) return;

     setIsUploading(true);
     try {
         const fileKey = await uploadFileToR2(file, 'employees');
         const newDoc = {
            id: Date.now().toString(),
            name: file.name,
            type: file.type.includes('pdf') ? 'PDF' : file.type.includes('image') ? 'Image' : 'Document',
            size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
            date: new Date().toISOString().split('T')[0],
            fileKey: fileKey
         };
         
         const currentPermissions = employee.permissions || {};
         const updatedDocs = [...documents, newDoc];
         const updatedPermissions = { ...currentPermissions, documents: updatedDocs };

         const { error } = await supabase.from('employees').update({ permissions: updatedPermissions }).eq('id', employee.id);
         
         if (error) throw error;
         
         setDocuments(updatedDocs);
         employee.permissions = updatedPermissions;
     } catch (err) {
         console.error(err);
         alert("Upload failed.");
     }
     setIsUploading(false);
     e.target.value = null; // reset input
  };

  const handleDelete = async (doc) => {
     if(!window.confirm('Delete this document?')) return;
     
     try {
        await deleteR2File(doc.fileKey);
        const updatedDocs = documents.filter(d => d.id !== doc.id);
        const currentPermissions = employee.permissions || {};
        const updatedPermissions = { ...currentPermissions, documents: updatedDocs };
        
        const { error } = await supabase.from('employees').update({ permissions: updatedPermissions }).eq('id', employee.id);
        if (error) throw error;

        setDocuments(updatedDocs);
        employee.permissions = updatedPermissions;
     } catch(err) {
        console.error(err);
        alert("Delete failed.");
     }
  };

  const handleDownload = async (doc) => {
     try {
        const url = await getR2FileUrl(doc.fileKey);
        window.open(url, '_blank');
     } catch (err) {
        alert("Failed to get download URL");
     }
  };

  return (
    <div className="animate-fade-in relative">
      <div className="flex justify-between items-center mb-6">
         <div>
            <h3 className="text-[18px] font-bold text-[#0F172A]">Document & Resource Management</h3>
            <p className="text-[13px] text-[#64748B]">Manage KYC, contracts, and assigned company assets.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Upload Section */}
         <label className="relative">
            <input type="file" className="hidden" onChange={handleUpload} disabled={isUploading} />
            <Card extra={`p-6 border border-[#E2E8F0] shadow-sm flex flex-col items-center justify-center text-center h-full border-dashed bg-gray-50/50 hover:bg-blue-50 transition ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
               <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                  <MdCloudUpload size={32} />
               </div>
               <h4 className="text-[16px] font-bold text-[#0F172A] mb-2">{isUploading ? "Uploading..." : "Upload Document"}</h4>
               <p className="text-[12px] text-[#64748B]">Click here to upload ID proofs, certificates, or contracts. (Max 5MB)</p>
            </Card>
         </label>

         {/* Document List */}
         <div className="lg:col-span-2 space-y-4">
            {documents.length === 0 ? (
               <Card extra="p-10 border border-[#E2E8F0] shadow-sm text-center">
                  <p className="text-gray-500">No documents uploaded yet.</p>
               </Card>
            ) : (
               documents.map(doc => (
                  <Card key={doc.id} extra="p-4 border border-[#E2E8F0] shadow-sm flex flex-row items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                           <MdInsertDriveFile size={24} />
                        </div>
                        <div className="max-w-[200px] sm:max-w-[300px]">
                           <h4 className="text-[14px] font-bold text-[#0F172A] truncate">{doc.name}</h4>
                           <p className="text-[11px] font-bold text-[#64748B] uppercase">{doc.type} • {doc.size} • Uploaded {doc.date}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-2 pl-2">
                        <button onClick={() => handleDownload(doc)} className="text-gray-500 hover:text-blue-600 p-2 transition" title="Download">
                           <MdDownload size={20} />
                        </button>
                        <button onClick={() => handleDelete(doc)} className="text-gray-500 hover:text-red-500 p-2 transition" title="Delete">
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

export default TabDocuments;

