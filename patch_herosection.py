import os

filepath = 'src/components/HeroSection.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace video URL
target_video = 'src="https://pub-00d1d73a43a643edb96c64ca062ab6df.r2.dev/website/hero.mp4"'
replacement_video = 'src="https://pub-00d1d73a43a643edb96c64ca062ab6df.r2.dev/website/dayalhero.mp4"'
content = content.replace(target_video, replacement_video)

# Replace poster image URL
target_poster = 'poster="/images/saved.png"'
replacement_poster = 'poster="https://pub-00d1d73a43a643edb96c64ca062ab6df.r2.dev/website/backdrop.jpg"'
content = content.replace(target_poster, replacement_poster)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Patched HeroSection.tsx")
