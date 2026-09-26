import os

filepath = 'crm/src/views/admin/clients/index.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Add scrollPosRef
if 'const scrollPosRef = useRef(0);' not in content:
    content = content.replace('const [selectedClient, setSelectedClient] = useState(null);', 'const [selectedClient, setSelectedClient] = useState(null);\n  const scrollPosRef = useRef(0);\n\n  useEffect(() => {\n    if (!selectedClient && scrollPosRef.current > 0) {\n      setTimeout(() => {\n        window.scrollTo({ top: scrollPosRef.current, behavior: "auto" });\n      }, 100);\n    }\n  }, [selectedClient]);')

# Modify onClick
old_click = 'onClick={() => setSelectedClient(client)}'
new_click = 'onClick={() => { scrollPosRef.current = window.scrollY; setSelectedClient(client); }}'
content = content.replace(old_click, new_click)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Clients scroll patched")
