
ALTER TABLE public.pm_master_list
  ADD COLUMN IF NOT EXISTS work_centre text NOT NULL DEFAULT 'MECH',
  ADD COLUMN IF NOT EXISTS crew_size integer NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS trade_hours jsonb NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS materials jsonb NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS permit_requirements jsonb NOT NULL DEFAULT '{"loto_required": false, "confined_space": false, "hot_work": false, "working_at_heights": false, "isolation_required": false, "permit_type": "None", "environmental_hazards": "", "stored_energy_hazards": ""}',
  ADD COLUMN IF NOT EXISTS measurements jsonb NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS documents jsonb NOT NULL DEFAULT '[]';
