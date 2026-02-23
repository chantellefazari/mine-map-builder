
CREATE OR REPLACE FUNCTION public.next_po_number()
 RETURNS text
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  SELECT 'PO-8' || LPAD((COALESCE(MAX(CAST(SUBSTRING(po_number FROM 5) AS INTEGER)), 0) + 1)::TEXT, 4, '0')
  FROM public.po_tracker
  WHERE po_number LIKE 'PO-8%';
$function$;
