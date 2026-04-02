CREATE TABLE public.shutdown_rundown_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shutdown_id UUID NOT NULL REFERENCES public.shutdowns(id) ON DELETE CASCADE,
  phase TEXT NOT NULL DEFAULT 'run-down',
  step_description TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  duration_hours NUMERIC NOT NULL DEFAULT 0,
  responsible TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'Pending',
  notes TEXT NOT NULL DEFAULT '',
  is_template BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.shutdown_rundown_steps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to shutdown_rundown_steps"
  ON public.shutdown_rundown_steps FOR ALL TO public
  USING (true) WITH CHECK (true);