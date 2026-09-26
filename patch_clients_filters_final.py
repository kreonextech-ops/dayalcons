def patch_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    old_logic = """                     if (sortOrder === "oldest") {
                        filtered.sort((a,b) => new Date(a.created_at) - new Date(b.created_at));
                     } else {
                        filtered.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
                     }"""
    
    new_logic = """
                     if (filterEmployee) {
                        filtered = filtered.filter(x => x.assigned_to && x.assigned_to.includes(filterEmployee));
                     }
                     if (filterService) {
                        const search = filterService.toLowerCase();
                        filtered = filtered.filter(x => {
                           const types = (x.work_types || x.service_type || "").toLowerCase();
                           if (types.includes(search)) return true;
                           if (search.includes("mutation") && types.includes("mutation")) return true;
                           return false;
                        });
                     }
                     if (sortOrder === "oldest") {
                        filtered.sort((a,b) => new Date(a.created_at) - new Date(b.created_at));
                     } else {
                        filtered.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
                     }"""
    
    if 'if (filterEmployee)' not in content:
        content = content.replace(old_logic, new_logic)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Patched filter logic in {filepath}")
    else:
        print(f"Already patched {filepath}")

patch_file('crm/src/views/admin/clients/index.jsx')
