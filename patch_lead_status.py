with open('crm/src/views/admin/crm/index.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

s1 = "`px-3 py-1 rounded-full text-xs font-bold ${lead.status === 'New' ? 'bg-blue-100 text-blue-700' : lead.status === 'Contacted' ? 'bg-yellow-100 text-yellow-700' : lead.status === 'Converted' ? 'bg-green-100 text-green-700' : 'bg-gray-100 dark:bg-navy-700 text-gray-600'}`"
r1 = "`px-3 py-1 rounded-full text-xs font-bold ${lead.status === 'New' ? 'bg-blue-100 text-blue-700' : (lead.status === 'Ongoing' || lead.status === 'Contacted') ? 'bg-yellow-100 text-yellow-700' : lead.status === 'Converted' ? 'bg-green-100 text-green-700' : lead.status === 'Closed' ? 'bg-red-100 text-red-700' : 'bg-gray-100 dark:bg-navy-700 text-gray-600'}`"

c = c.replace(s1, r1)

with open('crm/src/views/admin/crm/index.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
