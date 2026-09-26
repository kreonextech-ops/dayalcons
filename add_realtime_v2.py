# All realtime patches with correct patterns found

def patch_file(filepath, old, new, label):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    if old in content:
        content = content.replace(old, new)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Patched: {label}")
    else:
        print(f"PATTERN NOT FOUND: {label}")

# ----- clients/index.jsx -----
patch_file(
    "crm/src/views/admin/clients/index.jsx",
    "  useEffect(() => { fetchClients(); }, []);",
    """  useEffect(() => {
    fetchClients();
    const channel = supabase
      .channel('clients-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'clients' }, () => {
        fetchClients(false);
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);""",
    "clients/index.jsx"
)

# ----- crm/index.jsx (Leads) -----
patch_file(
    "crm/src/views/admin/crm/index.jsx",
    "  useEffect(() => { fetchLeads(); }, []);",
    """  useEffect(() => {
    fetchLeads();
    const channel = supabase
      .channel('leads-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, () => {
        fetchLeads(false);
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);""",
    "crm/index.jsx"
)

# ----- followups/index.jsx -----
patch_file(
    "crm/src/views/admin/followups/index.jsx",
    """  useEffect(() => {
     fetchData();
  }, []);""",
    """  useEffect(() => {
    fetchData();
    const channel = supabase
      .channel('followups-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'follow_ups' }, () => {
        fetchData();
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);""",
    "followups/index.jsx"
)

# ----- projects/index.jsx -----
# Find the main projects fetch useEffect
with open("crm/src/views/admin/projects/index.jsx", "r", encoding="utf-8") as f:
    content = f.read()

old_proj = """  useEffect(() => {
    fetchProjects();
  }, [loggedInUser?.id]);"""

new_proj = """  useEffect(() => {
    fetchProjects();
    const channel = supabase
      .channel('projects-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
        fetchProjects(false);
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [loggedInUser?.id]);"""

if old_proj in content:
    content = content.replace(old_proj, new_proj)
    with open("crm/src/views/admin/projects/index.jsx", "w", encoding="utf-8") as f:
        f.write(content)
    print("Patched: projects/index.jsx")
else:
    # Try alternate pattern - look for useEffect that calls fetchProjects with empty deps
    import re
    match = re.search(r'useEffect\(\(\) => \{\s*fetchProjects\(\);\s*\}, \[', content)
    if match:
        print("projects - alternate pattern found at:", match.start())
        snippet = content[match.start():match.start()+100]
        print(snippet)
    else:
        print("PATTERN NOT FOUND: projects/index.jsx - need manual check")

# ----- services/index.jsx -----
with open("crm/src/views/admin/services/index.jsx", "r", encoding="utf-8") as f:
    content = f.read()

old_serv = """  useEffect(() => {
    fetchServices();
  }, [loggedInUser?.id]);"""

new_serv = """  useEffect(() => {
    fetchServices();
    const channel = supabase
      .channel('services-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, () => {
        fetchServices(false);
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [loggedInUser?.id]);"""

if old_serv in content:
    content = content.replace(old_serv, new_serv)
    with open("crm/src/views/admin/services/index.jsx", "w", encoding="utf-8") as f:
        f.write(content)
    print("Patched: services/index.jsx")
else:
    import re
    match = re.search(r'useEffect\(\(\) => \{\s*fetchServices\(\);\s*\}, \[', content)
    if match:
        snippet = content[match.start():match.start()+100]
        print("services - snippet:", snippet)
    else:
        print("PATTERN NOT FOUND: services/index.jsx")

# ----- tasks/index.jsx -----
with open("crm/src/views/admin/tasks/index.jsx", "r", encoding="utf-8") as f:
    content = f.read()

import re
match = re.search(r'fetchAllData\(\);\s*\n\s*\}, \[\]\);', content)
if match:
    old_t = match.group(0)
    new_t = old_t.replace("  }, []);", """  const channel = supabase
      .channel('tasks-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => {
        fetchAllData();
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);""")
    content = content.replace(old_t, new_t)
    with open("crm/src/views/admin/tasks/index.jsx", "w", encoding="utf-8") as f:
        f.write(content)
    print("Patched: tasks/index.jsx")
else:
    print("PATTERN NOT FOUND: tasks/index.jsx")

print("All realtime patches done!")
