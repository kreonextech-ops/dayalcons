-- Run this in Supabase SQL Editor to create the vendors table

CREATE TABLE IF NOT EXISTS public.vendors (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  type text DEFAULT 'Materials',
  rating numeric DEFAULT 5.0
);

ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all authenticated users to read and insert vendors" ON public.vendors FOR ALL TO anon USING (true);
