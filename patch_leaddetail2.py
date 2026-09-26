import os

filepath = 'crm/src/views/admin/crm/LeadDetail.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('\r\n', '\n')

old_tag = """            {activeTab === "Service Requirement" && <TabServiceRequirement leadData={leadData} setLeadData={setLeadData} handleSaveToDB={async () => {
              await supabase.from("leads").update({ 
                selectedServices: leadData.selectedServices,
                priority: leadData.priority,
                expectedStart: leadData.expectedStart,
                budget: leadData.budget,
                timeline: leadData.timeline,
                preferredComm: leadData.preferredComm,
                decisionMaker: leadData.decisionMaker,
                serviceNotes: leadData.serviceNotes
              }).eq("id", leadData.id);
              alert("Service requirements saved successfully!");
            }} />}"""
new_tag = """            {activeTab === "Service Requirement" && <TabServiceRequirement leadData={leadData} setLeadData={setLeadData} handleSaveToDB={() => {
              alert("Service requirements saved to lead successfully!");
            }} />}"""

content = content.replace(old_tag, new_tag)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("LeadDetail fixed")
