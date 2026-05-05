CREATE TABLE public.pm_requirement_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_number TEXT NOT NULL UNIQUE,
  asset_name TEXT NOT NULL DEFAULT '',
  area_label TEXT NOT NULL DEFAULT '',
  sub_area TEXT NOT NULL DEFAULT '',
  parent_asset_label TEXT NOT NULL DEFAULT '',
  equipment_class TEXT NOT NULL DEFAULT 'Other',
  criticality TEXT NOT NULL DEFAULT 'C',
  recommended_regime JSONB NOT NULL DEFAULT '{}'::jsonb,
  overrides JSONB NOT NULL DEFAULT '{}'::jsonb,
  approved BOOLEAN NOT NULL DEFAULT false,
  approved_by TEXT NOT NULL DEFAULT '',
  approved_at TIMESTAMPTZ,
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.pm_requirement_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on pm_requirement_recommendations"
  ON public.pm_requirement_recommendations FOR SELECT USING (true);
CREATE POLICY "Allow public insert on pm_requirement_recommendations"
  ON public.pm_requirement_recommendations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on pm_requirement_recommendations"
  ON public.pm_requirement_recommendations FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on pm_requirement_recommendations"
  ON public.pm_requirement_recommendations FOR DELETE USING (true);

CREATE TRIGGER trg_pm_req_rec_updated
BEFORE UPDATE ON public.pm_requirement_recommendations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_pm_req_rec_class ON public.pm_requirement_recommendations(equipment_class);
CREATE INDEX idx_pm_req_rec_crit ON public.pm_requirement_recommendations(criticality);
CREATE INDEX idx_pm_req_rec_area ON public.pm_requirement_recommendations(area_label);