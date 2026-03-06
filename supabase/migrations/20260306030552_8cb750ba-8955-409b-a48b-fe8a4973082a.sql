CREATE TABLE public.po_transit_checkpoints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  po_tracker_id uuid NOT NULL REFERENCES public.po_tracker(id) ON DELETE CASCADE,
  location text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  scanned_by text NOT NULL DEFAULT '',
  latitude numeric NULL,
  longitude numeric NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.po_transit_checkpoints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on po_transit_checkpoints" ON public.po_transit_checkpoints FOR SELECT USING (true);
CREATE POLICY "Allow public insert on po_transit_checkpoints" ON public.po_transit_checkpoints FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete on po_transit_checkpoints" ON public.po_transit_checkpoints FOR DELETE USING (true);