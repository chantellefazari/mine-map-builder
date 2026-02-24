
-- Add freight tracking number to po_tracker
ALTER TABLE public.po_tracker ADD COLUMN IF NOT EXISTS freight_tracking_number text NOT NULL DEFAULT '';
