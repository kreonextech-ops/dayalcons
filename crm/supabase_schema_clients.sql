-- Run this in Supabase SQL Editor to create the clients table

CREATE TABLE IF NOT EXISTS public.clients (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  email text,
  phone text,
  address text
);

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all authenticated users to read and insert clients" ON public.clients FOR ALL TO anon USING (true);
