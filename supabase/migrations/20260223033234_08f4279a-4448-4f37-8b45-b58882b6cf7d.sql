
-- PO Tracker table
CREATE TABLE public.po_tracker (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  po_number TEXT NOT NULL UNIQUE,
  work_order_id UUID REFERENCES public.work_orders(id) ON DELETE SET NULL,
  supplier TEXT NOT NULL DEFAULT '',
  part_description TEXT NOT NULL DEFAULT '',
  part_number TEXT NOT NULL DEFAULT '',
  quantity_ordered NUMERIC NOT NULL DEFAULT 0,
  order_date DATE,
  eta DATE,
  status TEXT NOT NULL DEFAULT 'Ordered',
  confirmed_on_site BOOLEAN NOT NULL DEFAULT false,
  date_received DATE,
  comments TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.po_tracker ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on po_tracker" ON public.po_tracker FOR SELECT USING (true);
CREATE POLICY "Allow public insert on po_tracker" ON public.po_tracker FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on po_tracker" ON public.po_tracker FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on po_tracker" ON public.po_tracker FOR DELETE USING (true);

CREATE TRIGGER update_po_tracker_updated_at
  BEFORE UPDATE ON public.po_tracker
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
