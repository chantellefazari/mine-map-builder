
CREATE TABLE public.component_change_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  target_asset_number TEXT NOT NULL DEFAULT '',
  target_pid_tag TEXT NOT NULL DEFAULT '',
  part_name TEXT NOT NULL DEFAULT '',
  manufacturer TEXT NOT NULL DEFAULT '',
  part_model TEXT NOT NULL DEFAULT '',
  quantity INTEGER NOT NULL DEFAULT 1,
  notes TEXT NOT NULL DEFAULT '',
  submitted_by TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending',
  reviewer_notes TEXT NOT NULL DEFAULT '',
  reviewed_by TEXT NOT NULL DEFAULT '',
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.component_change_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on component_change_requests" ON public.component_change_requests FOR SELECT TO public USING (true);
CREATE POLICY "Allow public insert on component_change_requests" ON public.component_change_requests FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public update on component_change_requests" ON public.component_change_requests FOR UPDATE TO public USING (true);
CREATE POLICY "Allow public delete on component_change_requests" ON public.component_change_requests FOR DELETE TO public USING (true);
