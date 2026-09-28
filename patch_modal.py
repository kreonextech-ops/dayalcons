with open('crm/src/views/admin/clients/index.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Add state
idx1 = c.find('const [showDeleteModal, setShowDeleteModal] = useState(null);')
c = c[:idx1] + 'const [showDeleteModal, setShowDeleteModal] = useState(null);\n  const [showErrorModal, setShowErrorModal] = useState(null);\n' + c[idx1 + len('const [showDeleteModal, setShowDeleteModal] = useState(null);'):]

# 2. Rewrite handleDeleteClient
old_del = """  const handleDeleteClient = async (id) => {
    setShowDeleteModal(null);
    setClients(clients.filter(c => c.id !== id));
    
    await supabase.from("clients").delete().eq("id", id);
    fetchClients(false);
  };"""

new_del = """  const handleDeleteClient = async (id) => {
    const { error } = await supabase.from("clients").delete().eq("id", id);
    if (error) {
       setShowDeleteModal(null);
       setShowErrorModal("Cannot delete this Client because they currently have active Projects or Services attached to them. Please delete the associated projects/services first.");
       return;
    }
    setShowDeleteModal(null);
    setClients(clients.filter(c => c.id !== id));
    fetchClients(false);
  };"""

c = c.replace(old_del, new_del)

# 3. Add Error Modal JSX
idx2 = c.find('{/* Delete Confirmation Modal */}');
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

with open('crm/src/views/admin/clients/index.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
