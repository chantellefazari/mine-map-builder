
CREATE TABLE public.practice_suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL DEFAULT '',
  name text NOT NULL,
  contact text NOT NULL DEFAULT '',
  type text NOT NULL DEFAULT 'Trade / General Supplier',
  work_phone text NOT NULL DEFAULT '',
  mobile text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  what_used_for text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  is_preferred boolean NOT NULL DEFAULT false,
  abn text NOT NULL DEFAULT '',
  payment_terms text NOT NULL DEFAULT '',
  preferred_freight_company text NOT NULL DEFAULT '',
  default_delivery_address text NOT NULL DEFAULT '',
  organises_freight boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.practice_suppliers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on practice_suppliers" ON public.practice_suppliers FOR SELECT USING (true);
CREATE POLICY "Allow public insert on practice_suppliers" ON public.practice_suppliers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on practice_suppliers" ON public.practice_suppliers FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on practice_suppliers" ON public.practice_suppliers FOR DELETE USING (true);
