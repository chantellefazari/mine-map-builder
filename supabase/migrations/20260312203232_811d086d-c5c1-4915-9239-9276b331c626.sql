
CREATE TABLE public.asset_criticality_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_number text NOT NULL,
  asset_name text NOT NULL DEFAULT '',
  area_label text NOT NULL DEFAULT '',
  sub_area text NOT NULL DEFAULT '',
  criticality text NOT NULL DEFAULT 'C',
  justification text NOT NULL DEFAULT '',
  assessed_by text NOT NULL DEFAULT '',
  assessed_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (asset_number)
);

ALTER TABLE public.asset_criticality_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on asset_criticality_ratings" ON public.asset_criticality_ratings FOR SELECT TO public USING (true);
CREATE POLICY "Allow public insert on asset_criticality_ratings" ON public.asset_criticality_ratings FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public update on asset_criticality_ratings" ON public.asset_criticality_ratings FOR UPDATE TO public USING (true);
CREATE POLICY "Allow public delete on asset_criticality_ratings" ON public.asset_criticality_ratings FOR DELETE TO public USING (true);
