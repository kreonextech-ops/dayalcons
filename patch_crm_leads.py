import os

filepath = 'crm/src/views/admin/crm/index.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. State Variables
content = content.replace(
    'const [convertLeadData, setConvertLeadData] = useState(null);',
    'const [convertLeadData, setConvertLeadData] = useState(null);\n  const [convertedCount, setConvertedCount] = useState(0);\n  const [followupTodayCount, setFollowupTodayCount] = useState(0);'
)

# 2. Fetch Counts
fetch_target = '''      const { data, error } = await query;
      if (!error && data) {'''
fetch_replacement = '''      const { data, error } = await query;

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

      if (!error && data) {'''
content = content.replace(fetch_target, fetch_replacement)

# 3. KPI Cards Logic & Thin Padding
kpi_target = '''          {/* 2. KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
               { title: "Total Leads", val: leads.length || "0", icon: <MdPeople className="text-[#2563EB]" />, bg: "bg-blue-50" },
               { title: "Hot Leads", val: leads.filter(l => l.status === 'Qualified' || l.status === 'Negotiation').length || "0", icon: <MdLocalFireDepartment className="text-[#DC2626]" />, bg: "bg-red-50" },
               { title: "Follow-up Today", val: "0", icon: <MdToday className="text-[#F59E0B]" />, bg: "bg-orange-50" },
               { title: "Converted This Month", val: leads.filter(l => l.status === 'Won').length || "0", icon: <MdCheckCircle className="text-[#16A34A]" />, bg: "bg-green-50" }
            ].map((kpi, i) => (
              <Card key={i} extra="p-6 border border-[#E2E8F0] dark:border-navy-700 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)] hover:border-blue-200 transition-all duration-300">'''
kpi_replacement = '''          {/* 2. KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {[
               { title: "Total Leads", val: leads.length || "0", icon: <MdPeople className="text-[#2563EB]" />, bg: "bg-blue-50" },
               { title: "Hot Leads", val: leads.filter(l => l.lead_temperature === 'Hot').length || "0", icon: <MdLocalFireDepartment className="text-[#DC2626]" />, bg: "bg-red-50" },
               { title: "Follow-up Today", val: followupTodayCount || "0", icon: <MdToday className="text-[#F59E0B]" />, bg: "bg-orange-50" },
               { title: "Converted This Month", val: convertedCount || "0", icon: <MdCheckCircle className="text-[#16A34A]" />, bg: "bg-green-50" }
            ].map((kpi, i) => (
              <Card key={i} extra="py-3 px-4 border border-[#E2E8F0] dark:border-navy-700 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)] hover:border-blue-200 transition-all duration-300">'''
content = content.replace(kpi_target, kpi_replacement)

# 4. Global spacing
content = content.replace(
    '<div className="w-full max-w-full bg-[#F8FAFC] dark:bg-navy-900 min-h-screen pt-12 pb-24">',
    '<div className="w-full max-w-full bg-[#F8FAFC] dark:bg-navy-900 min-h-screen pt-4 pb-24">'
)
content = content.replace(
    '<div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 mt-8 md:mt-2">',
    '<div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-4 gap-4 mt-2 md:mt-0">'
)

# 5. Search Bar Layout
search_target = '''            {/* 3. Search & Filter Toolbar */}
          <Card extra="shrink-0 p-4 border border-[#E2E8F0] dark:border-navy-700 mb-4 shadow-sm">
              <div className="flex flex-col lg:flex-row justify-between items-center gap-4">'''
search_replacement = '''            {/* 3. Search & Filter Toolbar */}
          <Card extra="shrink-0 p-3 border border-[#E2E8F0] dark:border-navy-700 mb-3 shadow-sm overflow-hidden">
              <div className="flex flex-row justify-between items-center gap-3 w-full overflow-x-auto pb-1">'''
content = content.replace(search_target, search_replacement)

content = content.replace(
    '<div className="flex gap-3 w-full lg:w-auto flex-wrap">',
    '<div className="flex gap-3 flex-nowrap items-center shrink-0">'
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Patched index.jsx")
