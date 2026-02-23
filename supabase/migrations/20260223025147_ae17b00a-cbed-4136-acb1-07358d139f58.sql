
-- Work orders table with sequential numbering
CREATE TABLE public.work_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wo_number TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'Open',
  priority TEXT NOT NULL DEFAULT 'Normal',
  work_type TEXT NOT NULL DEFAULT 'Reactive',
  asset_id TEXT DEFAULT '',
  functional_location TEXT DEFAULT '',
  problem_description TEXT DEFAULT '',
  work_performed TEXT DEFAULT '',
  parts_used TEXT DEFAULT '',
  trade TEXT DEFAULT '',
  requested_by TEXT DEFAULT '',
  assigned_to TEXT DEFAULT '',
  date_raised TIMESTAMP WITH TIME ZONE DEFAULT now(),
  date_completed TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.work_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on work_orders" ON public.work_orders FOR SELECT USING (true);
CREATE POLICY "Allow public insert on work_orders" ON public.work_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on work_orders" ON public.work_orders FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on work_orders" ON public.work_orders FOR DELETE USING (true);

-- Auto-update timestamp
CREATE TRIGGER update_work_orders_updated_at
  BEFORE UPDATE ON public.work_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to get next WO number
CREATE OR REPLACE FUNCTION public.next_wo_number()
RETURNS TEXT
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT 'WO-' || LPAD((COALESCE(MAX(CAST(SUBSTRING(wo_number FROM 4) AS INTEGER)), 0) + 1)::TEXT, 6, '0')
  FROM public.work_orders;
$$;
