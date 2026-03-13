ALTER TABLE public.work_requests
  ADD COLUMN isolation_required boolean NOT NULL DEFAULT false,
  ADD COLUMN photo_urls text[] NOT NULL DEFAULT '{}'::text[];