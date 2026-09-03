import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { uploadFileToR2, getR2FileUrl, deleteR2File } from "utils/r2Storage";


import Card from "components/card";
import { 
  MdAdd, MdCloudUpload, MdFolder, MdInsertDriveFile, 
  MdSearch, MdMoreVert, MdClose, MdFileDownload, MdDelete, MdArrowBack
} from "react-icons/md";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);

const TabDocuments = ({ leadData }) => {
  const [activeFolder, setActiveFolder] = useState(null);
  const [documents, setDocuments] = useState([]);
  
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

  const [previewDoc, setPreviewDoc] = useState(null);
  const fileInputRef = React.useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const [folders, setFolders] = useState([
    { id: 1, name: "Site Photos", color: "text-blue-500", bg: "bg-blue-50", type: "static" },
    { id: 2, name: "Land Documents", color: "text-indigo-500", bg: "bg-indigo-50", type: "static" },
    { id: 3, name: "Soil Reports", color: "text-orange-500", bg: "bg-orange-50", type: "static" },
    { id: 4, name: "Quotations", color: "text-purple-500", bg: "bg-purple-50", type: "static" },
    { id: 5, name: "Client KYC", color: "text-green-500", bg: "bg-green-50", type: "static" },
    { id: 6, name: "Municipal Approvals", color: "text-red-500", bg: "bg-red-50", type: "static" },
  ]);

  React.useEffect(() => {
    if (leadData?.selectedServices?.length > 0) {
       const dynamicFolders = [];
       const s = leadData.selectedServices;
       
       if (s.includes("Interior Design")) dynamicFolders.push({ id: 101, name: "Mood Boards", color: "text-pink-500", bg: "bg-pink-50", type: "dynamic" });
       if (s.includes("Structural Design")) dynamicFolders.push({ id: 102, name: "RCC Drawings", color: "text-gray-600", bg: "bg-gray-100", type: "dynamic" });
       if (s.includes("Building Plan Approval") || s.includes("Land Registration & Mutation")) dynamicFolders.push({ id: 103, name: "Legal Documents", color: "text-red-700", bg: "bg-red-50", type: "dynamic" });
       if (s.includes("2D Floor Plan Design") || s.includes("3D Elevation Design") || s.includes("3D Floor Plan Design")) dynamicFolders.push({ id: 104, name: "Architectural Drawings", color: "text-cyan-500", bg: "bg-cyan-50", type: "dynamic" });
       
       setFolders(prev => {
         const staticFolders = prev.filter(f => f.type === "static" || f.type === undefined);
         // Prevent duplicates
         const newDynamic = dynamicFolders.filter(df => !staticFolders.find(sf => sf.name === df.name));
         return [...staticFolders, ...newDynamic];
       });
    }
  }, [leadData?.selectedServices]);

  const handleNewFolder = () => {
     const name = window.prompt("Enter new folder name:");
     if (name && name.trim() !== "") {
        setFolders([...folders, { 
           id: Date.now(), 
           name: name.trim(), 
           color: "text-gray-500", 
           bg: "bg-gray-50" 
        }]);
     }
  };

  
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
                alert("Failed to upload " + file.name + ". Error: " + err.message + "\nName: " + err.name);
            }
        }
        
        if (uploadedDocs.length > 0) {
            setDocuments([...documents, ...uploadedDocs]);
        }
     }
  };


  const handleFileUpload = (e) => {
     processFiles(Array.from(e.target.files));
  };

  const handleDrag = (e) => {
     e.preventDefault();
     e.stopPropagation();
     if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
     } else if (e.type === "dragleave") {
        setDragActive(false);
     }
  };

  const handleDrop = (e) => {
     e.preventDefault();
     e.stopPropagation();
     setDragActive(false);
     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        processFiles(Array.from(e.dataTransfer.files));
     }
  };

  const currentDocs = activeFolder ? documents.filter(d => d.folderId === activeFolder.id) : documents;

  return (
    <div className="flex flex-col gap-6 animate-fade-in relative">
      {/* 1. Header */}
      <Card extra="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              {activeFolder && (
                 <button onClick={() => setActiveFolder(null)} className="text-gray-400 hover:text-[#2563EB] transition mr-1">
                   <MdArrowBack className="text-xl" />
                 </button>
              )}
              <h2 className="text-[20px] font-semibold text-[#0F172A]">
                 {activeFolder ? activeFolder.name : "Document Management"}
              </h2>
            </div>
            <p className="text-sm text-[#64748B]">
               {activeFolder ? `Viewing documents in ${activeFolder.name}.` : "Store and organize all lead documents."}
            </p>
          </div>
          <div className="flex gap-3">
            {!activeFolder && (
              <button onClick={handleNewFolder} className="h-10 px-4 rounded-[10px] border border-[#E2E8F0] bg-white text-sm font-bold text-[#0F172A] hover:bg-gray-50 transition flex items-center gap-2">
                <MdFolder /> New Folder
              </button>
            )}
            <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileUpload} />
            <button onClick={() => fileInputRef.current.click()} className="h-10 px-6 rounded-[10px] bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-sm font-bold text-white hover:opacity-90 transition flex items-center gap-2">
              <MdCloudUpload /> Upload Document
            </button>
          </div>
        </div>
      </Card>

      {activeFolder ? (
         // FOLDER VIEW
         <Card extra="p-6 min-h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[16px] font-semibold text-[#0F172A]">Files in {activeFolder.name}</h3>
              <div className="relative w-64">
                <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search in folder..." className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[#E2E8F0] text-sm outline-none focus:border-[#2563EB]" />
              </div>
            </div>
            
            {currentDocs.length === 0 ? (
               <div className="w-full flex flex-col items-center justify-center py-16">
                  <div className={`w-24 h-24 rounded-full ${activeFolder.bg} flex items-center justify-center text-5xl ${activeFolder.color} mb-4 opacity-50`}>
                    <MdFolder />
                  </div>
                  <h4 className="text-[18px] font-bold text-[#0F172A] mb-2">This folder is empty.</h4>
                  <p className="text-sm text-[#64748B] mb-6">Drag and drop files here or use the upload button.</p>
                  <button onClick={() => fileInputRef.current.click()} className="h-10 px-6 rounded-full bg-[#2563EB] text-sm font-bold text-white hover:opacity-90 shadow-md">
                    Upload to {activeFolder.name}
                  </button>
               </div>
            ) : (
               <div className="overflow-x-auto w-full">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="border-b border-[#E2E8F0] text-xs text-[#64748B] uppercase">
                           <th className="pb-2 font-bold">File</th>
                           <th className="pb-2 font-bold">Category</th>
                           <th className="pb-2 font-bold">Size</th>
                           <th className="pb-2 font-bold">Uploaded By</th>
                           <th className="pb-2 font-bold">Date</th>
                           <th className="pb-2 font-bold text-center">Actions</th>
                        </tr>
                     </thead>
                     <tbody>
                        {currentDocs.map(d => (
                           <tr key={d.id} className="border-b border-[#EDF2F7] hover:bg-gray-50 transition cursor-pointer" onClick={async () => {
    try {
       const url = await getR2FileUrl(d.file_url);
       window.open(url, "_blank");
    } catch (e) {
       alert("Failed to open file.");
    }
}}>
                              <td className="py-3 text-sm font-medium text-[#0F172A] flex items-center gap-2"><MdInsertDriveFile className="text-gray-400 text-lg"/> {d.name}</td>
                              <td className="py-3 text-sm text-[#475569]">{d.category}</td>
                              <td className="py-3 text-sm text-[#475569]">{d.size}</td>
                              <td className="py-3 text-sm text-[#475569]">{d.uploadedBy}</td>
                              <td className="py-3 text-sm text-[#475569]">{d.date}</td>
                              <td className="py-3 text-center text-gray-400 text-lg">
                                 <MdDelete className="cursor-pointer hover:text-red-500 inline-block" onClick={async (e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this document?")) return;
    try {
       await deleteR2File(d.file_url);
       await supabase.from('documents').delete().eq('id', d.id);
       setDocuments(documents.filter(doc => doc.id !== d.id));
    } catch (err) {
       alert("Failed to delete.");
    }
}} />
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            )}
         </Card>
      ) : (
         // MAIN VIEW
         <>
            {/* 2. Storage Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Files", val: documents.length > 0 ? documents.length : "—" },
                { label: "Images", val: "—" },
                { label: "PDFs", val: "—" },
                { label: "Storage Used", val: documents.length > 0 ? "Under 1 MB" : "—" },
              ].map((card, i) => (
                <Card key={i} extra="p-4 border border-[#E2E8F0] text-center">
                   <p className="text-[10px] font-bold text-[#64748B] uppercase">{card.label}</p>
                   <p className="text-[20px] font-bold text-[#0F172A] mt-1">{card.val}</p>
                </Card>
              ))}
            </div>

            {/* 5. Upload Center (Drag & Drop) */}
            <Card 
               extra={`p-8 border-2 border-dashed ${dragActive ? 'border-[#2563EB] bg-blue-50' : 'border-[#E2E8F0] bg-[#F8FAFC]'} flex flex-col items-center justify-center cursor-pointer hover:bg-white hover:border-[#2563EB] transition-colors group`}
               onDragEnter={handleDrag}
               onDragLeave={handleDrag}
               onDragOver={handleDrag}
               onDrop={handleDrop}
               onClick={() => fileInputRef.current.click()}
            >
               <div className="w-16 h-16 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                  <MdCloudUpload />
               </div>
               <h3 className="text-[16px] font-bold text-[#0F172A] mb-1">Drag & Drop files here</h3>
               <p className="text-sm text-[#64748B] mb-4">or click to browse from your computer</p>
               <div className="flex gap-2 text-xs font-semibold text-gray-400">
                 <span>PDF</span>•<span>JPG</span>•<span>PNG</span>•<span>DWG</span>•<span>DOCX</span>•<span>XLSX</span>
               </div>
            </Card>

            {/* 3. Folder Grid */}
            <div>
               <h3 className="text-[16px] font-semibold text-[#0F172A] mb-4">Folders</h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {folders.map(f => {
                     const folderDocsCount = documents.filter(d => d.folderId === f.id).length;
                     return (
                     <Card 
                        key={f.id} 
                        extra="p-4 border border-[#E2E8F0] hover:border-[#2563EB] cursor-pointer transition hover:shadow-md flex flex-row items-center justify-between"
                        onClick={() => setActiveFolder(f)}
                     >
                        <div className="flex items-center gap-3">
                           <div className={`w-10 h-10 rounded-xl ${f.bg} ${f.color} flex items-center justify-center text-xl`}>
                              <MdFolder />
                           </div>
                           <div>
                             <h4 className="text-sm font-bold text-[#0F172A]">{f.name}</h4>
                             <p className="text-xs text-[#64748B]">{folderDocsCount > 0 ? `${folderDocsCount} files` : "— files"}</p>
                           </div>
                        </div>
                        <MdMoreVert className="text-gray-400 hover:text-black" onClick={(e) => e.stopPropagation()} />
                     </Card>
                  )})}
               </div>
            </div>

            {/* 4. Recent Files Table */}
            <Card extra="p-6 min-h-[300px]">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="text-[16px] font-semibold text-[#0F172A]">Recent Files</h3>
                 <div className="relative w-64">
                   <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                   <input type="text" placeholder="Search documents..." className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[#E2E8F0] text-sm outline-none focus:border-[#2563EB]" />
                 </div>
               </div>
               
               {currentDocs.length === 0 ? (
                  <div className="w-full flex flex-col items-center justify-center py-12">
                     <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center text-4xl text-gray-300 mb-4">
                       <MdInsertDriveFile />
                     </div>
                     <h4 className="text-[16px] font-bold text-[#0F172A] mb-2">No documents uploaded yet.</h4>
                     <p className="text-sm text-[#64748B] mb-6">Upload your first document to start organizing files.</p>
                     <button onClick={() => fileInputRef.current.click()} className="h-10 px-6 rounded-full bg-[#2563EB] text-sm font-bold text-white hover:opacity-90 shadow-md">
                       Upload First Document
                     </button>
                  </div>
               ) : (
                  <div className="overflow-x-auto w-full">
                     <table className="w-full text-left">
                        <thead>
                           <tr className="border-b border-[#E2E8F0] text-xs text-[#64748B] uppercase">
                              <th className="pb-2 font-bold">File</th>
                              <th className="pb-2 font-bold">Category</th>
                              <th className="pb-2 font-bold">Size</th>
                              <th className="pb-2 font-bold">Uploaded By</th>
                              <th className="pb-2 font-bold">Date</th>
                              <th className="pb-2 font-bold text-center">Actions</th>
                           </tr>
                        </thead>
                        <tbody>
                           {currentDocs.map(d => (
                              <tr key={d.id} className="border-b border-[#EDF2F7] hover:bg-gray-50 transition cursor-pointer" onClick={async () => {
    try {
       const url = await getR2FileUrl(d.file_url);
       window.open(url, "_blank");
    } catch (e) {
       alert("Failed to open file.");
    }
}}>
                                 <td className="py-3 text-sm font-medium text-[#0F172A] flex items-center gap-2"><MdInsertDriveFile className="text-gray-400 text-lg"/> {d.name}</td>
                                 <td className="py-3 text-sm text-[#475569]">{d.category}</td>
                                 <td className="py-3 text-sm text-[#475569]">{d.size}</td>
                                 <td className="py-3 text-sm text-[#475569]">{d.uploadedBy}</td>
                                 <td className="py-3 text-sm text-[#475569]">{d.date}</td>
                                 <td className="py-3 text-center text-gray-400 text-lg">
                                    <MdDelete className="cursor-pointer hover:text-red-500 inline-block" onClick={async (e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this document?")) return;
    try {
       await deleteR2File(d.file_url);
       await supabase.from('documents').delete().eq('id', d.id);
       setDocuments(documents.filter(doc => doc.id !== d.id));
    } catch (err) {
       alert("Failed to delete.");
    }
}} />
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               )}
            </Card>
         </>
      )}
    </div>
  );
};

export default TabDocuments;
