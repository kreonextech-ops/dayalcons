import os

filepath = 'crm/src/views/admin/crm/index.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the select in index.jsx
old_select = """                            <select 
                              className="w-full h-11 px-3 rounded-[10px] border border-[#E2E8F0] dark:border-navy-700 text-[14px] text-[#0F172A] dark:text-white outline-none focus:border-[#2563EB] transition-colors"
                              value={["Website", "Referral", "Walk-in"].includes(newLead.source) ? newLead.source : "Other"}
                              onChange={e => {
                                 if (e.target.value !== "Other") setNewLead({...newLead, source: e.target.value});
                                 else setNewLead({...newLead, source: "Other"}); 
                              }}
                            >
                              <option value="">Select source...</option>
                              <option value="Website">Website</option>
                              <option value="Referral">Referral</option>
                              <option value="Walk-in">Walk-in</option>
                              <option value="Other">Other</option>
                            </select>"""

# Wait, let me check the exact string in index.jsx first!
