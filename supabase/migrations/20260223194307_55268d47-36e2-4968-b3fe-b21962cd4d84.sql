-- Add resources column to pm_master_list for storing resource allocation text
ALTER TABLE public.pm_master_list
  ADD COLUMN IF NOT EXISTS resources text NOT NULL DEFAULT '';
