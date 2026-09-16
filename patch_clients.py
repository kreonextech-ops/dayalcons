import sys

# 1. Update clients/index.jsx
with open('crm/src/views/admin/clients/index.jsx', 'r') as f:
    content = f.read()

# Replace header
content = content.replace(
    '<th className="py-4 px-4 text-[12px] font-medium text-[#64748B] dark:text-gray-400 uppercase tracking-wider">Active Projects</th>',
    '<th className="py-4 px-4 text-[12px] font-medium text-[#64748B] dark:text-gray-400 uppercase tracking-wider">Services & Projects</th>'
)

# Replace table cell
content = content.replace(
    '<td className="py-4 px-4 text-sm text-gray-600 font-bold">\n                                {client.activeProjectsCount || 0}\n                               </td>',
    '<td className="py-4 px-4 text-[13px] font-medium text-brand-500">\n                                <div className="max-w-[150px] truncate" title={client.work_types || "-"}>{client.work_types || "-"}</div>\n                               </td>'
)

with open('crm/src/views/admin/clients/index.jsx', 'w') as f:
    f.write(content)


# 2. Update clients/ClientDetail.jsx
with open('crm/src/views/admin/clients/ClientDetail.jsx', 'r') as f:
    content = f.read()

# Add state for KPI
state_injection = """  const [activeProjectsCount, setActiveProjectsCount] = useState(0);
  const [activeServicesCount, setActiveServicesCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
       if (!clientData?.id) return;
       const { data: pData } = await supabase.from('projects').select('id').eq('client_id', clientData.id);
       if (pData) setActiveProjectsCount(pData.length);
       
       const { data: sData } = await supabase.from('services').select('id').eq('client_id', clientData.id);
       if (sData) setActiveServicesCount(sData.length);
    };
    fetchCounts();
  }, [clientData.id]);"""

if 'activeProjectsCount' not in content:
    content = content.replace("const [comments, setComments] = useState([]);", "const [comments, setComments] = useState([]);\n" + state_injection)

# Update KPI block
old_kpi = """{ title: "Active Projects", value: "0", icon: <MdBusinessCenter /> },"""
new_kpi = """{ title: "Active Projects", value: activeProjectsCount.toString(), icon: <MdBusinessCenter /> },
            { title: "Active Services", value: activeServicesCount.toString(), icon: <MdBusinessCenter /> },"""
content = content.replace(old_kpi, new_kpi)

with open('crm/src/views/admin/clients/ClientDetail.jsx', 'w') as f:
    f.write(content)

print("Patched client KPIs and list")
