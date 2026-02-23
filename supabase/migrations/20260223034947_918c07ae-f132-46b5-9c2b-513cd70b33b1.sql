CREATE OR REPLACE FUNCTION public.next_po_number()
 RETURNS text
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $$
  SELECT 'PO-' || LPAD((GREATEST(COALESCE(MAX(CAST(SUBSTRING(po_number FROM 4) AS INTEGER)), 0), 10) + 1)::TEXT, 6, '0')
  FROM public.po_tracker;
$$;