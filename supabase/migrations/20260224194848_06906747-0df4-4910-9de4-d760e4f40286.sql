
-- Add new fields for the enhanced PR workflow
ALTER TABLE public.purchase_requests
  ADD COLUMN IF NOT EXISTS request_title text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS description_scope text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS priority text NOT NULL DEFAULT 'Routine',
  ADD COLUMN IF NOT EXISTS estimated_freight_cost numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS approval_amount numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS approval_comment text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS admin_reviewed_by text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS admin_reviewed_at timestamptz NULL;
