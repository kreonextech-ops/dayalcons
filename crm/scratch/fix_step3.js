const fs = require('fs');
let code = fs.readFileSync('src/views/admin/employees/index.jsx', 'utf8');

const startIdx = code.indexOf('{/* Step 3: Login Credentials */}');
const endIdx = code.indexOf('{/* Step 4: Finish */}');

const newCode = code.substring(0, startIdx) + 
`{/* Step 3: Login Credentials */}
                    {modalStep === 3 && (
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
                    )}

                    ` + code.substring(endIdx);

fs.writeFileSync('src/views/admin/employees/index.jsx', newCode);
