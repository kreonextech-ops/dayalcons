import os, re

# 1. Patch Clients First
filepath = 'crm/src/views/admin/clients/index.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Normalize line endings
content = content.replace('\r\n', '\n')

# Global spacing top
content = content.replace(
    '<div className="w-full max-w-full bg-[#F8FAFC] dark:bg-navy-900 min-h-screen pt-12 pb-24">',
    '<div className="w-full max-w-full bg-[#F8FAFC] dark:bg-navy-900 min-h-screen pt-4 pb-24">'
)
content = content.replace(
    '<div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 mt-8 md:mt-2">',
    '<div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-4 gap-4 mt-2 md:mt-0">'
)

# KPI Cards & Spacing
kpi_target = re.compile(r'className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">.*?\]\.map', re.DOTALL)
kpi_replacement = """className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {[
               { title: "Total Clients", val: clients.length || "0", icon: <MdPeople className="text-[#2563EB]" />, bg: "bg-blue-50" },
               { title: "Active Clients", val: clients.filter(c => c.status === 'Active').length || "0", icon: <MdLocalFireDepartment className="text-[#DC2626]" />, bg: "bg-red-50" },
               { title: "Inactive Clients", val: clients.filter(c => c.status === 'Inactive').length || "0", icon: <MdCloudDownload className="text-[#64748B]" />, bg: "bg-gray-100" },
               { title: "High Value", val: clients.filter(c => c.lead_score === 'High').length || "0", icon: <MdCheckCircle className="text-[#16A34A]" />, bg: "bg-green-50" }
            ].map"""
content = re.sub(kpi_target, kpi_replacement, content)

content = content.replace(
    'Card key={i} extra="p-6 border',
    'Card key={i} extra="py-3 px-4 border'
)

# Search Toolbar
search_target = re.compile(r'\{\/\* 3\. Search & Filter Toolbar \*\/\}.*?<\/div>\s*<\/Card>', re.DOTALL)
search_replacement = """{/* 3. Search & Filter Toolbar */}
          <Card extra="shrink-0 p-3 border border-[#E2E8F0] dark:border-navy-700 mb-3 shadow-sm">
              <div className="flex flex-row justify-between items-center gap-4 w-full overflow-x-auto pb-1">
                <div className="relative flex-1 min-w-[200px] max-w-[400px]">
                  <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#64748B] dark:text-gray-400 text-xl" />
                  <input 
                    type="text" 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    placeholder="Search name, phone, address..." 
                    className="w-full pl-10 pr-4 h-10 rounded-[10px] border border-[#E2E8F0] dark:border-navy-700 text-[14px] outline-none focus:border-[#2563EB] transition-colors" 
                  />
                </div>
                  <div className="flex gap-3 flex-nowrap items-center shrink-0">
                      <select 
                        value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                      className="h-10 px-4 rounded-[10px] border border-[#E2E8F0] dark:border-navy-700 text-[14px] text-[#475569] dark:text-gray-200 dark:text-white outline-none focus:border-[#2563EB] bg-transparent dark:bg-navy-900 cursor-pointer"
                    >
                      <option value="newest">Sort: Newest First</option>
                      <option value="oldest">Sort: Oldest First</option>
                      <option value="name_asc">Sort: Name (A-Z)</option>
                      <option value="name_desc">Sort: Name (Z-A)</option>
                    </select>
                </div>
              </div>
              </Card>"""
content = re.sub(search_target, search_replacement, content)

# Table Padding in Clients
content = content.replace('className="py-4 px-6"', 'className="py-2 px-6"')
content = content.replace('className="py-4 px-4"', 'className="py-2 px-4"')

# Remove fixed height constrained layout
content = content.replace('h-[calc(100vh-80px)]', 'min-h-[500px]')
content = content.replace('<div className="h-[25vh] shrink-0" />', '')
content = content.replace('sticky top-[80px]', 'relative')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

# 2. Patch Leads Table Wrapper to remove height constraint as well
leads_path = 'crm/src/views/admin/crm/index.jsx'
with open(leads_path, 'r', encoding='utf-8') as f:
    lcontent = f.read()

lcontent = lcontent.replace('h-[calc(100vh-80px)]', 'min-h-[500px] h-[75vh]')
lcontent = lcontent.replace('<div className="h-[25vh] shrink-0" />', '')

with open(leads_path, 'w', encoding='utf-8') as f:
    f.write(lcontent)

print("Clients patched and Leads height fixed")
