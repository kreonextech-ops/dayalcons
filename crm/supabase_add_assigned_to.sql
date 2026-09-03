-- Add assigned_to column to projects, services, and clients
ALTER TABLE projects ADD COLUMN IF NOT EXISTS assigned_to text;
ALTER TABLE services ADD COLUMN IF NOT EXISTS assigned_to text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS assigned_to text;
