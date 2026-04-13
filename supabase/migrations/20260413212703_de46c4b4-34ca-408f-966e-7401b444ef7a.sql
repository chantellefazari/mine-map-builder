
-- Repurpose Shutdown row to Out of Scope
UPDATE public.work_order_counters
SET work_type = 'Out of Scope'
WHERE work_type = 'Shutdown';

-- Drop and recreate function
DROP FUNCTION IF EXISTS public.next_wo_number(TEXT);

CREATE FUNCTION public.next_wo_number(p_work_type TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_next INTEGER;
  v_type TEXT;
BEGIN
  v_type := CASE
    WHEN p_work_type IN ('Planned', 'General') THEN 'Planned'
    WHEN p_work_type = 'PM' THEN 'PM'
    WHEN p_work_type IN ('Breakdown', 'Reactive') THEN 'Breakdown'
    WHEN p_work_type IN ('Out of Scope', 'OOS') THEN 'Out of Scope'
    ELSE 'Planned'
  END;

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
