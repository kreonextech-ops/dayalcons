with open("crm/src/views/admin/clients/ClientDetail.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace <MdSave /> Save button with nothing, or just remove the button and make isEditingClient always true for Overview, or just add onBlur
import re

# 1. Add onBlur={handleSaveClientInfo} to all inputs in the editing section
# We'll just replace the inputs directly
def add_onblur(match):
    tag = match.group(0)
    if "onBlur" not in tag:
        # insert before value=
        return tag.replace('value={', 'onBlur={handleSaveClientInfo} value={')
    return tag

content = re.sub(r'<input type="text".*?value=\{clientData\.(company|name|phone|gst)\}.*?>', add_onblur, content)
content = re.sub(r'<input type="email".*?value=\{clientData\.email\}.*?>', add_onblur, content)
content = re.sub(r'<textarea.*?value=\{clientData\.address\}.*?>', add_onblur, content)
content = re.sub(r'<input type="date".*?value=\{clientData\.created_at\}.*?>', add_onblur, content)
content = re.sub(r'<input type="number".*?value=\{clientData\.(budget|plot_size|lead_score)\}.*?>', add_onblur, content)
content = re.sub(r'<textarea.*?value=\{clientData\.notes\}.*?>', add_onblur, content)

# 2. Hide the manual save button, just show "Auto-saving..." when saving
old_save_btn = """<button onClick={handleSaveClientInfo} className="text-[#16A34A] flex items-center gap-1 font-bold text-sm"><MdSave /> Save</button>"""
new_save_btn = """<span className="text-[#16A34A] flex items-center gap-1 font-bold text-sm text-xs italic">Auto-saves on click away</span>
                       <button onClick={() => setIsEditingClient(false)} className="ml-3 px-3 py-1 bg-gray-100 rounded text-xs font-bold hover:bg-gray-200">Done Editing</button>"""
content = content.replace(old_save_btn, new_save_btn)

# 3. Status Capsule in ClientDetail overview
old_capsule = """          <span className={`rounded-full px-4 py-1 text-xs font-bold tracking-wide ${clientData.status === 'Active' ? 'bg-[#16A34A] text-white' : 'bg-gray-500 text-white'}`}>
            STATUS: {clientData.status.toUpperCase()}
          </span>"""

new_capsule = """          <select 
            value={clientData.status || 'Ongoing'}
            onChange={async (e) => {
              const newStatus = e.target.value;
              setClientData({...clientData, status: newStatus});
              await supabase.from('clients').update({ status: newStatus }).eq('id', clientData.id);
            }}
            className={`appearance-none cursor-pointer outline-none shadow-md rounded-full px-4 py-1 text-xs font-bold tracking-wide uppercase ${
              clientData.status === 'Ongoing' ? 'bg-yellow-500 text-white' : 
              clientData.status === 'Hold' ? 'bg-blue-500 text-white' : 
              clientData.status === 'Closed' ? 'bg-red-500 text-white' :
              'bg-yellow-500 text-white'
            }`}
          >
            <option value="Ongoing" className="bg-white text-black">STATUS: ONGOING</option>
            <option value="Hold" className="bg-white text-black">STATUS: HOLD</option>
            <option value="Closed" className="bg-white text-black">STATUS: CLOSED</option>
          </select>"""
content = content.replace(old_capsule, new_capsule)

# Update the default status on mount
content = content.replace('status: data.status || "Active",', 'status: data.status || "Ongoing",')
content = content.replace('status: client?.status || "Active",', 'status: client?.status || "Ongoing",')


with open("crm/src/views/admin/clients/ClientDetail.jsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated ClientDetail.jsx")
