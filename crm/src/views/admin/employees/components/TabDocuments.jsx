import React, { useState } from "react";
import Card from "components/card";
import { MdFolder, MdCloudUpload, MdInsertDriveFile, MdDelete, MdDownload } from "react-icons/md";

const TabDocuments = ({ employee }) => {
  const [documents, setDocuments] = useState([
     // Mock documents for display purposes
     { id: 1, name: "Employment_Contract_Signed.pdf", type: "PDF", size: "2.4 MB", date: "2023-11-01" },
     { id: 2, name: "Aadhar_Card_Scan.jpg", type: "Image", size: "1.1 MB", date: "2023-11-01" }
  ]);

  const handleUpload = () => {
     alert("Document uploaded successfully! (File storage will be linked in backend)");
     setDocuments([...documents, { id: Date.now(), name: "New_Uploaded_Doc.pdf", type: "PDF", size: "500 KB", date: new Date().toISOString().split('T')[0] }]);
  };

  const handleDelete = (id) => {
     if(window.confirm('Delete this document?')) {
        setDocuments(documents.filter(d => d.id !== id));
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
         <Card extra="p-6 border border-[#E2E8F0] shadow-sm flex flex-col items-center justify-center text-center h-fit border-dashed bg-gray-50/50 hover:bg-blue-50 transition cursor-pointer" onClick={handleUpload}>
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
               <MdCloudUpload size={32} />
            </div>
            <h4 className="text-[16px] font-bold text-[#0F172A] mb-2">Upload Document</h4>
            <p className="text-[12px] text-[#64748B]">Click here to upload ID proofs, certificates, or contracts. (Max 5MB)</p>
         </Card>

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
                        <div>
                           <h4 className="text-[14px] font-bold text-[#0F172A]">{doc.name}</h4>
                           <p className="text-[11px] font-bold text-[#64748B] uppercase">{doc.type} • {doc.size} • Uploaded {doc.date}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-2">
                        <button className="text-gray-500 hover:text-blue-600 p-2 transition" title="Download">
                           <MdDownload size={20} />
                        </button>
                        <button onClick={() => handleDelete(doc.id)} className="text-gray-500 hover:text-red-500 p-2 transition" title="Delete">
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
