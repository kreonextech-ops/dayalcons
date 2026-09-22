with open('crm/src/components/sidebar/index.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = '<ul className="mb-auto pt-1 overflow-y-auto max-h-[calc(100vh-150px)]">'
new = '<ul className="mb-auto pt-1 flex-1 overflow-y-auto">'

if target in content:
    content = content.replace(target, new)
    with open('crm/src/components/sidebar/index.jsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Patched sidebar scroll with flex-1")
else:
    print("Target not found")
