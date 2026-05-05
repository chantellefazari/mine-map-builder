CREATE TABLE IF NOT EXISTS public.maintenance_foundation_audit (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scope TEXT NOT NULL DEFAULT 'TCMG',
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT maintenance_foundation_audit_scope_unique UNIQUE (scope)
);

ALTER TABLE public.maintenance_foundation_audit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Foundation audit readable by all"
ON public.maintenance_foundation_audit FOR SELECT USING (true);

CREATE POLICY "Foundation audit insertable by all"
ON public.maintenance_foundation_audit FOR INSERT WITH CHECK (true);

CREATE POLICY "Foundation audit updatable by all"
ON public.maintenance_foundation_audit FOR UPDATE USING (true);

CREATE TRIGGER update_maintenance_foundation_audit_updated_at
BEFORE UPDATE ON public.maintenance_foundation_audit
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();