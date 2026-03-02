-- Drop existing check constraint and re-create with 'Component Fill' added
ALTER TABLE public.processing_plant_assets_rev_b DROP CONSTRAINT IF EXISTS processing_plant_assets_rev_b_change_type_check;

ALTER TABLE public.processing_plant_assets_rev_b ADD CONSTRAINT processing_plant_assets_rev_b_change_type_check 
CHECK (change_type IN ('Unchanged', 'New', 'Modified', 'Moved', 'Deleted', 'Component Fill'));