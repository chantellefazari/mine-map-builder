
-- Add sort_order column to preserve the exact hierarchy ordering
ALTER TABLE public.processing_plant_assets
ADD COLUMN sort_order integer NOT NULL DEFAULT 0;

-- Create an index for efficient ordering
CREATE INDEX idx_processing_plant_assets_sort_order ON public.processing_plant_assets (sort_order);
