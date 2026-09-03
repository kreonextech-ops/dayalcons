import React from "react";
import Card from "components/card";

const ViewGantt = ({ tasks = [], onTaskClick }) => {
  // Filter tasks that have both start and due dates
  const scheduledTasks = tasks.filter(t => t.startDate && t.dueDate);

  if (scheduledTasks.length === 0) {
    return (
      <div className="animate-fade-in">
         <Card extra="border border-[#E2E8F0] shadow-sm p-8 min-h-[500px] flex flex-col items-center justify-center bg-gray-50/50">
            <h3 className="text-[20px] font-bold text-[#0F172A] mb-2">No Scheduled Tasks</h3>
            <p className="text-[14px] text-[#64748B] text-center max-w-md">Create tasks with both a Start Date and a Due Date to see them on the Gantt timeline.</p>
         </Card>
      </div>
    );
  }

  // Find min and max dates
  const minDate = new Date(Math.min(...scheduledTasks.map(t => new Date(t.startDate))));
  const maxDate = new Date(Math.max(...scheduledTasks.map(t => new Date(t.dueDate))));
  
  // Add some padding (e.g. 2 days before and 2 days after)
  minDate.setDate(minDate.getDate() - 2);
  maxDate.setDate(maxDate.getDate() + 2);

  const totalDays = Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24));
  
  // Generate days array for the header
  const days = [];
  for (let i = 0; i <= totalDays; i++) {
     const d = new Date(minDate);
     d.setDate(d.getDate() + i);
     days.push(d);
  }

  return (
    <div className="animate-fade-in">
       <Card extra="border border-[#E2E8F0] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
             <div className="min-w-[800px]">
                {/* Header Row (Dates) */}
                <div className="flex bg-[#F8FAFC] border-b border-[#E2E8F0] sticky top-0 z-10">
                   <div className="w-64 flex-shrink-0 p-4 font-bold text-[11px] text-[#64748B] uppercase border-r border-[#E2E8F0]">
                      Task Name
                   </div>
                   <div className="flex-1 flex">
                      {days.map((d, i) => (
                         <div key={i} className="flex-1 min-w-[40px] border-r border-gray-100 p-2 text-center">
                            <span className="block text-[10px] text-gray-400">{d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                            <span className="block text-[11px] font-bold text-gray-700">{d.getDate()}</span>
                         </div>
                      ))}
                   </div>
                </div>

                {/* Task Rows */}
                <div className="bg-white relative">
                   {scheduledTasks.map((t, idx) => {
                      const taskStart = new Date(t.startDate);
                      const taskEnd = new Date(t.dueDate);
                      const startOffset = Math.max(0, (taskStart - minDate) / (1000 * 60 * 60 * 24));
                      const duration = Math.max(1, (taskEnd - taskStart) / (1000 * 60 * 60 * 24) + 1);
                      const widthPercent = (duration / days.length) * 100;
                      const leftPercent = (startOffset / days.length) * 100;

                      return (
                         <div key={t.id} onClick={() => onTaskClick && onTaskClick(t)} className="flex border-b border-gray-100 group hover:bg-gray-50 transition cursor-pointer">
                            <div className="w-64 flex-shrink-0 p-3 border-r border-[#E2E8F0]">
                               <p className="text-[13px] font-bold text-[#0F172A] truncate">{t.title}</p>
                               <p className="text-[11px] text-gray-500 truncate">{t.assigneeName || 'Unassigned'}</p>
                            </div>
                            <div className="flex-1 relative flex items-center p-2">
                               {/* Grid lines */}
                               <div className="absolute inset-0 flex pointer-events-none">
                                  {days.map((_, i) => (
                                     <div key={i} className="flex-1 border-r border-gray-50"></div>
                                  ))}
                               </div>
                               
                               {/* Task Bar */}
                               <div 
                                  className={`absolute h-8 rounded-md flex items-center px-3 shadow-sm truncate text-[11px] font-bold text-white transition-all
                                     ${t.status === 'Completed' ? 'bg-[#10B981]' : 
                                       t.status === 'In Progress' ? 'bg-[#2563EB]' : 'bg-[#64748B]'}`}
                                  style={{ 
                                     left: `${leftPercent}%`, 
                                     width: `calc(${widthPercent}% - 4px)`,
                                     minWidth: '20px'
                                  }}
                               >
                                  {t.status}
                               </div>
                            </div>
                         </div>
                      );
                   })}
                </div>
             </div>
          </div>
       </Card>
    </div>
  );
};

export default ViewGantt;
