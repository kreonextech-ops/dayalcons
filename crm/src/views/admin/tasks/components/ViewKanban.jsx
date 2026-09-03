import React from "react";
import { MdAdd, MdMessage, MdAttachFile } from "react-icons/md";

const TaskCard = ({ task, onSelect }) => (
   <div onClick={() => onSelect(task)} className="bg-white p-4 rounded-xl shadow-sm border border-[#E2E8F0] mb-3 cursor-pointer hover:shadow-md transition group">
      <div className="flex justify-between items-start mb-2">
         <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            task.priority === 'High' || task.priority === 'Critical' ? 'bg-red-50 text-red-600' :
            task.priority === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-gray-100 text-gray-600'
         }`}>{task.priority}</span>
         <span className="text-[10px] text-gray-400 font-bold">TSK-{task.id?.split('-')[0].toUpperCase()}</span>
      </div>
      <h5 className="text-[13px] font-bold text-[#0F172A] mb-1 group-hover:text-[#2563EB] transition leading-tight">{task.title}</h5>
      <p className="text-[11px] text-[#64748B] mb-3 line-clamp-2">{task.description || "No description provided."}</p>
      
      {task.linkedRecordName && (
         <div className="mb-3 px-2 py-1 bg-gray-50 border border-gray-200 rounded-md text-[10px] font-bold text-gray-500 truncate">
            🔗 {task.linkedRecordName} ({task.module})
         </div>
      )}

      <div className="flex justify-between items-center border-t border-gray-100 pt-3">
         <div className="flex items-center gap-1.5 text-gray-400 text-[12px]">
            <MdMessage className="hover:text-gray-600 cursor-pointer" /> <span className="text-[10px]">0</span>
            <MdAttachFile className="hover:text-gray-600 cursor-pointer ml-1" /> <span className="text-[10px]">0</span>
         </div>
         {task.assigneeName ? (
            <div className="flex items-center gap-1.5">
               <span className="text-[10px] font-bold text-gray-500">{task.assigneeName}</span>
               <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">
                  {task.assigneeName.charAt(0)}
               </div>
            </div>
         ) : (
            <div className="w-6 h-6 rounded-full border border-dashed border-gray-300 flex items-center justify-center text-gray-300 text-[10px]">+</div>
         )}
      </div>
   </div>
);

const ViewKanban = ({ onSelect, onAddClick, tasks = [] }) => {
  const getTasks = (status) => tasks.filter(t => t.status === status);
  
  return (
    <div className="animate-fade-in flex gap-4 overflow-x-auto pb-6 pt-2 custom-scrollbar min-h-[500px]">
       
       {/* Column: To Do */}
       <div className="flex-none w-[300px] bg-gray-100/50 border border-[#E2E8F0] rounded-2xl p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4 px-1">
             <h4 className="text-[13px] font-bold text-[#475569] uppercase tracking-wider flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-400"></div> To Do <span className="ml-1 text-gray-400 bg-white px-2 py-0.5 rounded-md border border-gray-200">{getTasks("To Do").length}</span>
             </h4>
             <button onClick={() => onAddClick && onAddClick("To Do")} className="text-gray-400 hover:text-[#0F172A] transition"><MdAdd size={20}/></button>
          </div>
          <div className="flex-1 min-h-[120px]">
             {getTasks("To Do").map(t => <TaskCard key={t.id} task={t} onSelect={onSelect} />)}
             {getTasks("To Do").length === 0 && <div className="h-full border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-[12px] font-bold text-gray-400 bg-gray-50/50">Drop tasks here</div>}
          </div>
       </div>

       {/* Column: In Progress */}
       <div className="flex-none w-[300px] bg-blue-50/30 border border-blue-100 rounded-2xl p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4 px-1">
             <h4 className="text-[13px] font-bold text-[#2563EB] uppercase tracking-wider flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#2563EB]"></div> In Progress <span className="ml-1 text-blue-400 bg-white px-2 py-0.5 rounded-md border border-blue-200">{getTasks("In Progress").length}</span>
             </h4>
             <button onClick={() => onAddClick && onAddClick("In Progress")} className="text-blue-400 hover:text-[#2563EB] transition"><MdAdd size={20}/></button>
          </div>
          <div className="flex-1 min-h-[120px]">
             {getTasks("In Progress").map(t => <TaskCard key={t.id} task={t} onSelect={onSelect} />)}
             {getTasks("In Progress").length === 0 && <div className="h-full border-2 border-dashed border-blue-200 rounded-xl flex items-center justify-center text-[12px] font-bold text-blue-300 bg-blue-50/50">Drop tasks here</div>}
          </div>
       </div>

       {/* Column: Needs Approval */}
       <div className="flex-none w-[300px] bg-amber-50/30 border border-amber-100 rounded-2xl p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4 px-1">
             <h4 className="text-[13px] font-bold text-[#D97706] uppercase tracking-wider flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></div> Needs Approval <span className="ml-1 text-amber-400 bg-white px-2 py-0.5 rounded-md border border-amber-200">{getTasks("Needs Approval").length}</span>
             </h4>
             <button onClick={() => onAddClick && onAddClick("Needs Approval")} className="text-amber-400 hover:text-[#D97706] transition"><MdAdd size={20}/></button>
          </div>
          <div className="flex-1 min-h-[120px]">
             {getTasks("Needs Approval").map(t => <TaskCard key={t.id} task={t} onSelect={onSelect} />)}
             {getTasks("Needs Approval").length === 0 && <div className="h-full border-2 border-dashed border-amber-200 rounded-xl flex items-center justify-center text-[12px] font-bold text-amber-300 bg-amber-50/50">Drop tasks here</div>}
          </div>
       </div>

       {/* Column: Approved */}
       <div className="flex-none w-[300px] bg-cyan-50/30 border border-cyan-100 rounded-2xl p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4 px-1">
             <h4 className="text-[13px] font-bold text-[#0891B2] uppercase tracking-wider flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#06B6D4]"></div> Approved <span className="ml-1 text-cyan-400 bg-white px-2 py-0.5 rounded-md border border-cyan-200">{getTasks("Approved").length}</span>
             </h4>
             <button onClick={() => onAddClick && onAddClick("Approved")} className="text-cyan-400 hover:text-[#0891B2] transition"><MdAdd size={20}/></button>
          </div>
          <div className="flex-1 min-h-[120px]">
             {getTasks("Approved").map(t => <TaskCard key={t.id} task={t} onSelect={onSelect} />)}
             {getTasks("Approved").length === 0 && <div className="h-full border-2 border-dashed border-cyan-200 rounded-xl flex items-center justify-center text-[12px] font-bold text-cyan-300 bg-cyan-50/50">Drop tasks here</div>}
          </div>
       </div>

       {/* Column: Completed */}
       <div className="flex-none w-[300px] bg-green-50/30 border border-green-100 rounded-2xl p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4 px-1">
             <h4 className="text-[13px] font-bold text-[#059669] uppercase tracking-wider flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></div> Completed <span className="ml-1 text-green-400 bg-white px-2 py-0.5 rounded-md border border-green-200">{getTasks("Completed").length}</span>
             </h4>
             <button onClick={() => onAddClick && onAddClick("Completed")} className="text-green-400 hover:text-[#059669] transition"><MdAdd size={20}/></button>
          </div>
          <div className="flex-1 min-h-[120px]">
             {getTasks("Completed").map(t => <TaskCard key={t.id} task={t} onSelect={onSelect} />)}
             {getTasks("Completed").length === 0 && <div className="h-full border-2 border-dashed border-green-200 rounded-xl flex items-center justify-center text-[12px] font-bold text-green-300 bg-green-50/50">Drop tasks here</div>}
          </div>
       </div>

    </div>
  );
};

export default ViewKanban;
