
CREATE TABLE public.plant_intelligence_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id text NOT NULL DEFAULT '',
  title text NOT NULL DEFAULT '',
  area text NOT NULL DEFAULT '',
  asset text NOT NULL DEFAULT '',
  related_asset text NOT NULL DEFAULT '',
  rule_type text NOT NULL DEFAULT 'Operational Note',
  impact_level text NOT NULL DEFAULT 'Medium',
  applies_to text NOT NULL DEFAULT '',
  if_condition text NOT NULL DEFAULT '',
  then_action text NOT NULL DEFAULT '',
  because_reason text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  requires_isolation boolean NOT NULL DEFAULT false,
  requires_permit boolean NOT NULL DEFAULT false,
  requires_shutdown boolean NOT NULL DEFAULT false,
  requires_scaffold boolean NOT NULL DEFAULT false,
  requires_crane boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'Draft',
  added_by text NOT NULL DEFAULT '',
  voice_transcript text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.plant_intelligence_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on plant_intelligence_rules" ON public.plant_intelligence_rules FOR SELECT TO public USING (true);
CREATE POLICY "Allow public insert on plant_intelligence_rules" ON public.plant_intelligence_rules FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public update on plant_intelligence_rules" ON public.plant_intelligence_rules FOR UPDATE TO public USING (true);
CREATE POLICY "Allow public delete on plant_intelligence_rules" ON public.plant_intelligence_rules FOR DELETE TO public USING (true);
