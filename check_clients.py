with open('crm/src/views/admin/clients/index.jsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()
    for i, line in enumerate(lines):
        if '<td' in line and '{client.name}' in line:
            for j in range(max(0, i-2), i+5):
                print(f'{j+1}: {lines[j].strip()}')
