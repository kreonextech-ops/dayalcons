with open('src/components/HeroSection.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace(
    'src="https://pub-00d1d73a43a643edb96c64ca062ab6df.r2.dev/website/hero1.mp4"',
    'src="/dmain.mp4"'
)

with open('src/components/HeroSection.tsx', 'w', encoding='utf-8') as f:
    f.write(c)
