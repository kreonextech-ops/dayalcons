-- Run this in Supabase SQL Editor to create the BOQ items table

CREATE TABLE IF NOT EXISTS public.boq_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  project_id uuid REFERENCES public.projects(id),
  item_name text NOT NULL,
  quantity numeric NOT NULL DEFAULT 1,
  unit text NOT NULL DEFAULT 'pcs',
  unit_price numeric NOT NULL DEFAULT 0.00
);

ALTER TABLE public.boq_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all authenticated users to read and insert boq_items" ON public.boq_items FOR ALL TO anon USING (true);
