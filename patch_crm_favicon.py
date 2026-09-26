filepath = "crm/public/index.html"
with open(filepath, "r") as f:
    content = f.read()
content = content.replace("favicon.ico", "favicon.jpg")
with open(filepath, "w") as f:
    f.write(content)
print("Patched CRM favicon")
