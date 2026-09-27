with open('crm/src/views/admin/clients/index.jsx', 'r', encoding='utf-8') as f:
    c = f.read()
c = c.replace('className="py-4 px-4 text-[12px] text-gray-500"', 'className="py-2 px-4 text-[12px] text-gray-500"')
c = c.replace('className="py-4 px-6 text-right"', 'className="py-2 px-6 text-right"')
c = c.replace('className="py-4 px-4 text-[13px] font-medium text-brand-500"', 'className="py-2 px-4 text-[13px] font-medium text-brand-500"')
with open('crm/src/views/admin/clients/index.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
