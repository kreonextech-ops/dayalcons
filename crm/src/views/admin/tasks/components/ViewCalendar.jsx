import React, { useState } from "react";
import Card from "components/card";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

const ViewCalendar = ({ tasks = [], onDateClick, onTaskClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  // Generate grid cells
  const blanks = Array(firstDayOfMonth).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const grid = [...blanks, ...days];

  return (
    <div className="animate-fade-in">
       <Card extra="border border-[#E2E8F0] shadow-sm bg-white overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#E2E8F0]">
             <h3 className="text-[18px] font-bold text-[#0F172A]">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
             <div className="flex gap-2">
                <button onClick={prevMonth} className="p-2 border border-[#E2E8F0] rounded-lg hover:bg-gray-50 transition text-gray-500">
                   <MdChevronLeft size={20} />
                </button>
                <button onClick={nextMonth} className="p-2 border border-[#E2E8F0] rounded-lg hover:bg-gray-50 transition text-gray-500">
                   <MdChevronRight size={20} />
                </button>
             </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 border-b border-[#E2E8F0] bg-gray-50">
             {weekDays.map(day => (
                <div key={day} className="py-2 text-center text-[12px] font-bold text-[#64748B] uppercase">{day}</div>
             ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 auto-rows-[minmax(120px,auto)] bg-[#E2E8F0] gap-[1px] border-b border-l border-r border-[#E2E8F0]">
             {grid.map((day, idx) => {
                if (!day) return <div key={idx} className="bg-gray-50/50"></div>;
                
                const cellDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                // Adjust for timezone differences when comparing string output (YYYY-MM-DD)
                const dateString = new Date(cellDate.getTime() - (cellDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
                
                // Find tasks due on this day
                const dayTasks = tasks.filter(t => t.dueDate === dateString);

                return (
                   <div key={idx} 
                        className="bg-white p-2 hover:bg-gray-50 transition flex flex-col group cursor-pointer"
                        onClick={(e) => {
                           // Only trigger date click if we click the cell itself, not a task inside it
                           if (e.target === e.currentTarget && onDateClick) onDateClick(dateString);
                        }}>
                      <span 
                         onClick={() => onDateClick && onDateClick(dateString)}
                         className={`text-[12px] font-bold w-6 h-6 flex items-center justify-center rounded-full mb-1 cursor-pointer hover:bg-gray-200
                         ${day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear() 
                           ? 'bg-[#2563EB] text-white hover:bg-[#1D4ED8]' : 'text-[#64748B] group-hover:text-[#0F172A]'}`}>
                         {day}
                      </span>
                      <div className="flex-1 flex flex-col gap-1 overflow-y-auto custom-scrollbar pr-1 pointer-events-none">
                         {dayTasks.map(t => (
                            <div key={t.id} 
                               onClick={(e) => { e.stopPropagation(); if(onTaskClick) onTaskClick(t); }}
                               className={`pointer-events-auto text-[10px] p-1.5 rounded truncate border shadow-sm font-bold cursor-pointer hover:shadow-md
                                  ${t.status === 'Completed' ? 'bg-green-50 border-green-200 text-green-700' :
                                    t.status === 'In Progress' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                                    t.priority === 'High' || t.priority === 'Critical' ? 'bg-red-50 border-red-200 text-red-700' :
                                    'bg-white border-gray-200 text-gray-700'
                                  }`}
                               title={t.title}
                            >
                               {t.title}
                            </div>
                         ))}
                      </div>
                   </div>
                );
             })}
          </div>

       </Card>
    </div>
  );
};

export default ViewCalendar;
