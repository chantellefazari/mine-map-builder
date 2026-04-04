ALTER TABLE public.component_change_requests
  ADD COLUMN IF NOT EXISTS target_component_index integer DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS target_component_name text NOT NULL DEFAULT '';