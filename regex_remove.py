import os
import re

def clean_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    # Remove localStorage.setItem(`client_${clientId}`, JSON.stringify({...})); block
    # and const localData = JSON.parse(localStorage.getItem(`client_${client.id}`) || "{}");
    
    # Let's remove any localStorage.setItem(`client_.*`) entirely
    content = re.sub(r'localStorage\.setItem\(`client_[^`]+`,\s*JSON\.stringify\(\{[^\}]+\}\)\);', '', content, flags=re.DOTALL | re.MULTILINE)
    content = re.sub(r'localStorage\.setItem\(`client_[^`]+`,\s*JSON\.stringify\(local\)\);', '', content)
    
    # Also remove `const localData = JSON.parse(localStorage.getItem(\`client_${client.id}\`) || "{}");`
    content = re.sub(r'const localData = JSON\.parse\(localStorage\.getItem\([^)]+\) \|\| "{}"\);', '', content)
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Cleaned {filepath}")

for root, _, files in os.walk("crm/src"):
    for file in files:
        if file.endswith(".jsx"):
            clean_file(os.path.join(root, file))
