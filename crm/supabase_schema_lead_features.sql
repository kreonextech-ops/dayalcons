-- 1. Tasks / Follow-ups Table
CREATE TABLE IF NOT EXISTS public.lead_tasks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  lead_id uuid REFERENCES public.leads(id) ON DELETE CASCADE,
  title text NOT NULL,
  type text NOT NULL, 
  due_date timestamptz,
  assigned_to text,
  status text DEFAULT 'Pending'
);
ALTER TABLE public.lead_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all to lead_tasks" ON public.lead_tasks FOR ALL TO anon USING (true);

-- 2. Site Visits Table
CREATE TABLE IF NOT EXISTS public.lead_site_visits (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  lead_id uuid REFERENCES public.leads(id) ON DELETE CASCADE,
  engineer_name text,
  scheduled_at timestamptz,
  status text DEFAULT 'Scheduled',
  plot_dimension text,
  weather text,
  observations text,
  checklist jsonb DEFAULT '{"measured": false, "client_present": false, "soil_inspected": false, "utilities_checked": false}'::jsonb
);
ALTER TABLE public.lead_site_visits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all to lead_site_visits" ON public.lead_site_visits FOR ALL TO anon USING (true);

-- 3. Qualifications Table
CREATE TABLE IF NOT EXISTS public.lead_qualifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  lead_id uuid REFERENCES public.leads(id) ON DELETE CASCADE UNIQUE,
  budget_score integer DEFAULT 0,
  land_score integer DEFAULT 0,
  visit_score integer DEFAULT 0,
  decision_score integer DEFAULT 0,
  timeline_score integer DEFAULT 0,
  total_score integer DEFAULT 0
);
ALTER TABLE public.lead_qualifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all to lead_qualifications" ON public.lead_qualifications FOR ALL TO anon USING (true);

-- 4. Documents Table
CREATE TABLE IF NOT EXISTS public.lead_documents (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  lead_id uuid REFERENCES public.leads(id) ON DELETE CASCADE,
  folder_name text,
  file_name text NOT NULL,
  file_url text NOT NULL
);
ALTER TABLE public.lead_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all to lead_documents" ON public.lead_documents FOR ALL TO anon USING (true);

-- 5. Modify Leads Table
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS assigned_to text,
ADD COLUMN IF NOT EXISTS lead_score integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS budget text,
ADD COLUMN IF NOT EXISTS plot_size text,
ADD COLUMN IF NOT EXISTS timeline text;
