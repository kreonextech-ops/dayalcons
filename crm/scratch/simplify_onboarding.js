const fs = require('fs');
let code = fs.readFileSync('src/views/admin/employees/index.jsx', 'utf8');

// Replace Step 3
const step3Regex = /\{modalStep === 3 && \([\s\S]*?\}\)/;
const newStep3 = `{modalStep === 3 && (
                       <div className="animate-fade-in max-w-2xl mx-auto">
                          <h3 className="text-[18px] font-bold text-[#0F172A] mb-6 text-center">System Access & Login</h3>
                          <div className="bg-[#F8FAFC] p-6 rounded-[16px] border border-[#E2E8F0] space-y-6">
                             <p className="text-[14px] text-gray-500 mb-4">Every employee requires login credentials. Their access will automatically be restricted to only the items they are assigned to.</p>
                             <div className="animate-fade-in space-y-5 pt-4 border-t border-[#E2E8F0]">
                                <div><label className="block text-[11px] font-bold text-[#475569] mb-1.5 uppercase">Login ID / Email *</label><input type="email" value={newEmp.loginEmail} onChange={(e) => setNewEmp({...newEmp, loginEmail: e.target.value})} placeholder="employee@dayalcrm.com" className="w-full h-11 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none focus:border-[#2563EB]" /></div>
                                <div>
                                   <label className="block text-[11px] font-bold text-[#475569] mb-1.5 uppercase">Secure Password *</label>
                                   <input type="text" value={newEmp.loginPassword} onChange={(e) => setNewEmp({...newEmp, loginPassword: e.target.value})} placeholder="Enter password" className="w-full h-11 px-3 rounded-[10px] border border-[#E2E8F0] text-[14px] outline-none focus:border-[#2563EB]" />
                                </div>
                             </div>
                          </div>
                       </div>
                    )}`;
code = code.replace(step3Regex, newStep3);

// Remove Step 4 (Permissions)
const step4Regex = /\{modalStep === 4 && \([\s\S]*?\}\)/;
code = code.replace(step4Regex, '');

// Rename Step 5 to Step 4
code = code.replace(/modalStep === 5/g, 'modalStep === 4');
code = code.replace(/modalStep < 5/g, 'modalStep < 4');

// Adjust footer dots
const footerDots = /\{\[1,2,3,4,5\]\.map\(dot => \(/;
code = code.replace(footerDots, '{[1,2,3,4].map(dot => (');

fs.writeFileSync('src/views/admin/employees/index.jsx', code);
