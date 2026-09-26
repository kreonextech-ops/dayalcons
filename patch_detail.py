import re

def fix(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        c = f.read()
    
    # Replace the select styling
    old_class = r'className={`px-3 py-1\.5 rounded-full text-xs font-bold uppercase tracking-wide outline-none cursor-pointer border-none shadow-sm \${\s*clientData\.status === .Hold. \? .bg-blue-500 text-white. :\s*clientData\.status === .Closed. \? .bg-red-500 text-white. :\s*.bg-yellow-500 text-white.\s*}`}'
    new_class = r'className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide outline-none cursor-pointer border border-transparent shadow-sm ${clientData.status === "Hold" ? "bg-blue-100 text-blue-700" : clientData.status === "Closed" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}'
    
    c = re.sub(old_class, new_class, c)
    
    # Also change the options to not have bg-white text-black
    c = re.sub(r'<option value="Ongoing" className="bg-white text-black">', '<option value="Ongoing">', c)
    c = re.sub(r'<option value="Hold" className="bg-white text-black">', '<option value="Hold">', c)
    c = re.sub(r'<option value="Closed" className="bg-white text-black">', '<option value="Closed">', c)
    
    # Update the alert for handleConvertToLead
    c = c.replace('alert("Failed to convert back to lead.");', 'alert("Failed to convert: " + (insertError?.message || JSON.stringify(insertError)));')
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(c)

fix('crm/src/views/admin/clients/ClientDetail.jsx')
