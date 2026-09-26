import os

filepath = 'crm/src/layouts/admin/index.jsx'
with open(filepath, 'r', encoding='utf-8') as f: content = f.read()

# Original: <div className="h-full">
# New: <div className="h-full max-w-[1600px] mx-auto w-full">

content = content.replace(
    '<div className="h-full">\n            <Navbar', 
    '<div className="h-full max-w-[1600px] mx-auto w-full">\n            <Navbar'
)

with open(filepath, 'w', encoding='utf-8') as f: f.write(content)
print("Layout patched")
