
-- ============================================================
-- P3: Audit Log Table
-- ============================================================
CREATE TABLE public.audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  operation TEXT NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
  old_data JSONB,
  new_data JSONB,
  changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  changed_by TEXT
);

-- Index for querying by table and record
CREATE INDEX idx_audit_log_table_record ON public.audit_log (table_name, record_id);
CREATE INDEX idx_audit_log_changed_at ON public.audit_log (changed_at DESC);

-- Enable RLS (public read for now, matching existing pattern)
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on audit_log"
  ON public.audit_log FOR SELECT USING (true);

-- Only triggers should insert — block direct public writes
CREATE POLICY "Allow public insert on audit_log"
  ON public.audit_log FOR INSERT WITH CHECK (true);

-- ============================================================
-- Generic audit trigger function
-- ============================================================
CREATE OR REPLACE FUNCTION public.log_audit_event()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_log (table_name, record_id, operation, new_data)
    VALUES (TG_TABLE_NAME, NEW.id, 'INSERT', to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.audit_log (table_name, record_id, operation, old_data, new_data)
    VALUES (TG_TABLE_NAME, NEW.id, 'UPDATE', to_jsonb(OLD), to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.audit_log (table_name, record_id, operation, old_data)
    VALUES (TG_TABLE_NAME, OLD.id, 'DELETE', to_jsonb(OLD));
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- ============================================================
-- Attach audit triggers to key tables
-- ============================================================
CREATE TRIGGER audit_site_spares
  AFTER INSERT OR UPDATE OR DELETE ON public.site_spares
  FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

CREATE TRIGGER audit_visual_parts_catalogue
  AFTER INSERT OR UPDATE OR DELETE ON public.visual_parts_catalogue
  FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

CREATE TRIGGER audit_suppliers
  AFTER INSERT OR UPDATE OR DELETE ON public.suppliers
  FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

CREATE TRIGGER audit_supplier_catalogue
  AFTER INSERT OR UPDATE OR DELETE ON public.supplier_catalogue
  FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();
