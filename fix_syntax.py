import re

def fix(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        c = f.read()
    
    # Fix inline onChanges
    c = re.sub(r'onChange=\{\(e\) => set([a-zA-Z0-9_]+)\(e\.target\.value\); setCurrentPage\(1\)\}', r'onChange={(e) => { set\1(e.target.value); setCurrentPage(1); }}', c)
    
    # Also I need to check the IIFE map replacement for any bracket errors.
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(c)

fix('crm/src/views/admin/crm/index.jsx')
fix('crm/src/views/admin/clients/index.jsx')
