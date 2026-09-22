import os
import re

files_to_patch = {
    'crm/src/views/admin/crm/index.jsx': (
        "let query = supabase.from(\"leads\").select(\"*\").order('created_at', { ascending: false });",
        "let query = supabase.from(\"leads\").select(\"*\").order('created_at', { ascending: false });\n      if (!isAdmin && loggedInUser?.id) {\n          query = query.or(`assigned_to.ilike.%${loggedInUser.id}%${loggedInUser.role ? `,assigned_to.ilike.%${loggedInUser.role}%` : ''}`);\n      }"
    ),
    'crm/src/views/admin/clients/index.jsx': (
        "if (!isAdmin && loggedInUser?.id) {\n         query = query.like('assigned_to', `%${loggedInUser.id}%`);\n      }",
        "if (!isAdmin && loggedInUser?.id) {\n         query = query.or(`assigned_to.ilike.%${loggedInUser.id}%${loggedInUser.role ? `,assigned_to.ilike.%${loggedInUser.role}%` : ''}`);\n      }"
    ),
    'crm/src/views/admin/services/index.jsx': (
        "if (!canSeeAllData && loggedInUser?.id) {\n             query = query.like('assigned_to', `%${loggedInUser.id}%`);\n          }",
        "if (!canSeeAllData && loggedInUser?.id) {\n             query = query.or(`assigned_to.ilike.%${loggedInUser.id}%${loggedInUser.role ? `,assigned_to.ilike.%${loggedInUser.role}%` : ''}`);\n          }"
    ),
    'crm/src/views/admin/projects/index.jsx': (
        "if (!canSeeAllData && loggedInUser?.id) {\n             query = query.like('assigned_to', `%${loggedInUser.id}%`);\n          }",
        "if (!canSeeAllData && loggedInUser?.id) {\n             query = query.or(`assigned_to.ilike.%${loggedInUser.id}%${loggedInUser.role ? `,assigned_to.ilike.%${loggedInUser.role}%` : ''}`);\n          }"
    )
}

for filepath, (old_str, new_str) in files_to_patch.items():
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # for leads, remove any existing old comment block just in case
        if 'leads' in filepath:
            content = re.sub(r'// User requested: "lead section should visible to all employee\(update the permission\)"\s*// So we no longer restrict leads based on assigned_to.', '', content)
            
        if old_str in content:
            content = content.replace(old_str, new_str)
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Patched {filepath}")
        else:
            print(f"Could not find target in {filepath}")
            # Try a regex approach for leads
            if 'leads' in filepath:
                content = re.sub(r'(let query = supabase\.from\("leads"\)\.select\("\*"\)\.order\(\'created_at\', \{ ascending: false \}\);)', new_str, content)
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Regex patched {filepath}")
            
