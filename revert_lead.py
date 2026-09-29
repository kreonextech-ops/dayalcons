with open('crm/src/views/admin/crm/LeadDetail.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('import TabQuotationBuilder from "./components/TabQuotationBuilder";', 'import TabEstimate from "./components/TabEstimate";')
c = c.replace('{activeTab === "Quotation" && <TabQuotationBuilder leadData={leadData} />}', '{activeTab === "Quotation" && <TabEstimate leadData={leadData} />}')

with open('crm/src/views/admin/crm/LeadDetail.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
