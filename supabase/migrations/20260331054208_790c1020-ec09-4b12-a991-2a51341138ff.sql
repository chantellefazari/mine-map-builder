
CREATE TABLE public.equipment_service_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_name text NOT NULL,
  asset_number text NOT NULL DEFAULT '',
  current_hours numeric NOT NULL DEFAULT 0,
  service_interval_hours numeric NOT NULL DEFAULT 500,
  last_service_hours numeric NOT NULL DEFAULT 0,
  last_service_date date,
  next_service_due_hours numeric NOT NULL DEFAULT 500,
  service_vendor text NOT NULL DEFAULT 'Wilson Diesel',
  forms_required text[] NOT NULL DEFAULT '{}',
  notes text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'OK',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.equipment_service_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select on equipment_service_tracking" ON public.equipment_service_tracking FOR SELECT TO public USING (true);
CREATE POLICY "Allow public insert on equipment_service_tracking" ON public.equipment_service_tracking FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public update on equipment_service_tracking" ON public.equipment_service_tracking FOR UPDATE TO public USING (true);
CREATE POLICY "Allow public delete on equipment_service_tracking" ON public.equipment_service_tracking FOR DELETE TO public USING (true);
