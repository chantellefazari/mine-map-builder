-- Quote requests sent to suppliers
CREATE TABLE public.quote_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token text NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex') UNIQUE,
  spare_id uuid REFERENCES public.site_spares(id) ON DELETE SET NULL,
  part_description text NOT NULL DEFAULT '',
  part_number text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  quantity integer NOT NULL DEFAULT 1,
  specifications text NOT NULL DEFAULT '',
  supplier_name text NOT NULL DEFAULT '',
  supplier_email text NOT NULL DEFAULT '',
  supplier_id uuid REFERENCES public.suppliers(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'Sent',
  notes text NOT NULL DEFAULT '',
  created_by text NOT NULL DEFAULT '',
  expires_at timestamp with time zone DEFAULT (now() + interval '14 days'),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on quote_requests" ON public.quote_requests FOR SELECT USING (true);
CREATE POLICY "Allow public insert on quote_requests" ON public.quote_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on quote_requests" ON public.quote_requests FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on quote_requests" ON public.quote_requests FOR DELETE USING (true);

-- Quote responses from suppliers
CREATE TABLE public.quote_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_request_id uuid NOT NULL REFERENCES public.quote_requests(id) ON DELETE CASCADE,
  unit_price numeric NOT NULL DEFAULT 0,
  total_price numeric NOT NULL DEFAULT 0,
  lead_time_days integer NOT NULL DEFAULT 0,
  validity_days integer NOT NULL DEFAULT 30,
  currency text NOT NULL DEFAULT 'AUD',
  supplier_reference text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  responded_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.quote_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on quote_responses" ON public.quote_responses FOR SELECT USING (true);
CREATE POLICY "Allow public insert on quote_responses" ON public.quote_responses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on quote_responses" ON public.quote_responses FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on quote_responses" ON public.quote_responses FOR DELETE USING (true);

-- Add confirmation token to po_tracker for supplier PO acknowledgement
ALTER TABLE public.po_tracker ADD COLUMN IF NOT EXISTS confirmation_token text DEFAULT encode(gen_random_bytes(32), 'hex');
ALTER TABLE public.po_tracker ADD COLUMN IF NOT EXISTS supplier_confirmed boolean NOT NULL DEFAULT false;
ALTER TABLE public.po_tracker ADD COLUMN IF NOT EXISTS supplier_confirmed_at timestamp with time zone;
ALTER TABLE public.po_tracker ADD COLUMN IF NOT EXISTS supplier_eta_update text NOT NULL DEFAULT '';
ALTER TABLE public.po_tracker ADD COLUMN IF NOT EXISTS quote_request_id uuid REFERENCES public.quote_requests(id) ON DELETE SET NULL;

-- Trigger for updated_at
CREATE TRIGGER update_quote_requests_updated_at BEFORE UPDATE ON public.quote_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
