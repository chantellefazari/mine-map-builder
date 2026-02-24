
CREATE TABLE public.site_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_key TEXT UNIQUE NOT NULL,
  config_value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on site_config" ON public.site_config FOR SELECT USING (true);
CREATE POLICY "Allow public insert on site_config" ON public.site_config FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on site_config" ON public.site_config FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on site_config" ON public.site_config FOR DELETE USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.site_config;
