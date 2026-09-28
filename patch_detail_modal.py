with open('crm/src/views/admin/clients/ClientDetail.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Add state
idx1 = c.find('const [showConvertModal, setShowConvertModal] = useState(false);')
c = c[:idx1] + 'const [showConvertModal, setShowConvertModal] = useState(false);\n  const [showErrorModal, setShowErrorModal] = useState(null);\n' + c[idx1 + len('const [showConvertModal, setShowConvertModal] = useState(false);'):]

# 2. Rewrite Convert
old_conv = """  const handleConvertBackToLead = async () => {
    const { error: insertErr } = await supabase.from('leads').insert([{
       name: clientData.name, phone: clientData.phone, email: clientData.email,
       address: clientData.address, source: clientData.source, status: 'Contacted',
       service_type: clientData.work_types,
       lead_temperature: clientData.leadData?.lead_temperature || 'Warm',
       notes: clientData.leadData?.notes || 'Converted back from Client'
    }]);
    if (insertErr) { alert("Failed to create lead."); return; }
    
    const { error: delErr2 } = await supabase.from('clients').delete().eq('id', clientData.id);
    if (delErr2) { alert("Cannot convert: Client has active projects or services attached to them. Delete those first."); return; }
    onBack({ id: clientData.id, deleted: true });
  };"""

new_conv = """  const handleConvertBackToLead = async () => {
    const { error: delErr2 } = await supabase.from('clients').delete().eq('id', clientData.id);
    if (delErr2) { 
        setShowConvertModal(false);
        setShowErrorModal("Cannot convert this Client back to a Lead because they currently have active Projects or Services attached to them. Please delete the associated projects/services first."); 
        return; 
    }

    const { error: insertErr } = await supabase.from('leads').insert([{
       name: clientData.name, phone: clientData.phone, email: clientData.email,
       address: clientData.address, source: clientData.source, status: 'Contacted',
       service_type: clientData.work_types,
       lead_temperature: clientData.leadData?.lead_temperature || 'Warm',
       notes: clientData.leadData?.notes || 'Converted back from Client'
    }]);
    if (insertErr) { alert("Failed to create lead."); return; }
    
    onBack({ id: clientData.id, deleted: true });
  };"""
c = c.replace(old_conv, new_conv)

# 3. Rewrite Delete
old_del = """  const handleDeleteClientFromDetail = async () => {
    if (!window.confirm("Are you sure you want to permanently delete this Client? This action cannot be undone.")) return;
    const { error: delErr } = await supabase.from("clients").delete().eq("id", clientData.id);
    if (delErr) { alert("Cannot delete: Client has active projects, tasks, or services attached to them. Delete those first."); return; }
    onBack({ id: clientData.id, deleted: true });
  };"""

new_del = """  const handleDeleteClientFromDetail = async () => {
    if (!window.confirm("Are you sure you want to permanently delete this Client? This action cannot be undone.")) return;
    const { error: delErr } = await supabase.from("clients").delete().eq("id", clientData.id);
    if (delErr) { 
       setShowErrorModal("Cannot delete this Client because they currently have active Projects, Tasks, or Services attached to them. Please delete the associated records first."); 
       return; 
    }
    onBack({ id: clientData.id, deleted: true });
  };"""
c = c.replace(old_del, new_del)

# 4. Add Error Modal JSX
idx2 = c.find('{showConvertModal && (');
modal_jsx = """      {showErrorModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-[400px] bg-white dark:bg-navy-800 rounded-[20px] shadow-[0_20px_60px_rgba(15,23,42,0.2)] p-6 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-[#DC2626] text-3xl mx-auto mb-4">
              <MdClose />
            </div>
            <h2 className="text-[20px] font-bold text-[#0F172A] dark:text-white mb-2">Action Blocked</h2>
            <p className="text-[14px] text-[#64748B] dark:text-gray-400 mb-6">{showErrorModal}</p>
            <div className="flex justify-center">
              <button onClick={() => setShowErrorModal(null)} className="w-full h-11 rounded-[12px] bg-[#DC2626] text-[14px] font-bold text-white hover:bg-red-700 transition shadow-md">Understood</button>
            </div>
          </div>
        </div>
      )}
      
"""
c = c[:idx2] + modal_jsx + c[idx2:]

with open('crm/src/views/admin/clients/ClientDetail.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
