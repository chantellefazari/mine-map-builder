
INSERT INTO storage.buckets (id, name, public)
VALUES ('brand-assets', 'brand-assets', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can read brand assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'brand-assets');
