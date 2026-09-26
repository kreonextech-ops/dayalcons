import os, re

filepath = 'crm/src/views/admin/crm/index.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Normalize line endings for reliable replace
content = content.replace('\r\n', '\n')

# 1. State Variables
content = content.replace(
    'const [convertLeadData, setConvertLeadData] = useState(null);',
    'const [convertLeadData, setConvertLeadData] = useState(null);\n  const [convertedCount, setConvertedCount] = useState(0);\n  const [followupTodayCount, setFollowupTodayCount] = useState(0);'
)

# 2. Fetch Counts
fetch_target = """      const { data, error } = await query;
      if (!error && data) {"""
fetch_replacement = """      const { data, error } = await query;

      // --- New: Fetch Converted This Month (Clients created this month) ---
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const { count: cCount } = await supabase.from('clients').select('*', { count: 'exact', head: true }).gte('created_at', firstDayOfMonth);
      if (cCount !== null) setConvertedCount(cCount);

      // --- New: Fetch Follow-up Today ---
      const todayStr = now.toISOString().split('T')[0];
      const { data: fuData } = await supabase.from('tasks').select('id, due_date, status').eq('custom_category', 'Follow Up').neq('status', 'Completed');
      if (fuData) {
         const dueToday = fuData.filter(f => f.due_date && f.due_date.split("T")[0] === todayStr).length;
         setFollowupTodayCount(dueToday);
      }

      if (!error && data) {"""
content = content.replace(fetch_target, fetch_replacement)

# 3. KPI Cards Logic & Thin Padding
kpi_target = re.compile(r'\{\s*title:\s*"Total Leads".*?extra="p-6 border', re.DOTALL)
kpi_replacement = """{ title: "Total Leads", val: leads.length || "0", icon: <MdPeople className="text-[#2563EB]" />, bg: "bg-blue-50" },
               { title: "Hot Leads", val: leads.filter(l => l.lead_temperature === 'Hot').length || "0", icon: <MdLocalFireDepartment className="text-[#DC2626]" />, bg: "bg-red-50" },
               { title: "Follow-up Today", val: followupTodayCount || "0", icon: <MdToday className="text-[#F59E0B]" />, bg: "bg-orange-50" },
               { title: "Converted This Month", val: convertedCount || "0", icon: <MdCheckCircle className="text-[#16A34A]" />, bg: "bg-green-50" }
            ].map((kpi, i) => (
              <Card key={i} extra="py-3 px-4 border"""
content = re.sub(kpi_target, kpi_replacement, content)

# Remove mb-6 gap below KPI grid
content = content.replace(
    'className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"',
    'className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4"'
)

# 4. Global spacing
content = content.replace(
    '<div className="w-full max-w-full bg-[#F8FAFC] dark:bg-navy-900 min-h-screen pt-12 pb-24">',
    '<div className="w-full max-w-full bg-[#F8FAFC] dark:bg-navy-900 min-h-screen pt-2 pb-24">'
)
content = content.replace(
    '<div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 mt-8 md:mt-2">',
    '<div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-4 gap-4 mt-2">'
)

# 5. Search Bar Layout & Remove status/temperature/month
search_target_pattern = re.compile(r'\{\/\* 3\. Search & Filter Toolbar \*\/\}.*?<\/div>\s*<\/Card>', re.DOTALL)
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
                    <div className="flex items-center gap-1">
                       <input type="date" value={filterStartDate} onChange={(e) => setFilterStartDate(e.target.value)} className="h-10 px-2 rounded-[10px] border border-[#E2E8F0] dark:border-navy-700 text-[14px] text-[#475569] dark:text-gray-200 dark:text-white outline-none focus:border-[#2563EB] bg-transparent dark:bg-navy-900 cursor-pointer" title="Start Date" />
                       <span className="text-[#64748B] dark:text-gray-400 text-sm">to</span>
                       <input type="date" value={filterEndDate} onChange={(e) => setFilterEndDate(e.target.value)} className="h-10 px-2 rounded-[10px] border border-[#E2E8F0] dark:border-navy-700 text-[14px] text-[#475569] dark:text-gray-200 dark:text-white outline-none focus:border-[#2563EB] bg-transparent dark:bg-navy-900 cursor-pointer" title="End Date" />
                    </div>
                      <select 
                        value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                      className="h-10 px-4 rounded-[10px] border border-[#E2E8F0] dark:border-navy-700 text-[14px] text-[#475569] dark:text-gray-200 dark:text-white outline-none focus:border-[#2563EB] bg-transparent dark:bg-navy-900 cursor-pointer"
                    >
                      <option value="newest">Sort: Newest First</option>
                      <option value="oldest">Sort: Oldest First</option>
                      <option value="name_asc">Sort: Name (A-Z)</option>
                      <option value="name_desc">Sort: Name (Z-A)</option>
                      <option value="status">Sort: Status</option>
                    </select>
                </div>
              </div>
              </Card>"""
content = re.sub(search_target_pattern, search_replacement, content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Regex patch complete")
