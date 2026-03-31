
CREATE TABLE public.vendor_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_name text NOT NULL,
  contact_name text NOT NULL DEFAULT '',
  contact_phone text NOT NULL DEFAULT '',
  contact_email text NOT NULL DEFAULT '',
  visit_date date NOT NULL,
  visit_end_date date,
  purpose text NOT NULL DEFAULT '',
  forms_required text[] NOT NULL DEFAULT '{}',
  notes text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'Scheduled',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.vendor_visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on vendor_visits" ON public.vendor_visits FOR SELECT TO public USING (true);
CREATE POLICY "Allow public insert on vendor_visits" ON public.vendor_visits FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public update on vendor_visits" ON public.vendor_visits FOR UPDATE TO public USING (true);
CREATE POLICY "Allow public delete on vendor_visits" ON public.vendor_visits FOR DELETE TO public USING (true);

CREATE TRIGGER update_vendor_visits_updated_at BEFORE UPDATE ON public.vendor_visits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
