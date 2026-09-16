import sys
import re

with open('crm/src/views/admin/clients/ClientDetail.jsx', 'r') as f:
    content = f.read()

# Fix isAdmin
old_isadmin = "const isAdmin = loggedInUser?.role === 'Admin';"
new_isadmin = "const isAdmin = loggedInUser?.role === 'Admin' || (loggedInUser?.role && loggedInUser.role.toUpperCase() === 'CRO') || (loggedInUser?.designation && loggedInUser.designation.toUpperCase().includes('CRO'));"
content = content.replace(old_isadmin, new_isadmin)

# Change tab array
old_tabs = "...(isAdmin ? [\"Amount\"] : [])"
new_tabs = "...(isAdmin ? [\"Financials & Billing\"] : [])"
content = content.replace(old_tabs, new_tabs)

# Change tab content
old_tab_content = """{activeTab === "Amount" && (
              <TabEstimate leadData={clientData} isClient={true} />
            )}"""
new_tab_content = """{activeTab === "Financials & Billing" && (
              <TabFinancials clientData={clientData} />
            )}"""
content = content.replace(old_tab_content, new_tab_content)

with open('crm/src/views/admin/clients/ClientDetail.jsx', 'w') as f:
    f.write(content)

print("Patched ClientDetail for Financials tab")
