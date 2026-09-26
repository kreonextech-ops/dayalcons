import os

filepath = 'crm/src/views/admin/crm/index.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target = """    const fetchLeads = async () => {
    setLoading(true);
    let query = supabase.from("leads").select("*").order('created_at', { ascending: false });
    
    // User requested: "lead section should visible to all employee(update the permission)"
    // So we no longer restrict leads based on assigned_to.
    
    const { data, error } = await query;
    if (!error && data) {"""

# If spaces are tricky, we can do it more safely by searching for "const { data, error } = await query;"
target2 = "const { data, error } = await query;"

replacement2 = """const { data, error } = await query;
    
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const { count: cCount } = await supabase.from('clients').select('*', { count: 'exact', head: true }).gte('created_at', firstDayOfMonth);
    if (cCount !== null) setConvertedCount(cCount);

    const todayStr = now.toISOString().split('T')[0];
    const { data: fuData } = await supabase.from('tasks').select('id, due_date, status').eq('custom_category', 'Follow Up').neq('status', 'Completed');
    if (fuData) {
       const dueToday = fuData.filter(f => f.due_date && f.due_date.split("T")[0] === todayStr).length;
       setFollowupTodayCount(dueToday);
    }"""

content = content.replace(target2, replacement2)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Fetch patched")
