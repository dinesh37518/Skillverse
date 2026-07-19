-- Add email and password columns to educators table
ALTER TABLE public.educators ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE public.educators ADD COLUMN IF NOT EXISTS password VARCHAR(255);
