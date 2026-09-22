import os

filepath = 'crm/src/views/admin/crm/LeadDetail.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target = """            {/* Tab Content */}
          <div className="min-h-[500px]">
            {activeTab === "Overview" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Client Info Card */}"""

new_val = """            {/* Tab Content */}
          <div className="min-h-[500px]">
            {activeTab === "Overview" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
                {lead.duplicate_history && lead.duplicate_history.length > 0 && (
                  <div className="md:col-span-2 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
                     <div className="flex">
                        <div className="flex-shrink-0">
                           <MdCheckCircle className="h-5 w-5 text-yellow-400" />
                        </div>
                        <div className="ml-3">
                           <h3 className="text-sm font-medium text-yellow-800">Duplicate Submissions Detected</h3>
                           <div className="mt-2 text-sm text-yellow-700">
                              <p>This phone number has submitted <b>{lead.duplicate_history.length + 1}</b> quotes/inquiries. We have grouped them together here to prevent clutter.</p>
                              <ul className="list-disc pl-5 mt-2 space-y-1">
                                 {lead.duplicate_history.map((dh, i) => (
                                    <li key={i}>
                                       {new Date(dh.created_at).toLocaleString()} — {dh.source || "Website"} — {Array.isArray(dh.service_type) ? dh.service_type.join(", ") : (dh.service_type || "")}
                                    </li>
                                 ))}
                              </ul>
                           </div>
                        </div>
                     </div>
                  </div>
                )}
                
                {/* Client Info Card */}"""

if target in content:
    content = content.replace(target, new_val)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Patched LeadDetail duplicates notice")
else:
    print("Target not found in LeadDetail")
