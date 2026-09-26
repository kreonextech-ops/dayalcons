import os
import re

filepath = 'src/app/contact/page.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Make handleSubmit async and add supabase logic
old_func = """  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("submitting");
    setTimeout(() => {
      setFormStatus("success");
      setTimeout(() => setFormStatus("idle"), 3000);
    }, 1500);
  };"""

new_func = """  const [form, setForm] = useState({ name: '', phone: '', email: '', projectType: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("submitting");
    try {
      const response = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          service_type: form.projectType,
          source: 'Website Contact Page',
          status: 'New',
          lead_temperature: 'Warm'
        })
      });
      // if no API exists, we might need supabase directly
      // let's check if they have supabase imported
    } catch (err) {
      console.error(err);
    }
    
    setTimeout(() => {
      setFormStatus("success");
      setForm({ name: '', phone: '', email: '', projectType: '' });
      setTimeout(() => setFormStatus("idle"), 3000);
    }, 1000);
  };"""

# Wait, let's just use supabase directly since it's a client component.
