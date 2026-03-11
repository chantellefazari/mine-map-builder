
-- Table 1: Required PMs (currently in localStorage)
CREATE TABLE public.required_pms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pm_name text NOT NULL,
  discipline text NOT NULL DEFAULT 'Mechanical',
  frequency text NOT NULL DEFAULT '',
  equipment_type text NOT NULL DEFAULT '',
  source text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.required_pms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on required_pms" ON public.required_pms FOR SELECT TO public USING (true);
CREATE POLICY "Allow public insert on required_pms" ON public.required_pms FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public update on required_pms" ON public.required_pms FOR UPDATE TO public USING (true);
CREATE POLICY "Allow public delete on required_pms" ON public.required_pms FOR DELETE TO public USING (true);

-- Table 2: Shutdown PM Requirements (currently hardcoded in component)
CREATE TABLE public.shutdown_pm_requirements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  area text NOT NULL,
  discipline text NOT NULL CHECK (discipline IN ('MS', 'ES')),
  name text NOT NULL,
  frequency text NOT NULL,
  estimated_hours numeric NOT NULL DEFAULT 0,
  tc_asset_match text NOT NULL DEFAULT '',
  tc_pid_tag text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.shutdown_pm_requirements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on shutdown_pm_requirements" ON public.shutdown_pm_requirements FOR SELECT TO public USING (true);
CREATE POLICY "Allow public insert on shutdown_pm_requirements" ON public.shutdown_pm_requirements FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public update on shutdown_pm_requirements" ON public.shutdown_pm_requirements FOR UPDATE TO public USING (true);
CREATE POLICY "Allow public delete on shutdown_pm_requirements" ON public.shutdown_pm_requirements FOR DELETE TO public USING (true);

-- Triggers for updated_at
CREATE TRIGGER update_required_pms_updated_at BEFORE UPDATE ON public.required_pms FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_shutdown_pm_requirements_updated_at BEFORE UPDATE ON public.shutdown_pm_requirements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
