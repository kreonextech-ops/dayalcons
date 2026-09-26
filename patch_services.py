import glob
import re

files = glob.glob('crm/src/**/*.jsx', recursive=True)

# We want to replace "Land Registration & Mutation" with two options
old_str = '{ id: "Land Registration & Mutation", icon: <FiFileText /> },'
new_str = '{ id: "Land Registration", icon: <FiFileText /> },\n  { id: "Mutation / Conversion", icon: <FiFileText /> },'

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'Land Registration & Mutation' in content:
        # Replace the full object string if it exists exactly
        if old_str in content:
            content = content.replace(old_str, new_str)
        else:
            # Maybe spacing is different
            content = re.sub(r'\{\s*id:\s*"Land Registration & Mutation"\s*,\s*icon:\s*<FiFileText\s*/>\s*\},', new_str, content)
            
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Patched {file}")
