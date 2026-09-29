import base64
import re

def get_b64(filename, mime):
    with open(f'crm/public/assets/img/quotation/{filename}', 'rb') as f:
        return f"data:{mime};base64,{base64.b64encode(f.read()).decode('utf-8')}"

img6 = get_b64('image6.png', 'image/png') # Logo
img7 = get_b64('image7.jpeg', 'image/jpeg') # QR Code?
img9 = get_b64('image9.png', 'image/png') # Signature/Stamp?

with open('crm/src/views/admin/crm/components/TabQuotationBuilder.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Replace Header Logo (image1.png -> image6.png)
c = re.sub(r'src="data:image/png;base64,[^"]+"', f'src="{img6}"', c, count=1)

# Inject img7 and img9 near Bank Details and Footer
bank_details_section = """<div style={{ fontSize: '12px', lineHeight: '1.5' }}>
                <p style={{ margin: '0', fontWeight: 'bold', textDecoration: 'underline', marginBottom: '5px' }}>BANK DETAILS</p>
                <p style={{ margin: '0' }}>Bank Name : UCO Bank</p>
                <p style={{ margin: '0' }}>Branch: Fulbari</p>
                <p style={{ margin: '0' }}>A/C No: 32790210002575</p>
                <p style={{ margin: '0' }}>IFSC Code: UCBA0003279</p>
                <p style={{ margin: '0' }}>Owner Name - Dayal Constructions & CO.</p>
            </div>"""

new_bank_details = f"""
            <div style={{{{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}}}>
                <div style={{{{ fontSize: '12px', lineHeight: '1.5' }}}}>
                    <p style={{{{ margin: '0', fontWeight: 'bold', textDecoration: 'underline', marginBottom: '5px' }}}}>BANK DETAILS</p>
                    <p style={{{{ margin: '0' }}}}>Bank Name : UCO Bank</p>
                    <p style={{{{ margin: '0' }}}}>Branch: Fulbari</p>
                    <p style={{{{ margin: '0' }}}}>A/C No: 32790210002575</p>
                    <p style={{{{ margin: '0' }}}}>IFSC Code: UCBA0003279</p>
                    <p style={{{{ margin: '0' }}}}>Owner Name - Dayal Constructions & CO.</p>
                </div>
                <div>
                    <img src="{img7}" alt="QR" style={{{{ height: '80px', objectFit: 'contain' }}}} />
                </div>
            </div>
            
            <div style={{{{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end' }}}}>
                <img src="{img9}" alt="Signature" style={{{{ height: '100px', objectFit: 'contain' }}}} />
            </div>
"""

c = c.replace(bank_details_section, new_bank_details)

with open('crm/src/views/admin/crm/components/TabQuotationBuilder.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
