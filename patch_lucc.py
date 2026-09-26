with open("crm/src/views/admin/clients/ClientDetail.jsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    '"Land Registration & Mutation", "Building Plan Approval",',
    '"Land Registration", "Mutation / Conversion", "L.U.C.C", "Building Plan Approval",'
)

with open("crm/src/views/admin/clients/ClientDetail.jsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Patched ClientDetail.jsx")
