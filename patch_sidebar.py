with open('crm/src/components/sidebar/index.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = '<ul className="mb-auto pt-1">'
new = '<ul className="mb-auto pt-1 overflow-y-auto max-h-[calc(100vh-150px)]">'

if target in content:
    content = content.replace(target, new)
    with open('crm/src/components/sidebar/index.jsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Patched sidebar scroll")
else:
    print("Target not found")
