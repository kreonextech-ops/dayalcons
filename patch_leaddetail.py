import re

with open('crm/src/views/admin/crm/LeadDetail.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Update the import
c = c.replace('import TabEstimate from "./components/TabEstimate";', 'import TabQuotationBuilder from "./components/TabQuotationBuilder";')

# 2. Update the rendering of the Quotation tab
c = c.replace('{activeTab === "Quotation" && <TabEstimate leadData={leadData} />}', '{activeTab === "Quotation" && <TabQuotationBuilder leadData={leadData} />}')

# 3. Just in case isAdmin is not set or it hides the Quotation tab from CROs, let's fix the tabs array
c = c.replace('...(isAdmin ? ["Quotation"] : []),', '"Quotation",')

with open('crm/src/views/admin/crm/LeadDetail.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
