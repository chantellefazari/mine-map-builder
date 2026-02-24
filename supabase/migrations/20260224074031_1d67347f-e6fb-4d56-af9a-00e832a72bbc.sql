
-- Main purchase_requests table
CREATE TABLE public.purchase_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pr_number text NOT NULL,
  work_order_id uuid REFERENCES public.work_orders(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'Draft',
  supervisor_name text NOT NULL DEFAULT '',
  supervisor_user_id uuid,
  department text NOT NULL DEFAULT '',
  supplier_id uuid REFERENCES public.suppliers(id) ON DELETE SET NULL,
  supplier_name text NOT NULL DEFAULT '',
  supplier_organises_freight boolean NOT NULL DEFAULT false,
  delivery_address text NOT NULL DEFAULT 'TCMG – Tennant Creek Gold Mine, NT 0861',
  required_date date,
  quote_url text DEFAULT '',
  comments text NOT NULL DEFAULT '',
  submitted_at timestamptz,
  approved_at timestamptz,
  approved_by text DEFAULT '',
  admin_notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Line items
CREATE TABLE public.purchase_request_lines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_request_id uuid NOT NULL REFERENCES public.purchase_requests(id) ON DELETE CASCADE,
  part_description text NOT NULL DEFAULT '',
  quantity numeric NOT NULL DEFAULT 1,
  estimated_cost numeric NOT NULL DEFAULT 0,
  gl_code text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- PR number function (table exists now)
CREATE OR REPLACE FUNCTION public.next_pr_number()
RETURNS text
LANGUAGE sql
STABLE
SET search_path TO 'public'
AS $$
  SELECT 'PR-' || LPAD((COALESCE(MAX(CAST(SUBSTRING(pr_number FROM 4) AS INTEGER)), 0) + 1)::TEXT, 5, '0')
  FROM public.purchase_requests;
$$;

-- RLS
ALTER TABLE public.purchase_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_request_lines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read on purchase_requests" ON public.purchase_requests FOR SELECT USING (true);
CREATE POLICY "Allow insert on purchase_requests" ON public.purchase_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update on purchase_requests" ON public.purchase_requests FOR UPDATE USING (true);
CREATE POLICY "Allow delete on purchase_requests" ON public.purchase_requests FOR DELETE USING (true);

CREATE POLICY "Allow read on purchase_request_lines" ON public.purchase_request_lines FOR SELECT USING (true);
CREATE POLICY "Allow insert on purchase_request_lines" ON public.purchase_request_lines FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update on purchase_request_lines" ON public.purchase_request_lines FOR UPDATE USING (true);
CREATE POLICY "Allow delete on purchase_request_lines" ON public.purchase_request_lines FOR DELETE USING (true);

CREATE TRIGGER update_purchase_requests_updated_at
  BEFORE UPDATE ON public.purchase_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_purchase_request_lines_updated_at
  BEFORE UPDATE ON public.purchase_request_lines
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage for quote PDFs
INSERT INTO storage.buckets (id, name, public) VALUES ('pr-quotes', 'pr-quotes', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Allow public read on pr-quotes" ON storage.objects FOR SELECT USING (bucket_id = 'pr-quotes');
CREATE POLICY "Allow upload to pr-quotes" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'pr-quotes');
CREATE POLICY "Allow delete on pr-quotes" ON storage.objects FOR DELETE USING (bucket_id = 'pr-quotes');
