with open('src/app/layout.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

import_statement = 'import MetaPixel from "@/components/MetaPixel";\nimport JsonLd from "@/components/JsonLd";'
content = content.replace('import JsonLd from "@/components/JsonLd";', import_statement)

body_start = '<body className="antialiased overflow-x-hidden relative text-body-lg">\n        <MetaPixel />'
content = content.replace('<body className="antialiased overflow-x-hidden relative text-body-lg">', body_start)

with open('src/app/layout.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
