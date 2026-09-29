with open('crm/src/views/admin/crm/components/TabEstimate.jsx', 'r', encoding='utf-8') as f:
    c = f.read()
c = c.replace('</Card>\n      </div>\n    </div>', '</Card>\n      </div>')
with open('crm/src/views/admin/crm/components/TabEstimate.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
