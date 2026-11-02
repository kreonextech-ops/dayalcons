import React, { useState, useEffect } from "react";
import Card from "components/card";
import { createClient } from "@supabase/supabase-js";
import { uploadFileToR2, getR2FileUrl } from "utils/r2Storage";
import { 
  MdCheckCircle, MdSave, MdRadioButtonUnchecked, MdAdd, MdDelete, 
  MdExpandMore, MdExpandLess, MdAttachFile, MdSend, MdBookmarkBorder 
} from "react-icons/md";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);

export const MILESTONE_TEMPLATES = [
  {
    id: "lucc_legal",
    name: "L.U.C.C & Legal Clearance",
    steps: [
      { id: 1, order: 1, title: "Document Collection & Title Deed Verification", completed: false, comments: [], files: [] },
      { id: 2, order: 2, title: "Land Survey & Site Inspection", completed: false, comments: [], files: [] },
      { id: 3, order: 3, title: "Application Submission to Municipal / Panchayat Authority", completed: false, comments: [], files: [] },
      { id: 4, order: 4, title: "Departmental Clearance & Field Verification", completed: false, comments: [], files: [] },
      { id: 5, order: 5, title: "Final L.U.C.C / Sanction Certificate Issuance", completed: false, comments: [], files: [] }
    ]
  },
  {
    id: "architectural_design",
    name: "Architectural & 3D Design",
    steps: [
      { id: 1, order: 1, title: "Client Requirement Brief & Site Analysis", completed: false, comments: [], files: [] },
      { id: 2, order: 2, title: "Conceptual 2D Floor Plan Layouts", completed: false, comments: [], files: [] },
      { id: 3, order: 3, title: "3D Front Elevation & Exterior Concept", completed: false, comments: [], files: [] },
      { id: 4, order: 4, title: "Structural & MEP Drawings Preparation", completed: false, comments: [], files: [] },
      { id: 5, order: 5, title: "Final Design Approval & Client Handover", completed: false, comments: [], files: [] }
    ]
  },
  {
    id: "construction",
    name: "Civil Construction Execution",
    steps: [
      { id: 1, order: 1, title: "Site Setup & Mobilization", completed: false, comments: [], files: [] },
      { id: 2, order: 2, title: "Excavation & Foundation", completed: false, comments: [], files: [] },
      { id: 3, order: 3, title: "Structural Framework & Superstructure", completed: false, comments: [], files: [] },
      { id: 4, order: 4, title: "Masonry & Core Works", completed: false, comments: [], files: [] },
      { id: 5, order: 5, title: "MEP Rough-ins (Plumbing, Electrical, HVAC)", completed: false, comments: [], files: [] },
      { id: 6, order: 6, title: "Plastering, Flooring & Finishes", completed: false, comments: [], files: [] },
      { id: 7, order: 7, title: "Handover & Final Inspection", completed: false, comments: [], files: [] }
    ]
  }
];

const TabSteps = ({ serviceCase, tableName = "services", onUpdate }) => {
  const [steps, setSteps] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [newStep, setNewStep] = useState("");
  const [newOrder, setNewOrder] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  
  // Workspace Expansion State
  const [expandedStep, setExpandedStep] = useState(null);
  const [newComment, setNewComment] = useState("");

  const userStr = sessionStorage.getItem("dayal_user");
  const loggedInUser = userStr ? JSON.parse(userStr) : { name: "Admin" };

  useEffect(() => {
     if (!serviceCase) return;
     try {
       const metadata = (() => { 
         try { return JSON.parse(serviceCase.description || "{}"); } 
         catch(e) { return { old_description: serviceCase.description }; } 
       })();
       
       if (metadata.steps && Array.isArray(metadata.steps) && metadata.steps.length > 0) {
          const st = metadata.steps.map((s, i) => ({ 
             ...s, 
             order: s.order || i + 1,
             comments: s.comments || [],
             files: s.files || []
          }));
          setSteps(st);
       } else {
          // Choose intelligent default template based on title
          const title = (serviceCase.title || serviceCase.name || "").toLowerCase();
          if (title.includes("lucc") || title.includes("legal") || title.includes("mutation") || title.includes("sanction")) {
            setSteps(MILESTONE_TEMPLATES[0].steps);
          } else if (title.includes("design") || title.includes("plan") || title.includes("elevation") || title.includes("architect")) {
            setSteps(MILESTONE_TEMPLATES[1].steps);
          } else {
            setSteps(MILESTONE_TEMPLATES[2].steps);
          }
       }
     } catch (e) {
        setSteps(MILESTONE_TEMPLATES[0].steps);
     }
  }, [serviceCase]);

  const handleApplyTemplate = (templateId) => {
    setSelectedTemplate(templateId);
    if (!templateId) return;
    const tpl = MILESTONE_TEMPLATES.find(t => t.id === templateId);
    if (tpl) {
      if (steps.length > 0 && !window.confirm(`Load template "${tpl.name}"? This will replace current steps with the template steps.`)) {
        return;
      }
      setSteps(tpl.steps.map((s, i) => ({
        ...s,
        id: Date.now() + i,
        comments: [],
        files: []
      })));
    }
  };

  const toggleStep = (id, e) => {
      e.stopPropagation();
      setSteps(prev => prev.map(step => step.id === id ? { ...step, completed: !step.completed } : step));
  };

  const addStep = () => {
     if (!newStep.trim()) return;
     const orderNum = parseInt(newOrder) || (steps.length + 1);
     const stepObj = { 
        id: Date.now(), 
        order: orderNum, 
        title: newStep.trim(), 
        completed: false,
        comments: [],
        files: []
     };
     setSteps([...steps, stepObj]);
     setNewStep("");
     setNewOrder("");
  };

  const removeStep = (id, e) => {
      e.stopPropagation();
      if (!window.confirm("Are you sure you want to delete this milestone step?")) return;
      setSteps(prev => prev.filter(step => step.id !== id));
  };

  const updateStepOrder = (id, newOrderValue, e) => {
      e.stopPropagation();
      setSteps(prev => prev.map(step => step.id === id ? { ...step, order: parseInt(newOrderValue) || step.order } : step));
  };

  const handleSave = async () => {
     setIsSaving(true);
     try {
       const metadata = (() => { 
         try { return JSON.parse(serviceCase.description || "{}"); } 
         catch(e) { return { old_description: serviceCase.description }; } 
       })();
       metadata.steps = steps;
       
       const targetTable = tableName || (serviceCase.title ? "services" : "projects");
       const { error } = await supabase.from(targetTable).update({
          description: JSON.stringify(metadata)
       }).eq("id", serviceCase.id);
       
       if (error) throw error;
       
       const updatedObj = { ...serviceCase, description: JSON.stringify(metadata) };
       if (onUpdate) onUpdate(updatedObj);
       alert("Milestones and steps saved successfully!");
     } catch (e) {
       alert("Failed to save: " + e.message);
     }
     setIsSaving(false);
  };

  const handleAddComment = (stepId) => {
      if (!newComment.trim()) return;
      
      const commentObj = {
          id: Date.now(),
          text: newComment.trim(),
          author: loggedInUser.name || "Admin",
          role: "Admin",
          timestamp: new Date().toISOString()
      };

      setSteps(prev => prev.map(step => {
          if (step.id === stepId) {
              return { ...step, comments: [...(step.comments || []), commentObj] };
          }
          return step;
      }));
      setNewComment("");
  };

  const handleFileUpload = async (stepId, e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const fileKey = await uploadFileToR2(file, "steps");
            const fileObj = {
                id: Date.now(),
                name: file.name,
                fileKey: fileKey,
                url: "#",
                author: loggedInUser?.name || "Admin",
                timestamp: new Date().toISOString()
            };

            setSteps(prev => prev.map(step => {
                if (step.id === stepId) {
                    return { ...step, files: [...(step.files || []), fileObj] };
                }
                return step;
            }));
        } catch (err) {
            console.error("Upload failed", err);
            alert("File upload failed.");
        }
        e.target.value = null;
  };

  const sortedSteps = [...steps].sort((a, b) => a.order - b.order);
  const completedCount = steps.filter(s => s.completed).length;
  const progress = steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0;

  return (
    <div className="animate-fade-in flex flex-col gap-6">
      <Card extra="p-6 border border-[#E2E8F0] bg-white">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
               <h2 className="text-[20px] font-bold text-[#0F172A]">Execution Milestones & Steps</h2>
               <p className="text-[14px] text-[#64748B]">Click on any step to view/add comments, photos, and files.</p>
            </div>
            
            {/* Template Selector */}
            <div className="flex items-center gap-2">
               <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                  <MdBookmarkBorder /> Template:
               </span>
               <select 
                 value={selectedTemplate} 
                 onChange={(e) => handleApplyTemplate(e.target.value)}
                 className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 font-semibold text-navy-700 outline-none focus:border-brand-500"
               >
                 <option value="">Load a Template...</option>
                 {MILESTONE_TEMPLATES.map(tpl => (
                   <option key={tpl.id} value={tpl.id}>{tpl.name}</option>
                 ))}
               </select>
            </div>

            <div className="text-right">
               <div className="text-[24px] font-bold text-[#2563EB]">{progress}%</div>
               <div className="text-[12px] text-[#64748B] uppercase font-bold tracking-wider">Completed</div>
            </div>
         </div>
         
         <div className="w-full bg-gray-100 h-3 rounded-full mb-8 overflow-hidden">
            <div className="bg-[#2563EB] h-full transition-all duration-500 rounded-full" style={{ width: `${progress}%` }}></div>
         </div>

         <div className="space-y-4 mb-6">
            {sortedSteps.length === 0 ? (
               <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                  No steps defined yet. Choose a template above or add a step below!
               </div>
            ) : (
               sortedSteps.map((step) => {
                  const isExpanded = expandedStep === step.id;
                  
                  return (
                  <div key={step.id} className={`flex flex-col overflow-hidden rounded-[12px] border transition ${step.completed ? 'border-blue-200' : 'border-[#E2E8F0]'}`}>
                     {/* Step Header */}
                     <div 
                        className={`flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 ${step.completed ? 'bg-blue-50' : 'bg-white'}`}
                        onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                     >
                        <div onClick={(e) => toggleStep(step.id, e)} title="Toggle completion">
                           {step.completed ? (
                              <MdCheckCircle className="text-[24px] text-[#2563EB]" />
                           ) : (
                              <MdRadioButtonUnchecked className="text-[24px] text-[#CBD5E1] hover:text-[#2563EB]" />
                           )}
                        </div>
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                           <span className="text-[12px] font-bold text-[#64748B] uppercase">Step</span>
                           <input 
                              type="number" 
                              value={step.order} 
                              onChange={(e) => updateStepOrder(step.id, e.target.value, e)} 
                              className="w-12 h-7 text-center rounded border border-[#E2E8F0] text-[13px] font-bold outline-none" 
                           />
                        </div>
                        <span className={`flex-1 text-[15px] font-semibold ${step.completed ? 'text-[#1E40AF]' : 'text-[#0F172A]'}`}>
                           {step.title}
                        </span>
                        
                        <div className="flex items-center gap-4">
                           <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                              {(step.comments?.length || 0) + (step.files?.length || 0)} Updates
                           </span>
                           <button 
                              onClick={(e) => removeStep(step.id, e)} 
                              title="Delete Step"
                              className="text-[#94A3B8] hover:text-[#DC2626] p-1 transition"
                           >
                              <MdDelete size={20} />
                           </button>
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
                                          <button 
                                             type="button"
                                             onClick={async () => { 
                                                if(file.fileKey) { 
                                                   try { 
                                                      const u = await getR2FileUrl(file.fileKey); 
                                                      window.open(u, "_blank"); 
                                                   } catch(e){} 
                                                } 
                                             }} 
                                             className="truncate font-medium text-blue-500 hover:underline text-left"
                                          >
                                             {file.name}
                                          </button>
                                          <span className="text-gray-400 text-[10px] mt-1">{file.author}</span>
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
                                       <div key={comment.id} className={`p-3 rounded-xl max-w-[85%] ${comment.role === 'Client' ? 'bg-white border border-gray-200 self-start' : 'bg-brand-50 border border-brand-100 self-end ml-auto'}`}>
                                          <div className="flex justify-between items-center mb-1">
                                             <span className="text-xs font-bold text-navy-700">{comment.author} {comment.role === 'Admin' ? '(You)' : ''}</span>
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
                                 />
                                 <button 
                                    type="button"
                                    onClick={() => handleAddComment(step.id)}
                                    className="bg-brand-500 text-white p-3 rounded-lg hover:bg-brand-600 transition shadow-sm"
                                 >
                                    <MdSend size={18} />
                                 </button>
                              </div>
                           </div>

                        </div>
                     )}
                  </div>
                  );
               })
            )}
         </div>

         {/* Add Custom Step Section */}
         <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-gray-100">
            <input 
              type="number" 
              placeholder="Step No." 
              value={newOrder} 
              onChange={e => setNewOrder(e.target.value)} 
              className="w-full sm:w-24 h-10 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none focus:border-[#2563EB]" 
            />
            <input 
              type="text" 
              placeholder="Add a new custom milestone or step..." 
              value={newStep} 
              onChange={e => setNewStep(e.target.value)} 
              onKeyDown={e => { if (e.key === 'Enter') addStep(); }}
              className="flex-1 h-10 px-4 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none focus:border-[#2563EB]" 
            />
            <button 
               type="button"
               onClick={addStep} 
               className="flex items-center justify-center gap-1 bg-[#F1F5F9] text-[#475569] px-4 py-2 rounded-[10px] text-[14px] font-bold hover:bg-[#E2E8F0] transition"
            >
               <MdAdd /> Add Step
            </button>
         </div>
      </Card>
      
      <div className="flex justify-end">
         <button 
           type="button"
           onClick={handleSave} 
           disabled={isSaving}
           className="flex items-center gap-2 bg-[#2563EB] text-white px-6 py-3 rounded-[12px] font-bold hover:bg-blue-700 transition shadow-sm disabled:opacity-50"
         >
           <MdSave className="text-xl" />
           {isSaving ? "Saving..." : "Save Workspace Progress"}
         </button>
      </div>
    </div>
  );
};

export default TabSteps;
