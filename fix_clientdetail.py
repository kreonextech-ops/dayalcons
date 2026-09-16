import sys

with open('crm/src/views/admin/clients/ClientDetail.jsx', 'r') as f:
    content = f.read()

bad_block = """  const [activeProjectsCount, setActiveProjectsCount] = useState(0);
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

# Remove bad block
content = content.replace(bad_block, "")

# Find where clientData is defined
target = "const [clientData, setClientData] = useState({"
pos = content.find(target)
# find the closing of the useState block
pos2 = content.find("});", pos) + 3

# insert the block after clientData
content = content[:pos2] + "\n\n" + bad_block + content[pos2:]

with open('crm/src/views/admin/clients/ClientDetail.jsx', 'w') as f:
    f.write(content)

print("Fixed ClientDetail reference error")
