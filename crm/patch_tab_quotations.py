import re

filepath = 'crm/src/views/admin/clients/components/TabQuotations.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Add imports
imports = '''import { uploadFileToR2 } from "utils/r2Storage";
import { MdUploadFile, MdFileDownload } from "react-icons/md";
'''
content = content.replace("import { createClient }", imports + "import { createClient }")

# Add file_url to state
content = content.replace("remarks: '',", "remarks: '',\n    file_url: '',")

# Add upload state
content = content.replace("const [newQuote, setNewQuote] = useState", "const [uploading, setUploading] = useState(false);\n  const [fileToUpload, setFileToUpload] = useState(null);\n  const [newQuote, setNewQuote] = useState")

# Modify handleCreate to upload file first
create_fn_new = '''
  const handleCreate = async (e) => {
    e.preventDefault();
    setUploading(true);
    let finalFileUrl = newQuote.file_url;
    
    if (fileToUpload) {
      try {
        finalFileUrl = await uploadFileToR2(fileToUpload, 'quotations');
      } catch (err) {
        alert("Failed to upload file");
        setUploading(false);
        return;
      }
    }

    const { error } = await supabase.from('quotations').insert([{ ...newQuote, file_url: finalFileUrl, client_id: clientId }]);
    if (!error) {
      setShowModal(false);
      setNewQuote({ quotation_no: '', description: '', date_arrived: '', submission_deadline: '', action_taken: '', remarks: '', file_url: '', status: 'Pending' });
      setFileToUpload(null);
      fetchQuotations();
    } else {
      alert('Error saving quotation: ' + error.message);
    }
    setUploading(false);
  };
'''
# Using regex to replace the old handleCreate
import re
content = re.sub(r'const handleCreate = async \(e\) => \{.*?\n  \};', create_fn_new.strip(), content, flags=re.DOTALL)

# Add file input to the form
file_input_html = '''
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Attachment</label>
                  <input type="file" onChange={(e) => setFileToUpload(e.target.files[0])} className="w-full h-11 px-3 border rounded-[10px] dark:bg-navy-900 dark:border-navy-700 dark:text-white pt-2 text-sm" />
                </div>
'''
content = content.replace('<div className="md:col-span-2">\n                  <label className="block text-xs font-bold text-gray-500 mb-1">Action Taken</label>', file_input_html + '<div className="md:col-span-2">\n                  <label className="block text-xs font-bold text-gray-500 mb-1">Action Taken</label>')

# Add download link in the table row
download_col_header = '<th className="pb-3 pr-4">Attachment</th>'
content = content.replace('<th className="pb-3">Action</th>', download_col_header + '\n                <th className="pb-3">Action</th>')

download_col_body = '''
                    <td className="py-3 pr-4">
                      {q.file_url ? (
                        <a href={q.file_url} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-700 flex items-center gap-1 text-sm font-bold"><MdFileDownload size={18}/> View</a>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
'''
content = content.replace('<td className="py-3">\n                      {q.status !==', download_col_body.strip('\n') + '\n                  <td className="py-3">\n                      {q.status !==')

# Update button text to uploading state
content = content.replace('>Save \nQuotation</button>', '>{uploading ? "Uploading..." : "Save Quotation"}</button>')
content = content.replace('>Save Quotation</button>', '>{uploading ? "Uploading..." : "Save Quotation"}</button>')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Patched TabQuotations.jsx")
