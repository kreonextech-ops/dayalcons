def patch_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    old_logic = """                     if (filterService) {
                        filtered = filtered.filter(x => x.service_type && x.service_type.includes(filterService));
                     }"""
    
    new_logic = """                     if (filterService) {
                        const search = filterService.toLowerCase();
                        filtered = filtered.filter(x => {
                           const types = (x.work_types || x.service_type || "").toLowerCase();
                           if (types.includes(search)) return true;
                           if (search.includes("mutation") && types.includes("mutation")) return true;
                           return false;
                        });
                     }"""
    
    if new_logic not in content:
        content = content.replace(old_logic, new_logic)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Patched filter logic in {filepath}")
    else:
        print(f"Already patched {filepath}")

patch_file('crm/src/views/admin/crm/index.jsx')
