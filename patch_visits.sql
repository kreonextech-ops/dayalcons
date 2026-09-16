ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS visit_type TEXT DEFAULT 'Site Visit';
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS outcome TEXT;
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS attachment_url TEXT;

UPDATE leads SET status = 'Ongoing' WHERE status IN ('New', 'Contacted');
UPDATE leads SET status = 'Success' WHERE status = 'Won';
UPDATE leads SET status = 'Closed' WHERE status = 'Lost';
UPDATE leads SET status = 'Ongoing' WHERE status NOT IN ('Ongoing', 'Success', 'Closed');

UPDATE clients SET status = 'Ongoing' WHERE status = 'active';
UPDATE clients SET status = 'Closed' WHERE status = 'inactive';
UPDATE clients SET status = 'Ongoing' WHERE status NOT IN ('Ongoing', 'Success', 'Closed');
