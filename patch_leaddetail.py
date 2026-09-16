import sys
import re

with open('crm/src/views/admin/crm/LeadDetail.jsx', 'r') as f:
    content = f.read()

# Update dropdowns
select_html_1 = """<option value="New">STATUS: NEW</option>
              <option value="Contacted">STATUS: CONTACTED</option>
              <option value="Visit">STATUS: SITE VISIT</option>
              <option value="Quotation">STATUS: QUOTATION</option>
              <option value="Negotiation">STATUS: NEGOTIATION</option>
              <option value="Won">STATUS: WON</option>
              <option value="Lost">STATUS: LOST</option>"""
new_select_1 = """<option value="Ongoing">STATUS: ONGOING</option>
              <option value="Success">STATUS: SUCCESS</option>
              <option value="Closed">STATUS: CLOSED</option>"""

select_html_2 = """<option value="New">New</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Visit">Site Visit</option>
                              <option value="Quotation">Quotation</option>
                              <option value="Negotiation">Negotiation</option>
                              <option value="Won">Won</option>
                              <option value="Lost">Lost</option>"""
new_select_2 = """<option value="Ongoing">Ongoing</option>
                              <option value="Success">Success</option>
                              <option value="Closed">Closed</option>"""

content = content.replace(select_html_1, new_select_1)
content = content.replace(select_html_2, new_select_2)

# Update DirectStatusChange
content = content.replace('if (newStatus === "Won") {', 'if (newStatus === "Success") {')

# Color coding for status in header
old_color_1 = "leadData.status === 'Lost' ? 'bg-red-500 text-white' : leadData.status === 'Won' ? 'bg-green-600 text-white'"
new_color_1 = "leadData.status === 'Closed' ? 'bg-red-500 text-white' : leadData.status === 'Success' ? 'bg-green-600 text-white'"
content = content.replace(old_color_1, new_color_1)

# Inside handleConvertToClient
content = content.replace('status: "Won"', 'status: "Success"')

with open('crm/src/views/admin/crm/LeadDetail.jsx', 'w') as f:
    f.write(content)

print("Updated LeadDetail.jsx")
