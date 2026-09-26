import glob

for filepath in glob.glob("crm/src/**/*.jsx", recursive=True):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if '"Turnkey Construction"' in content:
        content = content.replace('"Turnkey Construction"', '"Construction"')
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Patched {filepath}")
