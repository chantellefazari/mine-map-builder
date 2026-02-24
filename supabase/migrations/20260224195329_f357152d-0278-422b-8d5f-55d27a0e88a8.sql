
-- Add new tracking fields to po_tracker
ALTER TABLE public.po_tracker
  ADD COLUMN IF NOT EXISTS description text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS received_by text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS last_updated_by text NOT NULL DEFAULT '';
