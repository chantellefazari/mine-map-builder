-- Add essential planning and safety fields to work_orders
ALTER TABLE public.work_orders
  ADD COLUMN IF NOT EXISTS work_title text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS findings text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS work_centre text NOT NULL DEFAULT 'MECH',
  ADD COLUMN IF NOT EXISTS planned_start date,
  ADD COLUMN IF NOT EXISTS planned_finish date,
  ADD COLUMN IF NOT EXISTS linked_wr_number text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS revision_week text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS permit_required boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS confined_space boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS working_at_heights boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS hot_work boolean NOT NULL DEFAULT false;