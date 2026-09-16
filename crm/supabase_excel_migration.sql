-- SQL script to upgrade Supabase schema for Excel Migration

-- 1. Update Clients Table
ALTER TABLE clients 
ADD COLUMN IF NOT EXISTS work_types text;

-- 2. Update Services Table (For L.U.C.C, Mutation, Building Plan, Design)
ALTER TABLE services
ADD COLUMN IF NOT EXISTS service_sub_type text,
ADD COLUMN IF NOT EXISTS case_no text,
ADD COLUMN IF NOT EXISTS grn_no text,
ADD COLUMN IF NOT EXISTS application_no text,
ADD COLUMN IF NOT EXISTS lucc_status text,
ADD COLUMN IF NOT EXISTS amount_agreed text,
ADD COLUMN IF NOT EXISTS amount_received text,
ADD COLUMN IF NOT EXISTS signature_of_payee text,
ADD COLUMN IF NOT EXISTS document_received_date text,
ADD COLUMN IF NOT EXISTS progress_details text;

-- 3. Update Projects Table (For Construction)
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS signature_of_payee text,
ADD COLUMN IF NOT EXISTS progress_details text;

-- 4. Create Site Visits Table
CREATE TABLE IF NOT EXISTS site_visits (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    client_name text,
    client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
    mobile_no text,
    location text,
    visiting_date text,
    requirement text,
    amount text,
    status text DEFAULT 'Ongoing',
    assigned_to text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create Quotations Table
CREATE TABLE IF NOT EXISTS quotations (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    client_name text,
    client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
    quotation_no text,
    description text,
    date_arrived text,
    submission_deadline text,
    action_taken text,
    remarks text,
    status text DEFAULT 'Pending',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS (Assuming default is open or matching others)
-- ALTER TABLE site_visits ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;

-- Allow open access (Since frontend uses anon key for queries without explicit RLS policies for now)
CREATE POLICY "Allow all on site_visits" ON site_visits FOR ALL USING (true);
CREATE POLICY "Allow all on quotations" ON quotations FOR ALL USING (true);
