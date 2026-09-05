import React, { useState, useEffect } from "react";
import Card from "components/card";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newDoc, setNewDoc] = useState({ name: "", file_url: "" });

  const fetchDocs = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("documents").select("*");
    if (!error && data) {
      setDocuments(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.from("documents").insert([newDoc]);
    if (!error) {
      setShowModal(false);
      setNewDoc({ name: "", file_url: "" });
      fetchDocs();
    }
  };

  return (
    <div className="mt-5 grid h-full grid-cols-1 gap-5">
      <Card extra={"w-full h-full p-4 sm:p-6"}>
        <header className="relative flex items-center justify-between pt-4 pb-2">
          <div className="text-xl font-bold text-navy-700 dark:text-white">
            Documents & Drawings
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="linear rounded-[20px] bg-brand-900 px-4 py-2 text-base font-medium text-white transition hover:bg-brand-800"
          >
            + Upload Document
          </button>
        </header>

        <div className="mt-8 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="!border-px !border-gray-400">
                <th className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start"><p className="text-sm font-bold text-gray-600 dark:text-white">DOCUMENT NAME</p></th>
                <th className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start"><p className="text-sm font-bold text-gray-600 dark:text-white">LINK / URL</p></th>
                <th className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start"><p className="text-sm font-bold text-gray-600 dark:text-white">UPLOADED ON</p></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="3" className="py-4 text-center">Loading docs...</td></tr>
              ) : documents.length === 0 ? (
                <tr><td colSpan="3" className="py-4 text-center text-gray-500">No documents found.</td></tr>
              ) : (
                documents.map((doc) => (
                  <tr key={doc.id} className="border-b-[1px] border-gray-200 hover:bg-gray-50 dark:hover:bg-navy-700">
                    <td className="pt-[14px] pb-[18px] sm:text-[14px]"><p className="text-sm font-bold text-navy-700 dark:text-white">{doc.name}</p></td>
                    <td className="pt-[14px] pb-[18px] sm:text-[14px]">
                      <a href={doc.file_url} target="_blank" rel="noreferrer" className="text-brand-500 hover:underline text-sm font-bold">View File</a>
                    </td>
                    <td className="pt-[14px] pb-[18px] sm:text-[14px]"><p className="text-sm font-bold text-navy-700 dark:text-white">{new Date(doc.created_at).toLocaleDateString('en-GB')}</p></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-[20px] bg-white p-6 shadow-3xl dark:bg-navy-800">
            <h2 className="mb-4 text-xl font-bold text-navy-700 dark:text-white">Add New Document</h2>
            <form onSubmit={handleUpload} className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-bold text-navy-700 dark:text-white">Document Name</label>
                <input 
                  type="text" 
                  required
                  value={newDoc.name}
                  onChange={(e) => setNewDoc({...newDoc, name: e.target.value})}
                  className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:border-white/10 dark:text-white"
                />
              </div>
              <div>
                <label className="text-sm font-bold text-navy-700 dark:text-white">File URL / Drive Link</label>
                <input 
                  type="url" 
                  required
                  value={newDoc.file_url}
                  onChange={(e) => setNewDoc({...newDoc, file_url: e.target.value})}
                  className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:border-white/10 dark:text-white"
                />
              </div>
              <div className="mt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="rounded-xl px-5 py-3 text-base font-medium text-navy-700 transition hover:bg-gray-100">Cancel</button>
                <button type="submit" className="linear rounded-xl bg-brand-900 px-5 py-3 text-base font-medium text-white transition hover:bg-brand-800">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Documents;
