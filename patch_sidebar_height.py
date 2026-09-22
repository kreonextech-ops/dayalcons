with open('crm/src/components/sidebar/index.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace min-h-full with h-screen
if 'min-h-full' in content:
    content = content.replace('min-h-full', 'h-screen')

with open('crm/src/components/sidebar/index.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Patched sidebar height")
