ALTER TABLE public.work_requests ADD COLUMN IF NOT EXISTS work_title text NOT NULL DEFAULT '';
ALTER TABLE public.work_requests ADD COLUMN IF NOT EXISTS work_centre text NOT NULL DEFAULT '';