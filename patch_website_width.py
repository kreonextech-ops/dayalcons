import os
import glob

# Files to update from 1440px to 1920px
components = glob.glob('src/components/*.tsx') + glob.glob('src/app/**/*.tsx', recursive=True)

for file in components:
    try:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
            
        if 'max-w-[1440px]' in content or 'max-w-[1400px]' in content:
            content = content.replace('max-w-[1440px]', 'max-w-[1920px]')
            content = content.replace('max-w-[1400px]', 'max-w-[1920px]')
            
            with open(file, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated {file}")
    except Exception as e:
        print(f"Failed {file}: {e}")
