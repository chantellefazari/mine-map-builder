
-- Rev B P&ID Extraction Register
CREATE TABLE public.rev_b_pid_extraction_register (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_doc_name TEXT NOT NULL,
  page_number INTEGER NOT NULL,
  drawing_number TEXT NOT NULL DEFAULT '',
  tag_type TEXT NOT NULL CHECK (tag_type IN ('Equipment','Valve','Instrument','Line','Motor','Other')),
  tag_id TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  area_clue TEXT NOT NULL DEFAULT '',
  upstream_tag TEXT NOT NULL DEFAULT '',
  downstream_tag TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  confidence TEXT NOT NULL DEFAULT 'High' CHECK (confidence IN ('High','Med','Low')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.rev_b_pid_extraction_register ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on rev_b_pid_extraction_register" ON public.rev_b_pid_extraction_register FOR SELECT USING (true);
CREATE POLICY "Allow public insert on rev_b_pid_extraction_register" ON public.rev_b_pid_extraction_register FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on rev_b_pid_extraction_register" ON public.rev_b_pid_extraction_register FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on rev_b_pid_extraction_register" ON public.rev_b_pid_extraction_register FOR DELETE USING (true);

CREATE INDEX idx_rev_b_extraction_tag_type ON public.rev_b_pid_extraction_register(tag_type);
CREATE INDEX idx_rev_b_extraction_page ON public.rev_b_pid_extraction_register(page_number);
CREATE INDEX idx_rev_b_extraction_tag_id ON public.rev_b_pid_extraction_register(tag_id);
