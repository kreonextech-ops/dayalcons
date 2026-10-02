with open('src/components/MetaPixel.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('YOUR_PIXEL_ID_HERE', '2049765302568825')

with open('src/components/MetaPixel.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
