
-- Valve/pressure equipment certificate tracking
CREATE TABLE public.valve_certificates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  certificate_number TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  valve_type TEXT NOT NULL DEFAULT '',
  document_url TEXT DEFAULT '',
  file_name TEXT NOT NULL DEFAULT '',
  installed_date DATE,
  installed_by TEXT NOT NULL DEFAULT '',
  expiry_date DATE,
  asset_number TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'Active',
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.valve_certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on valve_certificates" ON public.valve_certificates FOR SELECT TO public USING (true);
CREATE POLICY "Allow public insert on valve_certificates" ON public.valve_certificates FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public update on valve_certificates" ON public.valve_certificates FOR UPDATE TO public USING (true);
CREATE POLICY "Allow public delete on valve_certificates" ON public.valve_certificates FOR DELETE TO public USING (true);

-- Storage bucket for certificate PDFs
INSERT INTO storage.buckets (id, name, public) VALUES ('valve-certificates', 'valve-certificates', true);

CREATE POLICY "Allow public upload to valve-certificates" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'valve-certificates');
CREATE POLICY "Allow public read from valve-certificates" ON storage.objects FOR SELECT TO public USING (bucket_id = 'valve-certificates');
CREATE POLICY "Allow public delete from valve-certificates" ON storage.objects FOR DELETE TO public USING (bucket_id = 'valve-certificates');
