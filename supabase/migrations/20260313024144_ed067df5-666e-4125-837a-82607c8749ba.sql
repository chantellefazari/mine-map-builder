-- Create work_requests table (separate from work_orders)
CREATE TABLE public.work_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wr_number text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'Open',
  priority text NOT NULL DEFAULT 'Normal',
  work_type text NOT NULL DEFAULT 'Breakdown',
  asset_id text NOT NULL DEFAULT '',
  functional_location text NOT NULL DEFAULT '',
  problem_description text NOT NULL DEFAULT '',
  scope_of_works text NOT NULL DEFAULT '',
  requested_by text NOT NULL DEFAULT '',
  trade text NOT NULL DEFAULT '',
  date_raised timestamp with time zone NOT NULL DEFAULT now(),
  linked_wo_id uuid REFERENCES public.work_orders(id) ON DELETE SET NULL,
  approved_by text NOT NULL DEFAULT '',
  approved_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.work_requests ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Allow public select on work_requests" ON public.work_requests FOR SELECT USING (true);
CREATE POLICY "Allow public insert on work_requests" ON public.work_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on work_requests" ON public.work_requests FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on work_requests" ON public.work_requests FOR DELETE USING (true);

-- Auto-update updated_at
CREATE TRIGGER update_work_requests_updated_at
  BEFORE UPDATE ON public.work_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Audit logging
CREATE TRIGGER audit_work_requests
  AFTER INSERT OR UPDATE OR DELETE ON public.work_requests
  FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

-- WR numbering function: WR-5XXXXX (starts at 500001)
CREATE OR REPLACE FUNCTION public.next_wr_number()
  RETURNS text
  LANGUAGE sql
  STABLE
  SET search_path TO 'public'
AS $$
  SELECT 'WR-' || (COALESCE(
    MAX(CAST(SUBSTRING(wr_number FROM 4) AS INTEGER)),
    500000
  ) + 1)::TEXT
  FROM public.work_requests;
$$;