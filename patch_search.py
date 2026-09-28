with open('crm/src/views/admin/employees/components/TabDirectory.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace(
    '<div className="flex flex-col lg:flex-row justify-between items-center gap-4">',
    '<div className="flex flex-row justify-between items-center gap-4 w-full">'
)
c = c.replace(
    '<div className="relative w-full lg:w-[300px]">',
    '<div className="relative flex-1 min-w-[200px] max-w-[400px]">'
)

with open('crm/src/views/admin/employees/components/TabDirectory.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
