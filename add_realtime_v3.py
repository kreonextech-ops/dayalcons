def patch_file(filepath, old, new, label):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    if old in content:
        content = content.replace(old, new)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Patched: {label}")
    else:
        print(f"STILL NOT FOUND: {label}")

# projects
patch_file(
    "crm/src/views/admin/projects/index.jsx",
    "     fetchProjects();\n  }, [refreshTrigger]);",
    """     fetchProjects();

    const channel = supabase
      .channel('projects-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
        fetchProjects(false);
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [refreshTrigger]);""",
    "projects/index.jsx"
)

# services
patch_file(
    "crm/src/views/admin/services/index.jsx",
    "     fetchServices();\n  }, [refreshTrigger]);",
    """     fetchServices();

    const channel = supabase
      .channel('services-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, () => {
        fetchServices(false);
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [refreshTrigger]);""",
    "services/index.jsx"
)

# tasks
patch_file(
    "crm/src/views/admin/tasks/index.jsx",
    "     fetchAllData();\n  }, [showNewModal, refreshTrigger]);",
    """     fetchAllData();

    const channel = supabase
      .channel('tasks-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => {
        fetchAllData();
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [showNewModal, refreshTrigger]);""",
    "tasks/index.jsx"
)
