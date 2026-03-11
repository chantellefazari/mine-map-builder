CREATE POLICY "Allow public read temp-pdfs" ON storage.objects FOR SELECT USING (bucket_id = 'temp-pdfs');
CREATE POLICY "Allow authenticated upload temp-pdfs" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'temp-pdfs');
CREATE POLICY "Allow authenticated delete temp-pdfs" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'temp-pdfs');