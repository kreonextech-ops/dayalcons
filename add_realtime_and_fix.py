import os

# ============================================================
# 1. FIX ClientDetail.jsx - change isAdmin so CRO is explicit
#    and add Realtime subscription
# ============================================================
def patch_client_detail():
    filepath = "crm/src/views/admin/clients/ClientDetail.jsx"
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Fix isAdmin to be very explicit about CRO having full access
    old_admin = """  const isAdmin = loggedInUser?.role === 'Admin' || (loggedInUser?.role && loggedInUser.role.toUpperCase() === 'CRO') || (loggedInUser?.designation && loggedInUser.designation.toUpperCase().includes('CRO'));
  const isCRO = loggedInUser?.role === 'CRO';"""

    new_admin = """  const isAdmin = ['Admin', 'CRO'].includes(loggedInUser?.role);
  const isCRO = loggedInUser?.role === 'CRO';"""

    content = content.replace(old_admin, new_admin)

    # Add realtime subscription right after the refetchClient useEffect
    old_effect_end = """  }, [client?.id]);

  const [activeProjectsCount"""
    new_effect_end = """  }, [client?.id]);

  // Realtime subscription - any change to this client updates the screen instantly
  useEffect(() => {
    if (!client?.id) return;
    const channel = supabase
      .channel(`client-detail-${client.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'clients', filter: `id=eq.${client.id}` }, (payload) => {
        if (payload.new && payload.eventType !== 'DELETE') {
          const data = payload.new;
          setClientData(prev => ({
            ...prev,
            name: data.name || prev.name,
            phone: data.phone || prev.phone,
            email: data.email || prev.email,
            address: data.address || prev.address,
            company: data.company || prev.company,
            status: data.status || prev.status,
            assigned_to: data.assigned_to ?? prev.assigned_to,
            work_types: data.work_types || prev.work_types,
            notes: data.notes || prev.notes,
          }));
        }
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [client?.id]);

  const [activeProjectsCount"""

    content = content.replace(old_effect_end, new_effect_end)

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Patched {filepath}")


# ============================================================
# 2. ADD REALTIME to clients/index.jsx
# ============================================================
def patch_clients_index():
    filepath = "crm/src/views/admin/clients/index.jsx"
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    old = """    fetchClients();
  }, []);"""

    new = """    fetchClients();

    // Realtime: auto-refresh list when ANY client changes
    const channel = supabase
      .channel('clients-list')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'clients' }, () => {
        fetchClients(false);
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);"""

    if old in content:
        content = content.replace(old, new)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Patched {filepath}")
    else:
        print(f"Pattern not found in {filepath}")


# ============================================================
# 3. ADD REALTIME to crm/index.jsx (Leads)
# ============================================================
def patch_crm_index():
    filepath = "crm/src/views/admin/crm/index.jsx"
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    old = """    fetchLeads();
  }, []);"""

    new = """    fetchLeads();

    // Realtime: auto-refresh leads when anything changes
    const channel = supabase
      .channel('leads-list')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, () => {
        fetchLeads(false);
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);"""

    if old in content:
        content = content.replace(old, new)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Patched {filepath}")
    else:
        print(f"Pattern not found in {filepath}")


# ============================================================
# 4. ADD REALTIME to projects/index.jsx
# ============================================================
def patch_projects_index():
    filepath = "crm/src/views/admin/projects/index.jsx"
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    old = """    fetchProjects();
  }, []);"""

    new = """    fetchProjects();

    const channel = supabase
      .channel('projects-list')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
        fetchProjects(false);
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);"""

    if old in content:
        content = content.replace(old, new)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Patched {filepath}")
    else:
        print(f"Pattern not found in {filepath}")


# ============================================================
# 5. ADD REALTIME to services/index.jsx
# ============================================================
def patch_services_index():
    filepath = "crm/src/views/admin/services/index.jsx"
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    old = """    fetchServices();
  }, []);"""

    new = """    fetchServices();

    const channel = supabase
      .channel('services-list')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, () => {
        fetchServices(false);
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);"""

    if old in content:
        content = content.replace(old, new)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Patched {filepath}")
    else:
        print(f"Pattern not found in {filepath}")


# ============================================================
# 6. ADD REALTIME to tasks/index.jsx
# ============================================================
def patch_tasks_index():
    filepath = "crm/src/views/admin/tasks/index.jsx"
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    old = """    fetchAllData();
  }, []);"""

    new = """    fetchAllData();

    const channel = supabase
      .channel('tasks-list')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => {
        fetchAllData();
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);"""

    if old in content:
        content = content.replace(old, new)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Patched {filepath}")
    else:
        print(f"Pattern not found in {filepath}")


# ============================================================
# 7. ADD REALTIME to followups/index.jsx
# ============================================================
def patch_followups_index():
    filepath = "crm/src/views/admin/followups/index.jsx"
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    old = """    fetchFollowUps();
  }, []);"""

    new = """    fetchFollowUps();

    const channel = supabase
      .channel('followups-list')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'follow_ups' }, () => {
        fetchFollowUps(false);
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);"""

    if old in content:
        content = content.replace(old, new)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Patched {filepath}")
    else:
        print(f"Pattern not found in {filepath}")


patch_client_detail()
patch_clients_index()
patch_crm_index()
patch_projects_index()
patch_services_index()
patch_tasks_index()
patch_followups_index()

print("All done!")
