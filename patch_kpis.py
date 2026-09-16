import sys

with open('crm/src/views/admin/clients/ClientDetail.jsx', 'r') as f:
    content = f.read()

# Add financialTotals state
if "const [financialTotals, setFinancialTotals] = useState(" not in content:
    content = content.replace(
        "const [activeServicesCount, setActiveServicesCount] = useState(0);",
        "const [activeServicesCount, setActiveServicesCount] = useState(0);\n  const [financialTotals, setFinancialTotals] = useState({ amount: 0, paid: 0, due: 0 });"
    )

# Replace fetchCounts
old_fetch = """  useEffect(() => {
    const fetchCounts = async () => {
       if (!clientData?.id) return;
       const { data: pData } = await supabase.from('projects').select('id').eq('client_id', clientData.id);
       if (pData) setActiveProjectsCount(pData.length);
       
       const { data: sData } = await supabase.from('services').select('id').eq('client_id', clientData.id);
       if (sData) setActiveServicesCount(sData.length);
    };
    fetchCounts();
  }, [clientData.id]);"""

new_fetch = """  useEffect(() => {
    const fetchCounts = async () => {
       if (!clientData?.id) return;
       const { data: pData } = await supabase.from('projects').select('*').eq('client_id', clientData.id);
       if (pData) setActiveProjectsCount(pData.length);
       
       const { data: sData } = await supabase.from('services').select('*').eq('client_id', clientData.id);
       if (sData) setActiveServicesCount(sData.length);
       
       let combined = [];
       if (pData) combined = [...combined, ...pData];
       if (sData) combined = [...combined, ...sData];
       
       let tAmount = 0; let tPaid = 0;
       combined.forEach(item => {
          try {
             const meta = JSON.parse(item.description || "{}");
             const total = parseFloat(meta.financials?.total) || 0;
             const advance = parseFloat(meta.financials?.advance) || 0;
             const payments = Array.isArray(meta.payments) ? meta.payments : [];
             const paid = advance + payments.reduce((acc, p) => acc + (parseFloat(p.amount) || 0), 0);
             tAmount += total;
             tPaid += paid;
          } catch(e) {}
       });
       setFinancialTotals({ amount: tAmount, paid: tPaid, due: tAmount - tPaid });
    };
    fetchCounts();
  }, [clientData.id]);"""

content = content.replace(old_fetch, new_fetch)

# Update KPI cards
old_kpi_admin = """            ...(isAdmin ? [
              { title: "Total Invoiced", value: "₹0.00", icon: <MdAttachMoney /> },
              { title: "Total Received", value: "₹0.00", icon: <MdAttachMoney /> },
              { title: "Outstanding", value: "₹0.00", icon: <MdAttachMoney /> }
            ] : [])"""
            
new_kpi_admin = """            ...(isAdmin ? [
              { title: "Total Invoiced", value: ₹, icon: <MdAttachMoney /> },
              { title: "Total Received", value: ₹, icon: <MdAttachMoney /> },
              { title: "Outstanding", value: ₹, icon: <MdAttachMoney /> }
            ] : [])"""
            
content = content.replace(old_kpi_admin, new_kpi_admin)

with open('crm/src/views/admin/clients/ClientDetail.jsx', 'w') as f:
    f.write(content)

print("Patched ClientDetail KPIs")
