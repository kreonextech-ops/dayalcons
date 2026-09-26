import os
import re

OPTIONS_HTML = """                    <option value="">Select source...</option>
                    <option value="Website">Website</option>
                    <option value="Referral">Referral</option>
                    <option value="Walk-in">Walk-in</option>
                    <option value="Phone Call">Phone Call</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="JustDial">JustDial</option>
                    <option value="Sulekha">Sulekha</option>
                    <option value="IndiaMart">IndiaMart</option>
                    <option value="Google Ads">Google Ads</option>
                    <option value="Google Maps (GMB)">Google Maps (GMB)</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Facebook">Facebook</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="YouTube">YouTube</option>
                    <option value="BNI">BNI</option>
                    <option value="Real Estate Brokers">Real Estate Brokers</option>
                    <option value="Site Signage / Hoardings">Site Signage / Hoardings</option>
                    <option value="Print Ads / Newspaper">Print Ads / Newspaper</option>
                    <option value="Repeat Client">Repeat Client</option>
                    <option value="Cold Calling">Cold Calling</option>
                    <option value="Other">Other</option>"""

# 1. Update crm/src/views/admin/crm/index.jsx
filepath = 'crm/src/views/admin/crm/index.jsx'
with open(filepath, 'r', encoding='utf-8') as f: content = f.read()
# Replace <option value="">Select source</option>...<option value="Other">Other</option>
content = re.sub(r'<option value="">Select source.*?<option value="Other">Other</option>', OPTIONS_HTML, content, flags=re.DOTALL)
with open(filepath, 'w', encoding='utf-8') as f: f.write(content)

# 2. Update crm/src/views/admin/crm/LeadDetail.jsx
filepath = 'crm/src/views/admin/crm/LeadDetail.jsx'
with open(filepath, 'r', encoding='utf-8') as f: content = f.read()
content = re.sub(r'<option value="">Select source\.\.\.<\/option>.*?<option value="Other">Other<\/option>', OPTIONS_HTML, content, flags=re.DOTALL)
with open(filepath, 'w', encoding='utf-8') as f: f.write(content)

# 3. Add to crm/src/views/admin/clients/ClientDetail.jsx
filepath = 'crm/src/views/admin/clients/ClientDetail.jsx'
with open(filepath, 'r', encoding='utf-8') as f: content = f.read()
# Add source to edit mode in ClientDetail
if 'clientData.source' not in content.split('isEditingClient ? (')[1].split(':')[0]:
    source_field = f"""<div className="flex flex-col"><label className="text-xs text-gray-500">Source</label>
                            <select className="border rounded p-2 text-sm outline-none border-[#16A34A]" value={{clientData.source || ""}} onChange={{e => setClientData({{...clientData, source: e.target.value}})}}>
{OPTIONS_HTML}
                            </select>
                          </div>"""
    content = content.replace('                          <div className="flex flex-col"><label className="text-xs text-gray-500">Arriving Date</label>', f'{source_field}\n                          <div className="flex flex-col"><label className="text-xs text-gray-500">Arriving Date</label>')
with open(filepath, 'w', encoding='utf-8') as f: f.write(content)

print("Sources replaced successfully")
