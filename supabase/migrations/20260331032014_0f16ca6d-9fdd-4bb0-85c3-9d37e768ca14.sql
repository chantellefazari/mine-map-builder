
CREATE TABLE public.shutdown_personnel (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id uuid NOT NULL REFERENCES public.shutdown_vendors(id) ON DELETE CASCADE,
  shutdown_id uuid NOT NULL REFERENCES public.shutdowns(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT '',
  trade text NOT NULL DEFAULT 'Mechanical',
  role text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  is_available boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.shutdown_personnel ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to shutdown_personnel"
  ON public.shutdown_personnel
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);
