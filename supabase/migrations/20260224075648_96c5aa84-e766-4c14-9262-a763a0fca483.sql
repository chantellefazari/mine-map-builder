
-- Add new columns to po_tracker for PO Register
ALTER TABLE public.po_tracker
  ADD COLUMN IF NOT EXISTS pr_id UUID REFERENCES public.purchase_requests(id),
  ADD COLUMN IF NOT EXISTS supervisor TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS total_value NUMERIC NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS freight_required BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS attachment_url TEXT DEFAULT '';

-- Update the next_po_number function to use TCMG-YYYY-XXXX format
CREATE OR REPLACE FUNCTION public.next_po_number()
 RETURNS text
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $$
  SELECT 'TCMG-' || EXTRACT(YEAR FROM now())::TEXT || '-' ||
    LPAD((COALESCE(
      MAX(CAST(SUBSTRING(po_number FROM '[0-9]+$') AS INTEGER)), 0
    ) + 1)::TEXT, 4, '0')
  FROM public.po_tracker
  WHERE po_number LIKE 'TCMG-%';
$$;
