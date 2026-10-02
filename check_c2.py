with open('crm/src/views/admin/clients/index.jsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()
    for i, line in enumerate(lines):
        if '.map' in line and '=>' in line:
            for j in range(max(0, i), i+20):
                print(f'{j+1}: {lines[j].strip()}')
