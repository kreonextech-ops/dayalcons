import React from "react";
import Card from "components/card";

const TabActivity = () => {
  return (
    <div className="animate-fade-in max-w-4xl">
       <div className="flex justify-between items-center mb-6">
         <div>
            <h3 className="text-[18px] font-bold text-[#0F172A]">Audit Trail & Activity Log</h3>
            <p className="text-[13px] text-[#64748B]">Automatic, immutable log of all actions taken on this task.</p>
         </div>
       </div>

       <Card extra="border border-[#E2E8F0] shadow-sm">
          <div className="p-16 text-center">
             <h3 className="text-[16px] font-bold text-[#0F172A] mb-2">No Activity Logged</h3>
             <p className="text-[14px] text-[#64748B]">System events will appear here automatically.</p>
          </div>
       </Card>
    </div>
  );
};

export default TabActivity;
