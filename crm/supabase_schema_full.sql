-- Core Tables Extension (Run this in Supabase SQL Editor)

CREATE TABLE IF NOT EXISTS public.leads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  name text NOT NULL,
  source text,
  score integer DEFAULT 0,
  status text DEFAULT 'New',
  phone text
);

CREATE TABLE IF NOT EXISTS public.tasks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  name text NOT NULL,
  project_id uuid REFERENCES public.projects(id),
  priority text DEFAULT 'Medium',
  due_date date,
  status text DEFAULT 'To Do'
);

CREATE TABLE IF NOT EXISTS public.quotations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  project_id uuid REFERENCES public.projects(id),
  amount numeric DEFAULT 0.00,
  status text DEFAULT 'Draft'
);

CREATE TABLE IF NOT EXISTS public.documents (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  name text NOT NULL,
  file_url text NOT NULL,
  project_id uuid REFERENCES public.projects(id)
);

-- RLS Settings
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all authenticated users to read and insert leads" ON public.leads FOR ALL TO anon USING (true);
CREATE POLICY "Allow all authenticated users to read and insert tasks" ON public.tasks FOR ALL TO anon USING (true);
CREATE POLICY "Allow all authenticated users to read and insert quotations" ON public.quotations FOR ALL TO anon USING (true);
CREATE POLICY "Allow all authenticated users to read and insert documents" ON public.documents FOR ALL TO anon USING (true);
-- Note: Setting to 'anon' for now since authentication is disabled/mocked.

-- Update earlier policies to allow anonymous inserts for development without auth
CREATE POLICY "Allow all anon users to modify clients" ON public.clients FOR ALL TO anon USING (true);
CREATE POLICY "Allow all anon users to modify projects" ON public.projects FOR ALL TO anon USING (true);
