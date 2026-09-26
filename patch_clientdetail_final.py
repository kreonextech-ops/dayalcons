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

filepath = 'crm/src/views/admin/clients/ClientDetail.jsx'
with open(filepath, 'r', encoding='utf-8') as f: content = f.read()

source_block = f"""<div className="flex flex-col"><label className="text-xs text-gray-500">Source</label>
                            <select className="border rounded p-2 text-sm outline-none border-[#16A34A] custom-scrollbar max-h-[150px]" value={{clientData.source || ""}} onChange={{e => setClientData({{...clientData, source: e.target.value}})}}>
{OPTIONS_HTML}
                            </select>
                          </div>"""

target = '<div className="flex flex-col"><label className="text-xs text-gray-500">Arriving Date</label>'
if 'clientData.source' not in content.split('isEditingClient ? (')[1].split(':')[0]:
    content = content.replace(target, source_block + '\n                          ' + target)
    with open(filepath, 'w', encoding='utf-8') as f: f.write(content)
    print("ClientDetail patched")
else:
    print("Failed")
