import React, { useState, useEffect } from "react";
import Card from "components/card";
import { createClient } from "@supabase/supabase-js";
import { MdCheckCircle, MdSave, MdRadioButtonUnchecked, MdAdd, MdDelete } from "react-icons/md";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);

const DEFAULT_STEPS = [
  { id: 1, order: 1, title: "Site Setup & Mobilization", completed: false },
  { id: 2, order: 2, title: "Excavation & Foundation", completed: false },
  { id: 3, order: 3, title: "Structural Framework & Superstructure", completed: false },
  { id: 4, order: 4, title: "Masonry & Core Works", completed: false },
  { id: 5, order: 5, title: "MEP Rough-ins (Plumbing, Electrical, HVAC)", completed: false },
  { id: 6, order: 6, title: "Plastering, Flooring & Finishes", completed: false },
  { id: 7, order: 7, title: "Handover & Final Inspection", completed: false }
];

const TabSteps = ({ projData, onUpdate }) => {
  const [steps, setSteps] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [newStep, setNewStep] = useState("");
  const [newOrder, setNewOrder] = useState("");

  useEffect(() => {
     try {
       const metadata = JSON.parse(projData.description || "{}");
       if (metadata.steps && Array.isArray(metadata.steps)) {
          // ensure existing steps have order
          const st = metadata.steps.map((s, i) => ({ ...s, order: s.order || i + 1 }));
          setSteps(st);
       } else {
          setSteps(DEFAULT_STEPS);
       }
     } catch (e) {
        setSteps(DEFAULT_STEPS);
     }
  }, [projData]);

  const toggleStep = (id) => {
      setSteps(prev => prev.map(step => step.id === id ? { ...step, completed: !step.completed } : step));
  };

  const addStep = () => {
     if (!newStep.trim()) return;
     const orderNum = parseInt(newOrder) || (steps.length + 1);
     const stepObj = { id: Date.now(), order: orderNum, title: newStep, completed: false };
     setSteps([...steps, stepObj]);
     setNewStep("");
     setNewOrder("");
  };

  const removeStep = (id) => {
      setSteps(prev => prev.filter(step => step.id !== id));
  };

  const updateStepOrder = (id, newOrderValue) => {
      setSteps(prev => prev.map(step => step.id === id ? { ...step, order: parseInt(newOrderValue) || step.order } : step));
  };

  const handleSave = async () => {
     setIsSaving(true);
     try {
       const metadata = JSON.parse(projData.description || "{}");
       metadata.steps = steps;
       
       await supabase.from("projects").update({
          description: JSON.stringify(metadata)
       }).eq("id", projData.id);
       
       if (onUpdate) onUpdate({ ...projData, description: JSON.stringify(metadata) });
       alert("Workflow steps saved successfully!");
     } catch (e) {
       alert("Failed to save: " + e.message);
     }
     setIsSaving(false);
  };

  // Sort by order before rendering
  const sortedSteps = [...steps].sort((a, b) => a.order - b.order);

  const completedCount = steps.filter(s => s.completed).length;
  const progress = steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0;

  return (
    <div className="animate-fade-in flex flex-col gap-6">
      <Card extra="p-6 border border-[#E2E8F0] bg-white">
         <div className="flex justify-between items-center mb-6">
            <div>
               <h2 className="text-[20px] font-bold text-[#0F172A]">Execution Workflow</h2>
               <p className="text-[14px] text-[#64748B]">Track site progress through predefined project milestones.</p>
            </div>
            <div className="text-right">
               <div className="text-[24px] font-bold text-[#2563EB]">{progress}%</div>
               <div className="text-[12px] text-[#64748B] uppercase font-bold tracking-wider">Completed</div>
            </div>
         </div>
         
         <div className="w-full bg-gray-100 h-3 rounded-full mb-8 overflow-hidden">
            <div className="bg-[#2563EB] h-full transition-all duration-500 rounded-full" style={{ width: `${progress}%` }}></div>
         </div>

         <div className="space-y-3 mb-6">
            {sortedSteps.map((step) => (
               <div key={step.id} className={`flex items-center gap-4 p-4 rounded-[12px] border transition ${step.completed ? 'bg-blue-50 border-blue-100' : 'bg-white border-[#E2E8F0]'}`}>
                  <div className="cursor-pointer" onClick={() => toggleStep(step.id)}>
                     {step.completed ? (
                        <MdCheckCircle className="text-[24px] text-[#2563EB]" />
                     ) : (
                        <MdRadioButtonUnchecked className="text-[24px] text-[#CBD5E1] hover:text-[#94A3B8]" />
                     )}
                  </div>
                  <div className="flex items-center gap-2">
                     <span className="text-[12px] font-bold text-[#64748B] uppercase">Step</span>
                     <input type="number" value={step.order} onChange={(e) => updateStepOrder(step.id, e.target.value)} className="w-12 h-7 text-center rounded border border-[#E2E8F0] text-[13px] font-bold outline-none" />
                  </div>
                  <span className={`flex-1 text-[15px] font-semibold ${step.completed ? 'text-[#1E40AF]' : 'text-[#0F172A]'}`}>
                     {step.title}
                  </span>
                  <button onClick={() => removeStep(step.id)} className="text-[#94A3B8] hover:text-[#DC2626] p-1"><MdDelete size={20} /></button>
               </div>
            ))}
         </div>

         <div className="flex gap-2">
            <input 
              type="number" 
              placeholder="Step No." 
              value={newOrder} 
              onChange={e => setNewOrder(e.target.value)} 
              className="w-24 h-10 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none focus:border-[#2563EB]" 
            />
            <input 
              type="text" 
              placeholder="Add a new milestone or step..." 
              value={newStep} 
              onChange={e => setNewStep(e.target.value)} 
              className="flex-1 h-10 px-4 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none focus:border-[#2563EB]" 
            />
            <button onClick={addStep} className="flex items-center gap-1 bg-[#F1F5F9] text-[#475569] px-4 rounded-[10px] text-[14px] font-bold hover:bg-[#E2E8F0] transition"><MdAdd /> Add Step</button>
         </div>
      </Card>
      
      <div className="flex justify-end">
         <button 
           onClick={handleSave} 
           disabled={isSaving}
           className="flex items-center gap-2 bg-[#2563EB] text-white px-6 py-3 rounded-[12px] font-bold hover:bg-blue-700 transition shadow-sm disabled:opacity-50"
         >
           <MdSave className="text-xl" />
           {isSaving ? "Saving..." : "Save Workflow Progress"}
         </button>
      </div>
    </div>
  );
};

export default TabSteps;
