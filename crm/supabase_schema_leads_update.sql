-- 1. Update the existing Leads table to remove score and add service_type
ALTER TABLE public.leads 
DROP COLUMN IF EXISTS score,
ADD COLUMN IF NOT EXISTS service_type text;

-- 2. Create the interactions table to store Call Logs/Reviews
CREATE TABLE IF NOT EXISTS public.lead_interactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  lead_id uuid REFERENCES public.leads(id) ON DELETE CASCADE,
  caller text NOT NULL,
  response text NOT NULL
);

-- 3. Enable RLS for the new interactions table
ALTER TABLE public.lead_interactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all to lead_interactions" ON public.lead_interactions FOR ALL TO anon USING (true);
