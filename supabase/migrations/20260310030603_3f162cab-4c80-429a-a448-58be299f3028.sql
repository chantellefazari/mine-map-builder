CREATE TABLE public.asset_tag_production (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_number TEXT NOT NULL,
  asset_name TEXT NOT NULL,
  pid_tag TEXT NOT NULL DEFAULT '',
  tag_type TEXT NOT NULL DEFAULT 'B',
  tag_size TEXT NOT NULL DEFAULT '70mm x 25mm x 1.5mm',
  mounting_location TEXT NOT NULL DEFAULT '',
  mounting_method TEXT NOT NULL DEFAULT '',
  parent_system TEXT NOT NULL DEFAULT '',
  area_label TEXT NOT NULL DEFAULT '',
  sub_area TEXT NOT NULL DEFAULT '',
  functional_location TEXT DEFAULT '',
  tag_installed BOOLEAN NOT NULL DEFAULT false,
  installed_date TIMESTAMP WITH TIME ZONE,
  installed_by TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.asset_tag_production ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on asset_tag_production" ON public.asset_tag_production FOR SELECT TO public USING (true);
CREATE POLICY "Allow public insert on asset_tag_production" ON public.asset_tag_production FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public update on asset_tag_production" ON public.asset_tag_production FOR UPDATE TO public USING (true);
CREATE POLICY "Allow public delete on asset_tag_production" ON public.asset_tag_production FOR DELETE TO public USING (true);