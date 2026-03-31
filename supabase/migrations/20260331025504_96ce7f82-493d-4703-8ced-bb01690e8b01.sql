
-- Shutdowns master table
CREATE TABLE public.shutdowns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  shutdown_rev TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL DEFAULT 'Planned Shutdown',
  status TEXT NOT NULL DEFAULT 'Planning',
  start_date DATE NOT NULL,
  end_date DATE,
  start_time TEXT DEFAULT '06:00',
  end_time TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Shutdown vendors / resource allocation
CREATE TABLE public.shutdown_vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shutdown_id UUID REFERENCES public.shutdowns(id) ON DELETE CASCADE NOT NULL,
  vendor_code TEXT NOT NULL DEFAULT '',
  vendor_name TEXT NOT NULL,
  contact_name TEXT DEFAULT '',
  contact_phone TEXT DEFAULT '',
  contact_email TEXT DEFAULT '',
  personnel_count INTEGER DEFAULT 0,
  daily_hours NUMERIC(5,2) DEFAULT 10.5,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Shutdown work order assignments (links WOs to shutdown + vendor + scheduled day)
CREATE TABLE public.shutdown_work_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shutdown_id UUID REFERENCES public.shutdowns(id) ON DELETE CASCADE NOT NULL,
  work_order_id UUID REFERENCES public.work_orders(id) ON DELETE CASCADE NOT NULL,
  vendor_id UUID REFERENCES public.shutdown_vendors(id) ON DELETE SET NULL,
  scheduled_date DATE,
  line_number INTEGER DEFAULT 0,
  duration_hours NUMERIC(5,2) DEFAULT 0,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.shutdowns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shutdown_vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shutdown_work_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to shutdowns" ON public.shutdowns FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to shutdown_vendors" ON public.shutdown_vendors FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to shutdown_work_orders" ON public.shutdown_work_orders FOR ALL USING (true) WITH CHECK (true);

-- Auto-generate shutdown rev code
CREATE OR REPLACE FUNCTION public.generate_shutdown_rev()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  yr TEXT;
  seq INT;
BEGIN
  yr := 'Y' || to_char(NEW.start_date, 'YY');
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(shutdown_rev FROM '-SH(\d+)$') AS INTEGER)
  ), 0) + 1
  INTO seq
  FROM public.shutdowns
  WHERE shutdown_rev LIKE yr || '-SH%';
  
  NEW.shutdown_rev := yr || '-SH' || LPAD(seq::TEXT, 2, '0');
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_shutdown_rev
BEFORE INSERT ON public.shutdowns
FOR EACH ROW
EXECUTE FUNCTION public.generate_shutdown_rev();
