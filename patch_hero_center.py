import os

filepath = 'src/components/HeroSection.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace object position
target_object = 'className="w-full h-full object-cover object-[center_top] opacity-80"'
replacement_object = 'className="w-full h-full object-cover object-center opacity-80"'
content = content.replace(target_object, replacement_object)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Patched HeroSection.tsx to object-center")
