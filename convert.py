import re

with open('c:/Users/Mr/Downloads/dayalcons/code.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract the body content
body_match = re.search(r'<body[^>]*>(.*?)</body>', content, re.DOTALL | re.IGNORECASE)
if not body_match:
    print('No body found')
    exit(1)

body_html = body_match.group(1)

# Basic JSX conversions
jsx = body_html.replace('class=', 'className=')
jsx = re.sub(r'<!--(.*?)-->', r'{/* \1 */}', jsx, flags=re.DOTALL)

out = f"""import Image from 'next/image';
import Link from 'next/link';

export default function Home() {{
  return (
    <>
      {jsx}
    </>
  );
}}
"""

with open('c:/Users/Mr/Downloads/dayalcons/website/src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(out)

print('Done')
