import re

def patch_file(filepath, is_client=False):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We want to replace the filter logic block
    if is_client:
        old_search = """                     if (searchTerm) {
                        const lower = searchTerm.toLowerCase();
                        filtered = filtered.filter(c => 
                           (c.name && c.name.toLowerCase().includes(lower)) || 
                           (c.email && c.email.toLowerCase().includes(lower)) || 
                           (c.phone && c.phone.toLowerCase().includes(lower)) || 
                           (c.company && c.company.toLowerCase().includes(lower)) ||
                           (c.address && c.address.toLowerCase().includes(lower))
                        );
                     }"""
        new_search = """                     if (searchTerm) {
                        const lower = searchTerm.toLowerCase();
                        filtered = filtered.filter(c => 
                           (c.name && String(c.name).toLowerCase().includes(lower)) || 
                           (c.email && String(c.email).toLowerCase().includes(lower)) || 
                           (c.phone && String(c.phone).toLowerCase().includes(lower)) || 
                           (c.whatsapp && String(c.whatsapp).toLowerCase().includes(lower)) || 
                           (c.company && String(c.company).toLowerCase().includes(lower)) ||
                           (c.address && String(c.address).toLowerCase().includes(lower)) ||
                           (c.notes && String(c.notes).toLowerCase().includes(lower))
                        );
                     }"""
    else:
        old_search = """                     if (searchTerm) {
                        const lower = searchTerm.toLowerCase();
                        filtered = filtered.filter(l => 
                           (l.name && l.name.toLowerCase().includes(lower)) || 
                           (l.email && l.email.toLowerCase().includes(lower)) || 
                           (l.phone && l.phone.toLowerCase().includes(lower)) || 
                           (l.company && l.company.toLowerCase().includes(lower)) ||
                           (l.address && l.address.toLowerCase().includes(lower)) ||
                           (l.source && l.source.toLowerCase().includes(lower))
                        );
                     }"""
        new_search = """                     if (searchTerm) {
                        const lower = searchTerm.toLowerCase();
                        filtered = filtered.filter(l => 
                           (l.name && String(l.name).toLowerCase().includes(lower)) || 
                           (l.email && String(l.email).toLowerCase().includes(lower)) || 
                           (l.phone && String(l.phone).toLowerCase().includes(lower)) || 
                           (l.whatsapp && String(l.whatsapp).toLowerCase().includes(lower)) || 
                           (l.company && String(l.company).toLowerCase().includes(lower)) ||
                           (l.address && String(l.address).toLowerCase().includes(lower)) ||
                           (l.source && String(l.source).toLowerCase().includes(lower)) ||
                           (l.notes && String(l.notes).toLowerCase().includes(lower))
                        );
                     }"""

    if old_search in content:
        content = content.replace(old_search, new_search)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Patched {filepath}")
    else:
        print(f"Could not find old search block in {filepath}")

patch_file('crm/src/views/admin/crm/index.jsx', False)
patch_file('crm/src/views/admin/clients/index.jsx', True)
