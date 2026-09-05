import React, { useState, useEffect } from "react";
import Card from "components/card";
import { createClient } from "@supabase/supabase-js";
import { MdCheckCircle, MdRadioButtonUnchecked, MdExpandMore, MdExpandLess, MdAttachFile, MdSend } from "react-icons/md";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);

const ClientSteps = ({ entityData, tableType }) => {
  const [steps, setSteps] = useState([]);
  const [expandedStep, setExpandedStep] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const userStr = localStorage.getItem("dayal_user");
  const loggedInUser = userStr ? JSON.parse(userStr) : { name: "Client" };

  useEffect(() => {
     try {
       const metadata = JSON.parse(entityData.description || "{}");
       if (metadata.steps && Array.isArray(metadata.steps)) {
          setSteps(metadata.steps);
       }
     } catch (e) {
        setSteps([]);
     }
  }, [entityData]);

  const saveStepsToDb = async (updatedSteps) => {
     setIsSaving(true);
     try {
       const metadata = JSON.parse(entityData.description || "{}");
       metadata.steps = updatedSteps;
       
       await supabase.from(tableType).update({
          description: JSON.stringify(metadata)
       }).eq("id", entityData.id);
       
       setSteps(updatedSteps);
     } catch (e) {
       alert("Failed to save update: " + e.message);
     }
     setIsSaving(false);
  };

  const handleAddComment = (stepId) => {
      if (!newComment.trim()) return;
      
      const commentObj = {
          id: Date.now(),
          text: newComment,
          author: loggedInUser.name,
          role: "Client",
          timestamp: new Date().toISOString()
      };

      const updatedSteps = steps.map(step => {
          if (step.id === stepId) {
              return { ...step, comments: [...(step.comments || []), commentObj] };
          }
          return step;
      });
      
      saveStepsToDb(updatedSteps);
      setNewComment("");
  };

  const handleFileUpload = async (stepId, e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      // Simulating a file upload for now
      const fileObj = {
          id: Date.now(),
          name: file.name,
          url: URL.createObjectURL(file), // mock URL
          author: loggedInUser.name,
          timestamp: new Date().toISOString()
      };

      const updatedSteps = steps.map(step => {
          if (step.id === stepId) {
              return { ...step, files: [...(step.files || []), fileObj] };
          }
          return step;
      });

      saveStepsToDb(updatedSteps);
  };

  const sortedSteps = [...steps].sort((a, b) => a.order - b.order);
  const completedCount = steps.filter(s => s.completed).length;
  const progress = steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0;

  if (steps.length === 0) {
     return (
        <Card extra="p-6 bg-white border border-[#E2E8F0]">
           <div className="text-center py-8 text-gray-500">
              No milestones have been defined for this project yet. Please check back later!
           </div>
        </Card>
     );
  }

  return (
    <div className="animate-fade-in flex flex-col gap-6">
      <Card extra="p-6 border border-[#E2E8F0] bg-white">
         <div className="flex justify-between items-center mb-6">
            <div>
               <h2 className="text-[20px] font-bold text-[#0F172A]">Execution Progress</h2>
               <p className="text-[14px] text-[#64748B]">Click on any milestone to view updates or ask questions.</p>
            </div>
            <div className="text-right">
               <div className="text-[24px] font-bold text-[#2563EB]">{progress}%</div>
               <div className="text-[12px] text-[#64748B] uppercase font-bold tracking-wider">Completed</div>
            </div>
         </div>
         
         <div className="w-full bg-gray-100 h-3 rounded-full mb-8 overflow-hidden">
            <div className="bg-[#2563EB] h-full transition-all duration-500 rounded-full" style={{ width: `${progress}%` }}></div>
         </div>

         <div className="space-y-4">
            {sortedSteps.map((step) => {
               const isExpanded = expandedStep === step.id;
               
               return (
               <div key={step.id} className={`flex flex-col overflow-hidden rounded-[12px] border transition ${step.completed ? 'border-blue-200 shadow-sm' : 'border-[#E2E8F0]'}`}>
                  {/* Step Header */}
                  <div 
                     className={`flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 ${step.completed ? 'bg-blue-50' : 'bg-white'}`}
                     onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                  >
                     <div>
                        {step.completed ? (
                           <MdCheckCircle className="text-[24px] text-[#2563EB]" />
                        ) : (
                           <MdRadioButtonUnchecked className="text-[24px] text-[#CBD5E1]" />
                        )}
                     </div>
                     <span className={`flex-1 text-[15px] font-semibold ${step.completed ? 'text-[#1E40AF]' : 'text-[#0F172A]'}`}>
                        <span className="text-[12px] font-bold text-[#64748B] uppercase mr-2">Step {step.order}</span>
                        {step.title}
                     </span>
                     
                     <div className="flex items-center gap-4">
                        <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                           {(step.comments?.length || 0) + (step.files?.length || 0)} Updates
                        </span>
                        {isExpanded ? <MdExpandLess size={24} className="text-gray-400" /> : <MdExpandMore size={24} className="text-gray-400" />}
                     </div>
                  </div>

                  {/* Step Workspace (Expanded) */}
                  {isExpanded && (
                     <div className="p-5 border-t border-[#E2E8F0] bg-[#F8FAFC]">
                        
                        {/* Files Section */}
                        <div className="mb-6">
                           <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                              <MdAttachFile size={16} /> Attached Files & Photos
                           </h4>
                           {step.files && step.files.length > 0 ? (
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                                 {step.files.map(file => (
                                    <div key={file.id} className="bg-white p-2 rounded border border-gray-200 text-xs flex flex-col justify-between shadow-sm">
                                       <span className="truncate font-medium">{file.name}</span>
                                       <span className="text-gray-400 text-[10px] mt-1">{file.author === loggedInUser.name ? 'You' : 'Admin'}</span>
                                    </div>
                                 ))}
                              </div>
                           ) : (
                              <p className="text-xs text-gray-500 mb-3 italic">No files attached yet.</p>
                           )}
                           
                           <label className="cursor-pointer bg-white border border-dashed border-brand-500 text-brand-500 px-4 py-2 rounded-lg text-xs font-bold hover:bg-brand-50 transition inline-block">
                              + Upload File
                              <input type="file" className="hidden" onChange={(e) => handleFileUpload(step.id, e)} />
                           </label>
                        </div>

                        <hr className="border-gray-200 mb-6" />

                        {/* Comments Section */}
                        <div>
                           <h4 className="text-sm font-bold text-gray-700 mb-3">Communication & Updates</h4>
                           <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-2">
                              {step.comments && step.comments.length > 0 ? (
                                 step.comments.map(comment => (
                                    <div key={comment.id} className={`p-3 rounded-xl max-w-[85%] ${comment.role === 'Admin' ? 'bg-white border border-gray-200 self-start' : 'bg-brand-50 border border-brand-100 self-end ml-auto'}`}>
                                       <div className="flex justify-between items-center mb-1">
                                          <span className="text-xs font-bold text-navy-700">{comment.author} {comment.role === 'Client' ? '(You)' : ''}</span>
                                          <span className="text-[10px] text-gray-400">{new Date(comment.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                       </div>
                                       <p className="text-sm text-gray-600">{comment.text}</p>
                                    </div>
                                 ))
                              ) : (
                                 <p className="text-xs text-gray-500 italic">No comments or updates on this step yet.</p>
                              )}
                           </div>
                           
                           {/* Add Comment */}
                           <div className="flex gap-2">
                              <input 
                                 type="text"
                                 placeholder="Write an update or ask a question..."
                                 value={newComment}
                                 onChange={(e) => setNewComment(e.target.value)}
                                 onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(step.id); }}
                                 className="flex-1 bg-white border border-gray-200 rounded-lg px-4 text-sm outline-none focus:border-brand-500 shadow-sm"
                                 disabled={isSaving}
                              />
                              <button 
                                 onClick={() => handleAddComment(step.id)}
                                 disabled={isSaving}
                                 className="bg-brand-500 text-white p-3 rounded-lg hover:bg-brand-600 transition shadow-sm disabled:opacity-50"
                              >
                                 <MdSend size={18} />
                              </button>
                           </div>
                        </div>

                     </div>
                  )}
               </div>
               );
            })}
         </div>

      </Card>
    </div>
  );
};

export default ClientSteps;
