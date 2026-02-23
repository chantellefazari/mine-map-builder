
-- Move part-specific fields to a line items table
CREATE TABLE public.po_tracker_lines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  po_tracker_id UUID NOT NULL REFERENCES public.po_tracker(id) ON DELETE CASCADE,
  part_description TEXT NOT NULL DEFAULT '',
  part_number TEXT NOT NULL DEFAULT '',
  quantity_ordered NUMERIC NOT NULL DEFAULT 0,
  unit_price NUMERIC DEFAULT 0,
  received_qty NUMERIC NOT NULL DEFAULT 0,
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.po_tracker_lines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on po_tracker_lines" ON public.po_tracker_lines FOR SELECT USING (true);
CREATE POLICY "Allow public insert on po_tracker_lines" ON public.po_tracker_lines FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on po_tracker_lines" ON public.po_tracker_lines FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on po_tracker_lines" ON public.po_tracker_lines FOR DELETE USING (true);

CREATE TRIGGER update_po_tracker_lines_updated_at
  BEFORE UPDATE ON public.po_tracker_lines
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Remove part columns from po_tracker header (they now live in lines)
ALTER TABLE public.po_tracker DROP COLUMN IF EXISTS part_description;
ALTER TABLE public.po_tracker DROP COLUMN IF EXISTS part_number;
ALTER TABLE public.po_tracker DROP COLUMN IF EXISTS quantity_ordered;

-- Auto PO number generator
CREATE OR REPLACE FUNCTION public.next_po_number()
RETURNS TEXT
LANGUAGE sql
STABLE
SET search_path TO 'public'
AS $$
  SELECT 'PO-' || LPAD((COALESCE(MAX(CAST(SUBSTRING(po_number FROM 4) AS INTEGER)), 0) + 1)::TEXT, 6, '0')
  FROM public.po_tracker;
$$;
