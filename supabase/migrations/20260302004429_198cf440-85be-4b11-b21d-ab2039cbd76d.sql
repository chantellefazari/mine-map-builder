
-- Rev B Processing Plant Assets — isolated from Rev A
CREATE TABLE public.processing_plant_assets_rev_b (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  facility TEXT NOT NULL DEFAULT 'Processing Plant',
  area_code TEXT NOT NULL,
  area_label TEXT NOT NULL,
  sub_area TEXT NOT NULL,
  parent_asset_label TEXT NOT NULL,
  asset_number TEXT NOT NULL,
  asset_name TEXT NOT NULL,
  pid_tags TEXT[] DEFAULT '{}'::text[],
  components JSONB DEFAULT '[]'::jsonb,
  functional_location TEXT DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  source_extraction_ids UUID[] DEFAULT '{}'::uuid[],
  rev_status TEXT NOT NULL DEFAULT 'Draft' CHECK (rev_status IN ('Draft','Review','Approved')),
  change_type TEXT NOT NULL DEFAULT 'Unchanged' CHECK (change_type IN ('Unchanged','New','Modified','Removed')),
  rev_a_asset_id UUID,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.processing_plant_assets_rev_b ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on processing_plant_assets_rev_b" ON public.processing_plant_assets_rev_b FOR SELECT USING (true);
CREATE POLICY "Allow public insert on processing_plant_assets_rev_b" ON public.processing_plant_assets_rev_b FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on processing_plant_assets_rev_b" ON public.processing_plant_assets_rev_b FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on processing_plant_assets_rev_b" ON public.processing_plant_assets_rev_b FOR DELETE USING (true);

CREATE INDEX idx_rev_b_assets_area ON public.processing_plant_assets_rev_b(area_code);
CREATE INDEX idx_rev_b_assets_sort ON public.processing_plant_assets_rev_b(sort_order);
CREATE INDEX idx_rev_b_assets_change ON public.processing_plant_assets_rev_b(change_type);
CREATE INDEX idx_rev_b_assets_asset_number ON public.processing_plant_assets_rev_b(asset_number);
