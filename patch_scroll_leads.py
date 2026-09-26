import os
import re

filepath = 'crm/src/views/admin/crm/index.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Add scrollPosRef
if 'const scrollPosRef = useRef(0);' not in content:
    content = content.replace('const [selectedLead, setSelectedLead] = useState(null);', 'const [selectedLead, setSelectedLead] = useState(null);\n  const scrollPosRef = useRef(0);\n\n  useEffect(() => {\n    if (!selectedLead && scrollPosRef.current > 0) {\n      setTimeout(() => {\n        window.scrollTo({ top: scrollPosRef.current, behavior: "instant" });\n      }, 100);\n    }\n  }, [selectedLead]);')

# Modify onClick
old_click = 'onClick={() => setSelectedLead(lead)}'
new_click = 'onClick={() => { scrollPosRef.current = window.scrollY; setSelectedLead(lead); }}'
content = content.replace(old_click, new_click)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Leads scroll patched")
