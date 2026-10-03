import os
for root, dirs, files in os.walk('crm/src'):
    for file in files:
        if file.endswith('.jsx') or file.endswith('.js'):
            with open(os.path.join(root, file), 'r', encoding='utf-8') as f:
                content = f.read()
                if 'Deleted Record' in content:
                    print(file)
