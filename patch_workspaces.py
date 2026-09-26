with open("crm/src/views/admin/crm/components/TabDocuments.jsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    's.includes("Land Registration & Mutation"))',
    's.includes("Land Registration & Mutation") || s.includes("L.U.C.C") || s.includes("Land Registration") || s.includes("Mutation / Conversion"))'
)
with open("crm/src/views/admin/crm/components/TabDocuments.jsx", "w", encoding="utf-8") as f:
    f.write(content)


with open("crm/src/views/admin/crm/components/TabServiceWorkspace.jsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    '{selected.includes("Land Registration & Mutation") && <LegalWorkspace />}',
    '{(selected.includes("Land Registration & Mutation") || selected.includes("L.U.C.C") || selected.includes("Land Registration") || selected.includes("Mutation / Conversion")) && <LegalWorkspace />}'
)
with open("crm/src/views/admin/crm/components/TabServiceWorkspace.jsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Patched TabDocuments and TabServiceWorkspace")
