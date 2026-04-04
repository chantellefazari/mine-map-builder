ALTER TABLE public.component_change_requests
  ADD COLUMN IF NOT EXISTS change_type text NOT NULL DEFAULT 'add',
  ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS criticality text NOT NULL DEFAULT 'Medium';