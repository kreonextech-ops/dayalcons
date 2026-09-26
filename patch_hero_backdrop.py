import re

filepath = 'src/components/HeroSection.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

old_video_block = """        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          webkit-playsinline="true"
          poster="https://pub-00d1d73a43a643edb96c64ca062ab6df.r2.dev/website/backdrop.png"
          className="w-full h-full object-cover object-center opacity-80"
        >
          <source src="https://pub-00d1d73a43a643edb96c64ca062ab6df.r2.dev/website/hero1.mp4" type="video/mp4" />
        </video>"""

new_img_block = """        <img 
          src="/images/backdrop.jpg"
          alt="Dayal Constructions Background"
          className="w-full h-full object-cover object-center opacity-80"
        />"""

if old_video_block in content:
    content = content.replace(old_video_block, new_img_block)
    # also change the comment above it
    content = content.replace("{/* Background Container - Video Background */}", "{/* Background Container */}")
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Patched HeroSection successfully.")
else:
    print("Video block not found!")
