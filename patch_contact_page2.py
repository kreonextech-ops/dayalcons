import os
import re

filepath = 'src/app/contact/page.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# add import
if 'import { supabase }' not in content:
    content = content.replace('import { useState, useRef } from "react";', 'import { useState, useRef } from "react";\nimport { supabase } from "@/lib/supabase";')

# Update state variables for form inputs
if 'const [formState, setFormState]' not in content:
    content = content.replace('const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success">("idle");', 'const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success">("idle");\n  const [formState, setFormState] = useState({ name: "", phone: "", email: "", projectType: "" });')

# Replace handleSubmit
old_func = """  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("submitting");
    setTimeout(() => {
      setFormStatus("success");
      setTimeout(() => setFormStatus("idle"), 3000);
    }, 1500);
  };"""

new_func = """  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("submitting");
    
    try {
      await supabase.from('leads').insert([{
        name: formState.name,
        phone: formState.phone || null,
        email: formState.email || null,
        service_type: formState.projectType || null,
        source: 'Website Contact Page',
        status: 'New',
        lead_temperature: 'Warm'
      }]);
    } catch (err) {
      console.error(err);
    }

    setFormStatus("success");
    setFormState({ name: "", phone: "", email: "", projectType: "" });
    setTimeout(() => setFormStatus("idle"), 3000);
  };"""

content = content.replace(old_func, new_func)

# We need to bind the inputs!
content = content.replace('placeholder="John Doe"', 'placeholder="John Doe" value={formState.name} onChange={e => setFormState({...formState, name: e.target.value})}')
content = content.replace('placeholder="+91 00000 00000"', 'placeholder="+91 00000 00000" value={formState.phone} onChange={e => setFormState({...formState, phone: e.target.value})}')
content = content.replace('placeholder="john@example.com"', 'placeholder="john@example.com" value={formState.email} onChange={e => setFormState({...formState, email: e.target.value})}')
content = content.replace('<select className="w-full bg-white', '<select value={formState.projectType} onChange={e => setFormState({...formState, projectType: e.target.value})} className="w-full bg-white')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Contact Us page patched")
