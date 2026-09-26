import os
import glob

def patch_height(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Change h-[calc(100vh-something)] flex flex-col to min-h-[700px] flex flex-col
    import re
    new_content = re.sub(r'h-\[calc\(100vh-\d+px\)\]\s+flex\s+flex-col', 'min-h-[700px] flex flex-col', content)
    
    if new_content != content:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Patched {filepath}")

patch_height("crm/src/views/admin/crm/index.jsx")
patch_height("crm/src/views/admin/clients/index.jsx")
patch_height("crm/src/views/admin/services/index.jsx")
patch_height("crm/src/views/admin/projects/index.jsx")
patch_height("crm/src/views/admin/tasks/index.jsx")
patch_height("crm/src/views/admin/followups/index.jsx")
