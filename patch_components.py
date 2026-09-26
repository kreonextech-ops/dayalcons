import os
import re

def insert_lucc(filepath):
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Pattern 1: { id: "Mutation / Conversion", icon: <FiFileText /> },
        if 'id: "Mutation / Conversion"' in content and 'id: "L.U.C.C"' not in content:
            content = content.replace(
                '{ id: "Mutation / Conversion", icon: <FiFileText /> },',
                '{ id: "Mutation / Conversion", icon: <FiFileText /> },\n  { id: "L.U.C.C", icon: <FiFileText /> },'
            )
            print("Patched Pattern 1 in " + filepath)

        # Pattern 2: "Land Registration & Mutation" -> separate them? 
        # Actually, if I just add L.U.C.C it might be enough.
        # But wait, earlier in ClientDetail.jsx I replaced Land Registration & Mutation with separate.
        # Let's add L.U.C.C to TabDocuments and TabServiceWorkspace manually if needed.

        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
    except Exception as e:
        print("Error", filepath, e)

insert_lucc('crm/src/views/admin/crm/components/TabServiceRequirement.jsx')
insert_lucc('crm/src/views/admin/services/components/TabRequirements.jsx')
