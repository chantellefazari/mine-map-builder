
-- PM-to-Asset Link Staging Table
-- This is the ONLY table where linking occurs. Asset Tree and PM Templates are READ ONLY.
CREATE TABLE public.pm_asset_link_staging (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pm_template_id UUID NOT NULL,
  pm_template_name TEXT NOT NULL,
  pm_frequency TEXT NOT NULL DEFAULT '',
  pm_equipment_ref TEXT NOT NULL DEFAULT '',
  current_linked_asset TEXT DEFAULT '',
  asset_match_key TEXT DEFAULT '',
  matched_asset_id TEXT DEFAULT '',
  matched_asset_name TEXT DEFAULT '',
  matched_asset_area TEXT DEFAULT '',
  matched_asset_parent TEXT DEFAULT '',
  match_confidence TEXT NOT NULL DEFAULT 'None' CHECK (match_confidence IN ('Exact', 'Keyword', 'Multiple', 'None')),
  validation_status TEXT NOT NULL DEFAULT 'Pending' CHECK (validation_status IN ('Pending', 'Confirmed', 'Manual Review Required')),
  committed BOOLEAN NOT NULL DEFAULT false,
  committed_at TIMESTAMP WITH TIME ZONE,
  committed_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pm_asset_link_staging ENABLE ROW LEVEL SECURITY;

-- Public access policies (matches project pattern)
CREATE POLICY "Allow public read on pm_asset_link_staging" ON public.pm_asset_link_staging FOR SELECT USING (true);
CREATE POLICY "Allow public insert on pm_asset_link_staging" ON public.pm_asset_link_staging FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on pm_asset_link_staging" ON public.pm_asset_link_staging FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on pm_asset_link_staging" ON public.pm_asset_link_staging FOR DELETE USING (true);

-- Auto-update timestamp
CREATE TRIGGER update_pm_asset_link_staging_updated_at
  BEFORE UPDATE ON public.pm_asset_link_staging
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Audit logging
CREATE TRIGGER audit_pm_asset_link_staging
  AFTER INSERT OR UPDATE OR DELETE ON public.pm_asset_link_staging
  FOR EACH ROW
  EXECUTE FUNCTION public.log_audit_event();
