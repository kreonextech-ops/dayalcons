import glob

for file in glob.glob('crm/src/views/admin/**/*.jsx', recursive=True):
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'searchTerm.toLowerCase()' in content:
        content = content.replace('searchTerm.toLowerCase()', 'String(searchTerm).toLowerCase()')
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Bulletproofed search in {file}")
