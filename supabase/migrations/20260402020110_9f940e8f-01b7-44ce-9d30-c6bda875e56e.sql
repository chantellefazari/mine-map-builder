ALTER TABLE public.shutdown_rundown_steps
  ADD COLUMN work_centre TEXT NOT NULL DEFAULT '',
  ADD COLUMN start_time TEXT NOT NULL DEFAULT '',
  ADD COLUMN finish_time TEXT NOT NULL DEFAULT '';