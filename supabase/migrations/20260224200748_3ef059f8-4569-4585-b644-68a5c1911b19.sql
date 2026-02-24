
-- Add audit trail columns to purchase_requests
ALTER TABLE public.purchase_requests
  ADD COLUMN IF NOT EXISTS created_by text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS last_updated_by text NOT NULL DEFAULT '';

-- Add created_by to po_tracker (last_updated_by already exists)
ALTER TABLE public.po_tracker
  ADD COLUMN IF NOT EXISTS created_by text NOT NULL DEFAULT '';
