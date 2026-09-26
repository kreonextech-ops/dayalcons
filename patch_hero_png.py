import os

filepath = 'src/components/HeroSection.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace poster image URL
target_poster = 'poster="https://pub-00d1d73a43a643edb96c64ca062ab6df.r2.dev/website/backdrop.jpg"'
replacement_poster = 'poster="https://pub-00d1d73a43a643edb96c64ca062ab6df.r2.dev/website/backdrop.png"'
content = content.replace(target_poster, replacement_poster)

# Replace object position
target_object = 'className="w-full h-full object-cover object-[center_bottom] opacity-80"'
replacement_object = 'className="w-full h-full object-cover object-[center_top] opacity-80"'
content = content.replace(target_object, replacement_object)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Patched HeroSection.tsx with new PNG and object-position")
