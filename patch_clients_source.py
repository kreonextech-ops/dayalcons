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

filepath = 'crm/src/views/admin/clients/index.jsx'
with open(filepath, 'r', encoding='utf-8') as f: content = f.read()

source_block = f"""                  <div>
                    <label className="block text-[12px] font-bold text-[#475569] dark:text-gray-200 dark:text-white mb-1.5 uppercase tracking-wide">Lead Source</label>
                    <select value={{newClient.source}} onChange={{e=>setNewClient({{{...newClient, source: e.target.value}}})}} className="w-full h-11 px-3 rounded-[10px] border border-[#E2E8F0] dark:border-navy-700 text-[14px] text-[#0F172A] dark:text-white outline-none focus:border-[#2563EB] transition-colors cursor-pointer bg-white dark:bg-navy-800">
{OPTIONS_HTML}
                    </select>
                  </div>"""

# Insert it before GST/PAN
if 'Lead Source' not in content.split('Add New Client')[1]:
    content = content.replace('                  <div>\n                    <label className="block text-[12px] font-bold text-[#475569] dark:text-gray-200 dark:text-white mb-1.5 uppercase tracking-wide">GST / PAN (Tax ID)</label>', f'{source_block}\n                  <div>\n                    <label className="block text-[12px] font-bold text-[#475569] dark:text-gray-200 dark:text-white mb-1.5 uppercase tracking-wide">GST / PAN (Tax ID)</label>')

with open(filepath, 'w', encoding='utf-8') as f: f.write(content)

print("Clients index.jsx patched")
