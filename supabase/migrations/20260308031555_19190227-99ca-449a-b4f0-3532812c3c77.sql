-- Create a dedicated storage bucket for source documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('source-documents', 'source-documents', true)
ON CONFLICT (id) DO NOTHING;

-- RLS: anyone can read (for display/download)
CREATE POLICY "Allow public read on source-documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'source-documents');

-- RLS: authenticated users can upload
CREATE POLICY "Allow authenticated upload to source-documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'source-documents');