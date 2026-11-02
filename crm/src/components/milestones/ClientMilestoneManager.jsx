import React, { useState, useEffect } from "react";
import Card from "components/card";
import { createClient } from "@supabase/supabase-js";
import { uploadFileToR2, getR2FileUrl } from "utils/r2Storage";
import { 
  MdCheckCircle, MdRadioButtonUnchecked, MdAdd, MdDelete, 
  MdExpandMore, MdExpandLess, MdAttachFile, MdSend, MdBookmarkBorder,
  MdFlag, MdPlaylistAddCheck, MdDeleteOutline
} from "react-icons/md";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);

export const DEFAULT_TEMPLATES = [
  {
    id: "tpl_lucc",
    name: "L.U.C.C & Legal Services",
    isDefault: true,
    steps: [
      { id: 1, order: 1, title: "Document Collection & Title Deed Verification", completed: false, comments: [], files: [] },
      { id: 2, order: 2, title: "Land Survey & Site Inspection", completed: false, comments: [], files: [] },
      { id: 3, order: 3, title: "Application Submission to Municipal / Panchayat Authority", completed: false, comments: [], files: [] },
      { id: 4, order: 4, title: "Departmental Clearance & Field Verification", completed: false, comments: [], files: [] },
      { id: 5, order: 5, title: "Final L.U.C.C / Sanction Certificate Issuance", completed: false, comments: [], files: [] }
    ]
  },
  {
    id: "tpl_architectural",
    name: "Architectural & 3D Design",
    isDefault: true,
    steps: [
      { id: 1, order: 1, title: "Client Requirement Brief & Site Analysis", completed: false, comments: [], files: [] },
      { id: 2, order: 2, title: "Conceptual 2D Floor Plan Layouts", completed: false, comments: [], files: [] },
      { id: 3, order: 3, title: "3D Front Elevation & Exterior Concept", completed: false, comments: [], files: [] },
      { id: 4, order: 4, title: "Structural & MEP Drawings Preparation", completed: false, comments: [], files: [] },
      { id: 5, order: 5, title: "Final Design Approval & Client Handover", completed: false, comments: [], files: [] }
    ]
  },
  {
    id: "tpl_construction",
    name: "Civil Construction Execution",
    isDefault: true,
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

export default function ClientMilestoneManager({ clientId, clientName, isAdmin = false }) {
  const [milestones, setMilestones] = useState([]);
  const [employeeRecord, setEmployeeRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedMilestone, setExpandedMilestone] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newOrder, setNewOrder] = useState("");
  const [templates, setTemplates] = useState(DEFAULT_TEMPLATES);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [saveTemplateName, setSaveTemplateName] = useState("");
  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState(false);

  const userStr = sessionStorage.getItem("dayal_user");
  const loggedInUser = userStr ? JSON.parse(userStr) : { name: isAdmin ? "Admin" : "Client" };

  // Load custom templates from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("dayal_client_milestone_templates");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTemplates([...DEFAULT_TEMPLATES, ...parsed]);
        }
      }
    } catch(e) {}
  }, []);

  // Fetch client login record from Supabase employees table
  const fetchClientMilestones = async () => {
    if (!clientId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("employees")
        .select("id, name, permissions, department")
        .eq("department", clientId)
        .eq("role", "Client")
        .maybeSingle();

      if (data) {
        setEmployeeRecord(data);
        const perms = data.permissions || {};
        if (Array.isArray(perms.milestones) && perms.milestones.length > 0) {
          setMilestones(perms.milestones);
        } else {
          // If no milestones defined yet, default to empty or LUCC if new
          setMilestones([]);
        }
      } else {
        // Fallback: check if client has milestones in notes or empty
        setMilestones([]);
      }
    } catch (err) {
      console.error("Error fetching client milestones:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchClientMilestones();
  }, [clientId]);

  // Save milestones to Supabase
  const persistMilestones = async (newMilestones, successMsg = null) => {
    setIsSaving(true);
    try {
      if (!employeeRecord?.id) {
        // Find or create employee record
        const { data: emp } = await supabase
          .from("employees")
          .select("id, permissions")
          .eq("department", clientId)
          .eq("role", "Client")
          .maybeSingle();

        if (emp?.id) {
          const updatedPerms = { ...(emp.permissions || {}), milestones: newMilestones };
          await supabase.from("employees").update({ permissions: updatedPerms }).eq("id", emp.id);
          setEmployeeRecord(prev => ({ ...prev, id: emp.id, permissions: updatedPerms }));
        }
      } else {
        const updatedPerms = { ...(employeeRecord.permissions || {}), milestones: newMilestones };
        await supabase.from("employees").update({ permissions: updatedPerms }).eq("id", employeeRecord.id);
        setEmployeeRecord(prev => ({ ...prev, permissions: updatedPerms }));
      }
      setMilestones(newMilestones);
      if (successMsg) alert(successMsg);
    } catch (err) {
      console.error("Failed to save milestones:", err);
      alert("Error saving milestones: " + err.message);
    }
    setIsSaving(false);
  };

  // Template handling
  const handleApplyTemplate = (templateId) => {
    setSelectedTemplate(templateId);
    if (!templateId) return;
    const tpl = templates.find(t => t.id === templateId);
    if (!tpl) return;

    if (milestones.length > 0 && !window.confirm(`Apply template "${tpl.name}"? This will replace the current milestones with the template.`)) {
      return;
    }

    const loadedSteps = tpl.steps.map((s, i) => ({
      id: Date.now() + i,
      order: s.order || i + 1,
      title: s.title,
      completed: !!s.completed,
      comments: [],
      files: []
    }));

    setMilestones(loadedSteps);
    persistMilestones(loadedSteps, `Template "${tpl.name}" loaded and saved!`);
  };

  const handleSaveAsTemplate = () => {
    if (!saveTemplateName.trim()) return;
    if (milestones.length === 0) {
      alert("Cannot save an empty template. Please add some milestones first!");
      return;
    }

    const newTpl = {
      id: `tpl_custom_${Date.now()}`,
      name: saveTemplateName.trim(),
      isDefault: false,
      steps: milestones.map(m => ({ order: m.order, title: m.title, completed: false }))
    };

    const customTemplates = templates.filter(t => !t.isDefault);
    const updatedCustom = [...customTemplates, newTpl];
    try {
      localStorage.setItem("dayal_client_milestone_templates", JSON.stringify(updatedCustom));
      setTemplates([...DEFAULT_TEMPLATES, ...updatedCustom]);
      setSelectedTemplate(newTpl.id);
      setShowSaveTemplateModal(false);
      setSaveTemplateName("");
      alert(`Template "${newTpl.name}" saved successfully!`);
    } catch(e) {
      alert("Failed to save template: " + e.message);
    }
  };

  const handleDeleteTemplate = () => {
    if (!selectedTemplate) return;
    const tpl = templates.find(t => t.id === selectedTemplate);
    if (tpl?.isDefault) {
      alert("Standard system templates cannot be deleted.");
      return;
    }
    if (!window.confirm(`Delete custom template "${tpl.name}"?`)) return;

    const customTemplates = templates.filter(t => !t.isDefault && t.id !== selectedTemplate);
    try {
      localStorage.setItem("dayal_client_milestone_templates", JSON.stringify(customTemplates));
      setTemplates([...DEFAULT_TEMPLATES, ...customTemplates]);
      setSelectedTemplate("");
      alert("Template deleted.");
    } catch(e) {}
  };

  // Milestone Actions
  const toggleMilestone = async (id, e) => {
    e.stopPropagation();
    if (!isAdmin) {
      alert("Only an admin or authorized staff can mark milestones as completed.");
      return;
    }
    const updated = milestones.map(m => m.id === id ? { ...m, completed: !m.completed } : m);
    setMilestones(updated);
    await persistMilestones(updated);
  };

  const addMilestone = async () => {
    if (!newTitle.trim()) return;
    const orderNum = parseInt(newOrder) || (milestones.length + 1);
    const newObj = {
      id: Date.now(),
      order: orderNum,
      title: newTitle.trim(),
      completed: false,
      comments: [],
      files: []
    };
    const updated = [...milestones, newObj].sort((a, b) => a.order - b.order);
    setNewTitle("");
    setNewOrder("");
    setMilestones(updated);
    await persistMilestones(updated);
  };

  const removeMilestone = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this milestone?")) return;
    const updated = milestones.filter(m => m.id !== id);
    setMilestones(updated);
    await persistMilestones(updated);
  };

  const updateMilestoneOrder = (id, newOrderVal, e) => {
    e.stopPropagation();
    const updated = milestones.map(m => m.id === id ? { ...m, order: parseInt(newOrderVal) || m.order } : m);
    setMilestones(updated);
  };

  // Per-Milestone Comments & Communications
  const handleAddComment = async (milestoneId) => {
    if (!newComment.trim()) return;
    const commentObj = {
      id: Date.now(),
      text: newComment.trim(),
      author: loggedInUser?.name || (isAdmin ? "Admin" : "Client"),
      role: isAdmin ? "Admin" : "Client",
      timestamp: new Date().toISOString()
    };

    const updated = milestones.map(m => {
      if (m.id === milestoneId) {
        return { ...m, comments: [...(m.comments || []), commentObj] };
      }
      return m;
    });

    setNewComment("");
    setMilestones(updated);
    await persistMilestones(updated);
  };

  // Per-Milestone Files Upload
  const handleFileUpload = async (milestoneId, e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const fileKey = await uploadFileToR2(file, "client_milestones");
      const fileObj = {
        id: Date.now(),
        name: file.name,
        fileKey: fileKey,
        author: loggedInUser?.name || (isAdmin ? "Admin" : "Client"),
        role: isAdmin ? "Admin" : "Client",
        timestamp: new Date().toISOString()
      };

      const updated = milestones.map(m => {
        if (m.id === milestoneId) {
          return { ...m, files: [...(m.files || []), fileObj] };
        }
        return m;
      });

      setMilestones(updated);
      await persistMilestones(updated);
    } catch (err) {
      console.error("Upload failed", err);
      alert("File upload failed.");
    }
    e.target.value = null;
  };

  const sortedMilestones = [...milestones].sort((a, b) => a.order - b.order);
  const completedCount = milestones.filter(m => m.completed).length;
  const progress = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0;

  if (loading) {
    return (
      <Card extra="p-6 bg-white border border-[#E2E8F0]">
        <div className="py-8 text-center text-gray-500 font-medium">Loading client milestones...</div>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <Card extra="p-6 border border-[#E2E8F0] bg-white shadow-sm">
        
        {/* Header & Stats */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-brand-50 text-brand-500 rounded-lg">
                <MdFlag size={22} />
              </span>
              <div>
                <h3 className="text-xl font-bold text-navy-700">Client Project Milestones</h3>
                <p className="text-xs text-gray-500">
                  {isAdmin 
                    ? `Managing milestones & deliverables for ${clientName || "Client"}`
                    : `Track your milestone progress, updates, and deliverables`}
                </p>
              </div>
            </div>
          </div>

          {/* Admin Template Controls */}
          {isAdmin && (
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 shadow-sm">
                <MdBookmarkBorder className="text-gray-500" size={16} />
                <select 
                  value={selectedTemplate} 
                  onChange={(e) => handleApplyTemplate(e.target.value)}
                  className="text-xs bg-transparent font-semibold text-navy-700 outline-none cursor-pointer"
                >
                  <option value="">Load Template...</option>
                  {templates.map(tpl => (
                    <option key={tpl.id} value={tpl.id}>
                      {tpl.name} {tpl.isDefault ? "(Preset)" : "(Custom)"}
                    </option>
                  ))}
                </select>
              </div>

              {/* Save As Template Button */}
              <button 
                type="button"
                onClick={() => setShowSaveTemplateModal(true)}
                title="Save current milestones as reusable template"
                className="text-xs bg-brand-50 hover:bg-brand-100 text-brand-600 font-bold px-3 py-2 rounded-xl transition flex items-center gap-1 border border-brand-200"
              >
                + Save Template
              </button>

              {/* Delete Custom Template */}
              {selectedTemplate && !templates.find(t => t.id === selectedTemplate)?.isDefault && (
                <button 
                  type="button"
                  onClick={handleDeleteTemplate}
                  title="Delete this custom template"
                  className="text-xs bg-red-50 hover:bg-red-100 text-red-600 font-bold px-2.5 py-2 rounded-xl transition flex items-center gap-1 border border-red-200"
                >
                  <MdDeleteOutline size={16} />
                </button>
              )}
            </div>
          )}

          {/* Completion Progress Indicator */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-2xl font-bold text-brand-500">{progress}%</div>
              <div className="text-[11px] text-gray-400 uppercase font-bold tracking-wider">
                {completedCount}/{milestones.length} Done
              </div>
            </div>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full bg-gray-100 h-2.5 rounded-full mb-6 overflow-hidden">
          <div 
            className="bg-brand-500 h-full rounded-full transition-all duration-500" 
            style={{ width: `${progress}%` }} 
          />
        </div>

        {/* Milestones List */}
        <div className="space-y-3 mb-6">
          {sortedMilestones.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-6">
              <MdPlaylistAddCheck className="text-4xl text-gray-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-600">No milestones defined for this client yet.</p>
              {isAdmin ? (
                <p className="text-xs text-gray-400 mt-1">
                  Choose a template above (e.g. L.U.C.C & Legal Services) or add custom milestones below.
                </p>
              ) : (
                <p className="text-xs text-gray-400 mt-1">
                  Your project milestones will appear here as soon as our team sets them up.
                </p>
              )}
            </div>
          ) : (
            sortedMilestones.map((m) => {
              const isExpanded = expandedMilestone === m.id;

              return (
                <div 
                  key={m.id} 
                  className={`flex flex-col rounded-xl border transition-all overflow-hidden ${
                    m.completed ? 'border-brand-200 bg-brand-50/20' : 'border-[#E2E8F0] bg-white'
                  }`}
                >
                  {/* Milestone Row */}
                  <div 
                    onClick={() => setExpandedMilestone(isExpanded ? null : m.id)}
                    className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 transition"
                  >
                    {/* Checkbox Toggle */}
                    <div 
                      onClick={(e) => toggleMilestone(m.id, e)} 
                      title={isAdmin ? "Toggle completed" : (m.completed ? "Completed" : "In Progress")}
                      className={isAdmin ? "cursor-pointer" : "cursor-default"}
                    >
                      {m.completed ? (
                        <MdCheckCircle className="text-2xl text-brand-500" />
                      ) : (
                        <MdRadioButtonUnchecked className="text-2xl text-gray-300 hover:text-brand-400" />
                      )}
                    </div>

                    {/* Step Number */}
                    {isAdmin ? (
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <span className="text-[11px] font-bold text-gray-400 uppercase">Step</span>
                        <input 
                          type="number"
                          value={m.order}
                          onChange={(e) => updateMilestoneOrder(m.id, e.target.value, e)}
                          className="w-10 h-7 text-center rounded border border-gray-200 text-xs font-bold outline-none focus:border-brand-500"
                        />
                      </div>
                    ) : (
                      <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 font-bold text-xs flex items-center justify-center">
                        {m.order}
                      </span>
                    )}

                    {/* Milestone Title */}
                    <span className={`flex-1 text-sm font-bold ${m.completed ? 'text-brand-700' : 'text-navy-700'}`}>
                      {m.title}
                    </span>

                    {/* Update Badges & Collapse Toggle */}
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-gray-400 flex items-center gap-1">
                        {(m.comments?.length || 0) + (m.files?.length || 0)} updates
                      </span>

                      {isAdmin && (
                        <button 
                          type="button"
                          onClick={(e) => removeMilestone(m.id, e)}
                          title="Delete Milestone"
                          className="text-gray-400 hover:text-red-500 p-1 rounded transition"
                        >
                          <MdDelete size={18} />
                        </button>
                      )}

                      {isExpanded ? <MdExpandLess size={22} className="text-gray-400" /> : <MdExpandMore size={22} className="text-gray-400" />}
                    </div>
                  </div>

                  {/* Expanded Milestone Workspace (Comments & Files) */}
                  {isExpanded && (
                    <div className="p-5 border-t border-gray-100 bg-gray-50/70">
                      
                      {/* Files Section */}
                      <div className="mb-5">
                        <h5 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                          <MdAttachFile size={16} /> Documents & Photos
                        </h5>
                        
                        {m.files && m.files.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                            {m.files.map(file => (
                              <div key={file.id} className="bg-white p-2.5 rounded-lg border border-gray-200 text-xs flex flex-col justify-between shadow-sm">
                                <button 
                                  type="button"
                                  onClick={async () => {
                                    if (file.fileKey) {
                                      try {
                                        const url = await getR2FileUrl(file.fileKey);
                                        window.open(url, "_blank");
                                      } catch(e) {}
                                    }
                                  }}
                                  className="truncate font-semibold text-brand-500 hover:underline text-left"
                                >
                                  {file.name}
                                </button>
                                <span className="text-[10px] text-gray-400 mt-1">Uploaded by {file.author}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-400 italic mb-3">No documents attached yet.</p>
                        )}

                        <label className="cursor-pointer bg-white border border-dashed border-brand-400 text-brand-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-brand-50 transition inline-flex items-center gap-1 shadow-sm">
                          + Attach File
                          <input type="file" className="hidden" onChange={(e) => handleFileUpload(m.id, e)} />
                        </label>
                      </div>

                      <hr className="border-gray-200 mb-5" />

                      {/* Communications & Updates */}
                      <div>
                        <h5 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2.5">
                          Milestone Communications & Updates
                        </h5>

                        <div className="space-y-2.5 mb-3 max-h-56 overflow-y-auto pr-1">
                          {m.comments && m.comments.length > 0 ? (
                            m.comments.map(c => (
                              <div 
                                key={c.id} 
                                className={`p-3 rounded-xl max-w-[85%] text-xs ${
                                  c.role === 'Admin' 
                                    ? 'bg-brand-50 border border-brand-100 ml-auto' 
                                    : 'bg-white border border-gray-200'
                                }`}
                              >
                                <div className="flex justify-between items-center mb-1 gap-2">
                                  <span className="font-bold text-navy-700">
                                    {c.author} {c.role === 'Admin' ? '(Staff)' : '(Client)'}
                                  </span>
                                  <span className="text-[10px] text-gray-400">
                                    {new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                                <p className="text-gray-600 text-sm">{c.text}</p>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-gray-400 italic">No notes or updates on this milestone yet.</p>
                          )}
                        </div>

                        {/* Add Comment Input */}
                        <div className="flex gap-2">
                          <input 
                            type="text"
                            placeholder="Add a remark or update on this milestone..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(m.id); }}
                            className="flex-1 bg-white border border-gray-200 rounded-lg px-4 py-2 text-xs outline-none focus:border-brand-500 shadow-sm"
                          />
                          <button 
                            type="button"
                            onClick={() => handleAddComment(m.id)}
                            className="bg-brand-500 text-white px-4 py-2 rounded-lg hover:bg-brand-600 transition shadow-sm text-xs font-bold flex items-center gap-1"
                          >
                            <MdSend size={15} /> Post
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

        {/* Add New Milestone (Admin Only) */}
        {isAdmin && (
          <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-gray-100">
            <input 
              type="number"
              placeholder="Step"
              value={newOrder}
              onChange={(e) => setNewOrder(e.target.value)}
              className="w-full sm:w-20 h-10 px-3 rounded-xl border border-gray-200 text-xs font-bold outline-none focus:border-brand-500"
            />
            <input 
              type="text"
              placeholder="Add a new milestone stage..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') addMilestone(); }}
              className="flex-1 h-10 px-4 rounded-xl border border-gray-200 text-xs outline-none focus:border-brand-500"
            />
            <button 
              type="button"
              onClick={addMilestone}
              disabled={isSaving}
              className="flex items-center justify-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-sm disabled:opacity-50"
            >
              <MdAdd size={18} /> Add Milestone
            </button>
          </div>
        )}

      </Card>

      {/* Save Custom Template Modal */}
      {showSaveTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h4 className="text-lg font-bold text-navy-700 mb-2">Save as Milestone Template</h4>
            <p className="text-xs text-gray-500 mb-4">
              Enter a name for this template so you can reuse these milestones for other clients.
            </p>
            <input 
              type="text"
              required
              placeholder="e.g. Standard 3-BHK Construction Plan"
              value={saveTemplateName}
              onChange={(e) => setSaveTemplateName(e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-3 text-xs outline-none focus:border-brand-500 mb-4 font-semibold text-navy-700"
            />
            <div className="flex gap-2">
              <button 
                type="button"
                onClick={() => setShowSaveTemplateModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl py-2.5 text-xs font-bold transition"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleSaveAsTemplate}
                className="flex-1 bg-brand-500 hover:bg-brand-600 text-white rounded-xl py-2.5 text-xs font-bold transition shadow-sm"
              >
                Save Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
