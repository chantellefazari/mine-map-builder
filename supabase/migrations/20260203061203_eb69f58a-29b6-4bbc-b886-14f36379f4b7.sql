-- Add warehouse_area and bin_location columns to visual_parts_catalogue
ALTER TABLE public.visual_parts_catalogue
ADD COLUMN warehouse_area text DEFAULT ''::text,
ADD COLUMN bin_location text DEFAULT ''::text;