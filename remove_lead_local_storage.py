import os
import re

def clean_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # 1. Remove const localData = JSON.parse(localStorage.getItem(`lead_${lead.id}`) || "{}");
    content = re.sub(r'const localData = JSON\.parse\(localStorage\.getItem\([^)]+\) \|\| "{}"\);', '', content)
    
    # 2. Replace `return { ...lead, ...localData };` with `return lead;`
    content = content.replace("return { ...lead, ...localData };", "return lead;")
    content = content.replace("return { ...lead, ...localData, ...", "return { ...lead, ...")
    
    # 3. Remove localStorage.setItem(`lead_${leadId}`, JSON.stringify(localData));
    content = re.sub(r'localStorage\.setItem\(`lead_[^`]+`,\s*JSON\.stringify\([^)]+\)\);', '', content)
    
    # 4. Remove localData.lead_temperature = newTemp;
    content = re.sub(r'localData\.lead_temperature\s*=\s*[^;]+;', '', content)
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Cleaned leads local storage in {filepath}")

for root, _, files in os.walk("crm/src"):
    for file in files:
        if file.endswith(".jsx"):
            clean_file(os.path.join(root, file))
