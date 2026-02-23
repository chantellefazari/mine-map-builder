
-- =====================================================
-- Processing Plant Hierarchy Tables
-- =====================================================

-- 1. Main hierarchy assets table (flattened with hierarchy context)
CREATE TABLE public.processing_plant_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  facility text NOT NULL DEFAULT 'Processing Plant',
  area_code text NOT NULL,
  area_label text NOT NULL,
  sub_area text NOT NULL,
  parent_asset_label text NOT NULL,
  asset_number text NOT NULL,
  asset_name text NOT NULL,
  pid_tags text[] DEFAULT '{}',
  -- Component data (only populated for components nested under equipment)
  components jsonb DEFAULT '[]',
  -- Hierarchy metadata
  functional_location text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_ppa_asset_number ON public.processing_plant_assets(asset_number);
CREATE INDEX idx_ppa_area_code ON public.processing_plant_assets(area_code);
CREATE INDEX idx_ppa_parent_asset ON public.processing_plant_assets(parent_asset_label);

-- Enable RLS
ALTER TABLE public.processing_plant_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on processing_plant_assets" ON public.processing_plant_assets FOR SELECT USING (true);
CREATE POLICY "Allow public insert on processing_plant_assets" ON public.processing_plant_assets FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on processing_plant_assets" ON public.processing_plant_assets FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on processing_plant_assets" ON public.processing_plant_assets FOR DELETE USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_processing_plant_assets_updated_at
  BEFORE UPDATE ON public.processing_plant_assets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. P&ID Tag Mappings
CREATE TABLE public.processing_pid_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pid_tag text NOT NULL,
  asset_number text NOT NULL,
  description text NOT NULL,
  status text NOT NULL DEFAULT 'mapped',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_ppt_pid_tag ON public.processing_pid_tags(pid_tag);
CREATE INDEX idx_ppt_asset_number ON public.processing_pid_tags(asset_number);

ALTER TABLE public.processing_pid_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on processing_pid_tags" ON public.processing_pid_tags FOR SELECT USING (true);
CREATE POLICY "Allow public insert on processing_pid_tags" ON public.processing_pid_tags FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on processing_pid_tags" ON public.processing_pid_tags FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on processing_pid_tags" ON public.processing_pid_tags FOR DELETE USING (true);

-- 3. Naming Conventions reference data
CREATE TABLE public.processing_naming_conventions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  convention_type text NOT NULL, -- 'area_code', 'equipment_prefix', 'component_suffix', 'instrumentation_suffix', 'special_pattern'
  code text NOT NULL,
  meaning text NOT NULL,
  description text DEFAULT '',
  example text DEFAULT '',
  category text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_pnc_type ON public.processing_naming_conventions(convention_type);

ALTER TABLE public.processing_naming_conventions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on processing_naming_conventions" ON public.processing_naming_conventions FOR SELECT USING (true);
CREATE POLICY "Allow public insert on processing_naming_conventions" ON public.processing_naming_conventions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on processing_naming_conventions" ON public.processing_naming_conventions FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on processing_naming_conventions" ON public.processing_naming_conventions FOR DELETE USING (true);

-- 4. Functional Locations
CREATE TABLE public.processing_functional_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fl_code text NOT NULL,
  area text NOT NULL,
  area_code text NOT NULL,
  sub_area text NOT NULL,
  sub_area_code text NOT NULL,
  system_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_pfl_code ON public.processing_functional_locations(fl_code);

ALTER TABLE public.processing_functional_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on processing_functional_locations" ON public.processing_functional_locations FOR SELECT USING (true);
CREATE POLICY "Allow public insert on processing_functional_locations" ON public.processing_functional_locations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on processing_functional_locations" ON public.processing_functional_locations FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on processing_functional_locations" ON public.processing_functional_locations FOR DELETE USING (true);
