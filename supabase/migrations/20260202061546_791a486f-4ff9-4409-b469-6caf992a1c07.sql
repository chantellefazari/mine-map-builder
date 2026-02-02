-- Add supplier column to visual_parts_catalogue
ALTER TABLE public.visual_parts_catalogue 
ADD COLUMN supplier text DEFAULT ''::text;