
-- 1. Full backup of Rev B asset tree
CREATE TABLE public.processing_plant_assets_rev_b_backup AS
SELECT * FROM public.processing_plant_assets_rev_b;

-- Add primary key constraint
ALTER TABLE public.processing_plant_assets_rev_b_backup
  ADD PRIMARY KEY (id);

-- Add metadata columns for backup tracking
ALTER TABLE public.processing_plant_assets_rev_b_backup
  ADD COLUMN backup_label text NOT NULL DEFAULT 'Pre-Cleanup Backup',
  ADD COLUMN backed_up_at timestamptz NOT NULL DEFAULT now();

-- 2. Full backup of extraction register
CREATE TABLE public.rev_b_pid_extraction_register_backup AS
SELECT * FROM public.rev_b_pid_extraction_register;

ALTER TABLE public.rev_b_pid_extraction_register_backup
  ADD PRIMARY KEY (id);

ALTER TABLE public.rev_b_pid_extraction_register_backup
  ADD COLUMN backup_label text NOT NULL DEFAULT 'Pre-Cleanup Backup',
  ADD COLUMN backed_up_at timestamptz NOT NULL DEFAULT now();

-- 3. Enable RLS on both backup tables (read-only policies only)
ALTER TABLE public.processing_plant_assets_rev_b_backup ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rev_b_pid_extraction_register_backup ENABLE ROW LEVEL SECURITY;

-- Read-only: SELECT only, no insert/update/delete
CREATE POLICY "Allow public read on rev_b_asset_backup"
  ON public.processing_plant_assets_rev_b_backup
  FOR SELECT USING (true);

CREATE POLICY "Allow public read on rev_b_extraction_backup"
  ON public.rev_b_pid_extraction_register_backup
  FOR SELECT USING (true);
