import os

filepath = 'src/app/contact/page.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

if 'import { supabase }' not in content:
    content = content.replace('import Link from "next/link";', 'import Link from "next/link";\nimport { supabase } from "@/lib/supabase";')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Import added")
