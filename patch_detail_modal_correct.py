with open('crm/src/views/admin/clients/ClientDetail.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Add showErrorModal state
idx = c.find('const [isEditingClient, setIsEditingClient] = useState(false);')
c = c[:idx] + 'const [showErrorModal, setShowErrorModal] = useState(null);\n  ' + c[idx:]

# Rewrite handleDeleteClientFromDetail
old_del = """  const handleDeleteClientFromDetail = async () => {
    if (!window.confirm("Are you sure you want to permanently delete this Client? This action cannot be undone.")) return;
    const { error: delErr } = await supabase.from("clients").delete().eq("id", clientData.id);
    if (delErr) { alert("Cannot delete: Client has active projects, tasks, or services attached to them. Delete those first."); return; }
    onBack({ id: clientData.id, deleted: true });
  };"""
new_del = """  const handleDeleteClientFromDetail = async () => {
    if (!window.confirm("Are you sure you want to permanently delete this Client? This action cannot be undone.")) return;
    const { error: delErr } = await supabase.from("clients").delete().eq("id", clientData.id);
    if (delErr) { setShowErrorModal("Cannot delete this Client because they currently have active Projects, Tasks, or Services attached to them. Please delete the associated records first."); return; }
    onBack({ id: clientData.id, deleted: true });
  };"""
c = c.replace(old_del, new_del)

# Rewrite handleConvertToLead
old_conv = """    const { error: delErr2 } = await supabase.from('clients').delete().eq('id', clientData.id);
    if (delErr2) { alert("Cannot convert: Client has active projects or services attached to them. Delete those first."); return; }"""
new_conv = """    const { error: delErr2 } = await supabase.from('clients').delete().eq('id', clientData.id);
    if (delErr2) { setShowErrorModal("Cannot convert this Client back to a Lead because they currently have active Projects or Services attached to them. Please delete the associated projects/services first."); return; }"""
c = c.replace(old_conv, new_conv)

# Insert the Error Modal
idx_modal = c.find('return (')
idx_modal = c.find('<div className="relative min-h-screen', idx_modal)
modal_jsx = """
      {showErrorModal && (
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
# Insert right inside the first div
idx_insert = c.find('>', idx_modal) + 1
c = c[:idx_insert] + modal_jsx + c[idx_insert:]

# Import MdClose
c = __import__('re').sub(r'import \{([^}]*)MdArrowBack([^}]*)\} from "react-icons/md";', r'import {\1MdArrowBack, MdClose\2} from "react-icons/md";', c)


with open('crm/src/views/admin/clients/ClientDetail.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
