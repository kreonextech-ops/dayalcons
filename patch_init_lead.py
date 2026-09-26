import os
import re

filepath = 'crm/src/views/admin/crm/LeadDetail.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

old_init = """  const [leadData, setLeadData] = useState({
    id: lead?.id,
    name: lead?.name || "",
    phone: lead?.phone || "",
    email: lead?.email || "",
    address: lead?.address || "",
    source: lead?.source || "",
    status: lead?.status || "New",
    service_type: lead?.service_type || "",
    lead_temperature: lead?.lead_temperature || "",
    assigned_to: lead?.assigned_to || "",
    notes: lead?.notes || "",
    budget: "",
    plotSize: "",
    timeline: "",
    frontRoadWidth: "",
    orientation: "",
    plannedFloors: "",
    soilType: "",
    waterSource: "",
    electricity: "",
    municipalApproval: "",
    vastu: "",
    ...lead // Ensure all original fields are retained!
  });"""

# wait, I don't know the exact string at the bottom.
# Let's just do a simple replacement for the start of it.
