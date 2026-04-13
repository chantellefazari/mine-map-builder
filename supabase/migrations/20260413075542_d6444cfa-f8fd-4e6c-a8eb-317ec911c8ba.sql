
-- ===========================================
-- 1. PERMITS TO WORK
-- ===========================================
CREATE TABLE public.permits_to_work (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  permit_number TEXT NOT NULL DEFAULT '',
  permit_type TEXT NOT NULL DEFAULT 'General',
  work_order_id UUID REFERENCES public.work_orders(id) ON DELETE SET NULL,
  asset_number TEXT NOT NULL DEFAULT '',
  area TEXT NOT NULL DEFAULT '',
  location_detail TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  hazards JSONB NOT NULL DEFAULT '[]'::jsonb,
  controls JSONB NOT NULL DEFAULT '[]'::jsonb,
  ppe_required TEXT[] NOT NULL DEFAULT '{}'::text[],
  isolation_required BOOLEAN NOT NULL DEFAULT false,
  hot_work BOOLEAN NOT NULL DEFAULT false,
  confined_space BOOLEAN NOT NULL DEFAULT false,
  working_at_heights BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'Draft',
  issued_by TEXT NOT NULL DEFAULT '',
  approved_by TEXT NOT NULL DEFAULT '',
  approved_at TIMESTAMPTZ,
  valid_from TIMESTAMPTZ,
  valid_to TIMESTAMPTZ,
  closed_by TEXT NOT NULL DEFAULT '',
  closed_at TIMESTAMPTZ,
  closure_notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.permits_to_work ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on permits_to_work" ON public.permits_to_work FOR SELECT USING (true);
CREATE POLICY "Allow public insert on permits_to_work" ON public.permits_to_work FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on permits_to_work" ON public.permits_to_work FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on permits_to_work" ON public.permits_to_work FOR DELETE USING (true);

-- ===========================================
-- 2. FAILURE RECORDS
-- ===========================================
CREATE TABLE public.failure_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  work_order_id UUID REFERENCES public.work_orders(id) ON DELETE SET NULL,
  asset_number TEXT NOT NULL DEFAULT '',
  asset_name TEXT NOT NULL DEFAULT '',
  area TEXT NOT NULL DEFAULT '',
  failure_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  failure_mode TEXT NOT NULL DEFAULT '',
  failure_cause TEXT NOT NULL DEFAULT '',
  failure_remedy TEXT NOT NULL DEFAULT '',
  failure_class TEXT NOT NULL DEFAULT 'Mechanical',
  severity TEXT NOT NULL DEFAULT 'Minor',
  downtime_hours NUMERIC NOT NULL DEFAULT 0,
  component_failed TEXT NOT NULL DEFAULT '',
  detected_by TEXT NOT NULL DEFAULT '',
  detection_method TEXT NOT NULL DEFAULT 'Visual Inspection',
  root_cause_category TEXT NOT NULL DEFAULT '',
  corrective_action TEXT NOT NULL DEFAULT '',
  preventive_action TEXT NOT NULL DEFAULT '',
  is_recurring BOOLEAN NOT NULL DEFAULT false,
  notes TEXT NOT NULL DEFAULT '',
  reported_by TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.failure_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on failure_records" ON public.failure_records FOR SELECT USING (true);
CREATE POLICY "Allow public insert on failure_records" ON public.failure_records FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on failure_records" ON public.failure_records FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on failure_records" ON public.failure_records FOR DELETE USING (true);

-- ===========================================
-- 3. CONDITION MONITORING TRIGGERS
-- ===========================================
CREATE TABLE public.condition_triggers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trigger_name TEXT NOT NULL DEFAULT '',
  asset_number TEXT NOT NULL DEFAULT '',
  asset_name TEXT NOT NULL DEFAULT '',
  area TEXT NOT NULL DEFAULT '',
  trigger_type TEXT NOT NULL DEFAULT 'Meter-Based',
  parameter_name TEXT NOT NULL DEFAULT '',
  threshold_value NUMERIC NOT NULL DEFAULT 0,
  threshold_unit TEXT NOT NULL DEFAULT '',
  warning_threshold NUMERIC,
  critical_threshold NUMERIC,
  current_value NUMERIC NOT NULL DEFAULT 0,
  last_reading_date TIMESTAMPTZ,
  reading_source TEXT NOT NULL DEFAULT 'Manual',
  pm_template_id UUID,
  linked_wo_id UUID REFERENCES public.work_orders(id) ON DELETE SET NULL,
  frequency_hours NUMERIC,
  last_triggered_at TIMESTAMPTZ,
  auto_generate_wo BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'Active',
  notes TEXT NOT NULL DEFAULT '',
  created_by TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.condition_triggers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on condition_triggers" ON public.condition_triggers FOR SELECT USING (true);
CREATE POLICY "Allow public insert on condition_triggers" ON public.condition_triggers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on condition_triggers" ON public.condition_triggers FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on condition_triggers" ON public.condition_triggers FOR DELETE USING (true);

-- Indexes
CREATE INDEX idx_permits_work_order ON public.permits_to_work(work_order_id);
CREATE INDEX idx_permits_status ON public.permits_to_work(status);
CREATE INDEX idx_failure_records_work_order ON public.failure_records(work_order_id);
CREATE INDEX idx_failure_records_asset ON public.failure_records(asset_number);
CREATE INDEX idx_condition_triggers_asset ON public.condition_triggers(asset_number);
CREATE INDEX idx_condition_triggers_status ON public.condition_triggers(status);
