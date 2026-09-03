ALTER TABLE employees ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS status text DEFAULT 'Active';
ALTER TABLE employees ADD COLUMN IF NOT EXISTS join_date timestamp with time zone DEFAULT now();
