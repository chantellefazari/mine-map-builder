
-- Add asset_number column to pm_master_list
ALTER TABLE public.pm_master_list ADD COLUMN asset_number text NOT NULL DEFAULT '';

-- Add asset_number column to pm_templates
ALTER TABLE public.pm_templates ADD COLUMN asset_number text NOT NULL DEFAULT '';
