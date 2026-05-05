-- Deduplicate any existing rows per scope, keep most recent
DELETE FROM public.maintenance_foundation_audit a
USING public.maintenance_foundation_audit b
WHERE a.scope = b.scope
  AND a.updated_at < b.updated_at;

-- Add unique constraint so upsert(onConflict: scope) works reliably
ALTER TABLE public.maintenance_foundation_audit
  ADD CONSTRAINT maintenance_foundation_audit_scope_key UNIQUE (scope);