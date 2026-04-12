
-- Create counters table for atomic number allocation per work type
CREATE TABLE IF NOT EXISTS public.work_order_counters (
  work_type TEXT PRIMARY KEY,
  last_number INTEGER NOT NULL DEFAULT 0
);

-- Seed the four type counters starting at their range base
INSERT INTO public.work_order_counters (work_type, last_number) VALUES
  ('Planned',   110000),
  ('PM',        120000),
  ('Breakdown', 130000),
  ('Shutdown',  140000)
ON CONFLICT (work_type) DO NOTHING;

-- RLS for counters (public access to match work_orders policy)
ALTER TABLE public.work_order_counters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on work_order_counters" ON public.work_order_counters FOR SELECT USING (true);
CREATE POLICY "Allow public update on work_order_counters" ON public.work_order_counters FOR UPDATE USING (true);

-- Replace the next_wo_number function to accept a work type
CREATE OR REPLACE FUNCTION public.next_wo_number(p_work_type TEXT DEFAULT 'Planned')
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_next INTEGER;
  v_type TEXT;
BEGIN
  -- Normalize the type
  v_type := CASE
    WHEN p_work_type IN ('Planned', 'General') THEN 'Planned'
    WHEN p_work_type = 'PM' THEN 'PM'
    WHEN p_work_type IN ('Breakdown', 'Reactive') THEN 'Breakdown'
    WHEN p_work_type = 'Shutdown' THEN 'Shutdown'
    ELSE 'Planned'
  END;

  -- Atomic increment with row lock
  UPDATE public.work_order_counters
  SET last_number = last_number + 1
  WHERE work_type = v_type
  RETURNING last_number INTO v_next;

  IF v_next IS NULL THEN
    RAISE EXCEPTION 'Unknown work type: %', p_work_type;
  END IF;

  RETURN 'WO-' || v_next::TEXT;
END;
$$;
