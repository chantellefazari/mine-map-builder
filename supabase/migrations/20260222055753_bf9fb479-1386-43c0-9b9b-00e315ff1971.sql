
-- ============================================================
-- Table 1: pm_master_list — stores PMData (master list / frequency view)
-- ============================================================
CREATE TABLE public.pm_master_list (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pm_name TEXT NOT NULL,
  equipment_type TEXT NOT NULL,
  frequency TEXT NOT NULL CHECK (frequency IN ('Daily', '1 Week', '2 Week', '6 Week', '12 Week')),
  purpose TEXT NOT NULL DEFAULT '',
  discipline TEXT NOT NULL CHECK (discipline IN ('Mechanical', 'Electrical', 'Ops')),
  duty_type TEXT NOT NULL DEFAULT 'Both' CHECK (duty_type IN ('Duty', 'Standby', 'Both')),
  estimated_duration TEXT NOT NULL DEFAULT '',
  skill_level TEXT NOT NULL DEFAULT '',
  required_tools TEXT[] NOT NULL DEFAULT '{}',
  required_ppe TEXT[] NOT NULL DEFAULT '{}',
  isolation_requirements TEXT NOT NULL DEFAULT '',
  safety_notes TEXT[] NOT NULL DEFAULT '{}',
  tasks JSONB NOT NULL DEFAULT '[]',
  inspection_points JSONB NOT NULL DEFAULT '[]',
  acceptable_criteria TEXT[] NOT NULL DEFAULT '{}',
  signs_of_failure TEXT[] NOT NULL DEFAULT '{}',
  lubrication_notes TEXT NOT NULL DEFAULT '',
  oem_references TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Reviewed', 'Approved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- Table 2: pm_templates — stores PMTemplateData (detailed template documents)
-- ============================================================
CREATE TABLE public.pm_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pm_title TEXT NOT NULL,
  equipment_type TEXT NOT NULL,
  pm_frequency TEXT NOT NULL,
  discipline TEXT NOT NULL CHECK (discipline IN ('Mechanical', 'Electrical', 'Ops')),
  estimated_duration TEXT NOT NULL DEFAULT '',
  skill_level TEXT NOT NULL DEFAULT '',
  location_area TEXT NOT NULL DEFAULT '',
  revision TEXT NOT NULL DEFAULT 'A',
  prepared_by TEXT NOT NULL DEFAULT '',
  approved_by TEXT NOT NULL DEFAULT '',
  last_review_date TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Reviewed', 'Approved')),
  -- Safety & Isolations (JSONB for nested objects)
  isolations JSONB NOT NULL DEFAULT '{"electrical":false,"mechanical":false,"hydraulic":false,"pneumatic":false}',
  loto_required BOOLEAN NOT NULL DEFAULT false,
  stored_energy_hazards TEXT NOT NULL DEFAULT '',
  confined_space_risk BOOLEAN NOT NULL DEFAULT false,
  working_at_heights_risk BOOLEAN NOT NULL DEFAULT false,
  hot_work_required BOOLEAN NOT NULL DEFAULT false,
  environmental_hazards TEXT NOT NULL DEFAULT '',
  emergency_stops_location TEXT NOT NULL DEFAULT '',
  -- PPE & Tools (JSONB for nested objects)
  ppe JSONB NOT NULL DEFAULT '{}',
  tools JSONB NOT NULL DEFAULT '{}',
  -- Checklists
  pre_start_checks TEXT[] NOT NULL DEFAULT '{}',
  inspection_tasks TEXT[] NOT NULL DEFAULT '{}',
  mechanical_tasks TEXT[] NOT NULL DEFAULT '{}',
  electrical_tasks TEXT[] NOT NULL DEFAULT '{}',
  acceptable_criteria TEXT[] NOT NULL DEFAULT '{}',
  signs_of_failure TEXT[] NOT NULL DEFAULT '{}',
  -- Lubrication (JSONB)
  lubrication JSONB NOT NULL DEFAULT '{}',
  post_work_checks TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pm_master_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pm_templates ENABLE ROW LEVEL SECURITY;

-- RLS policies — authenticated users can CRUD
CREATE POLICY "Authenticated users can read pm_master_list" ON public.pm_master_list FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert pm_master_list" ON public.pm_master_list FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update pm_master_list" ON public.pm_master_list FOR UPDATE USING (true);
CREATE POLICY "Authenticated users can delete pm_master_list" ON public.pm_master_list FOR DELETE USING (true);

CREATE POLICY "Authenticated users can read pm_templates" ON public.pm_templates FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert pm_templates" ON public.pm_templates FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update pm_templates" ON public.pm_templates FOR UPDATE USING (true);
CREATE POLICY "Authenticated users can delete pm_templates" ON public.pm_templates FOR DELETE USING (true);

-- Triggers for updated_at
CREATE TRIGGER update_pm_master_list_updated_at
  BEFORE UPDATE ON public.pm_master_list
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pm_templates_updated_at
  BEFORE UPDATE ON public.pm_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Audit triggers
CREATE TRIGGER audit_pm_master_list
  AFTER INSERT OR UPDATE OR DELETE ON public.pm_master_list
  FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

CREATE TRIGGER audit_pm_templates
  AFTER INSERT OR UPDATE OR DELETE ON public.pm_templates
  FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();
