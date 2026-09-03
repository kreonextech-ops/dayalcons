-- Supabase Schema for Employees Table (Auth)
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.employees (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  role text DEFAULT 'Employee',
  department text,
  designation text
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated/anon users to read and insert (since we are handling auth at the app layer right now)
CREATE POLICY "Allow all anon users to modify employees" ON public.employees FOR ALL TO anon USING (true);
CREATE POLICY "Allow all authenticated users to modify employees" ON public.employees FOR ALL TO authenticated USING (true);

-- Insert the default admin user (won't duplicate if it already exists)
INSERT INTO public.employees (name, email, password, role)
VALUES ('Admin', 'admin@dayal.com', 'admin123', 'Admin')
ON CONFLICT (email) DO NOTHING;
