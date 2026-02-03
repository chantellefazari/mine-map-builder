-- Add inventory and pricing fields to visual_parts_catalogue
ALTER TABLE public.visual_parts_catalogue
ADD COLUMN IF NOT EXISTS min_qty integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS max_qty integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS qty_in_stock integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS lead_time_days integer,
ADD COLUMN IF NOT EXISTS unit_price numeric(10,2);