INSERT INTO storage.buckets (id, name, public) VALUES ('wr-photos', 'wr-photos', true);

CREATE POLICY "Allow public upload to wr-photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'wr-photos');
CREATE POLICY "Allow public read from wr-photos" ON storage.objects FOR SELECT USING (bucket_id = 'wr-photos');
CREATE POLICY "Allow public delete from wr-photos" ON storage.objects FOR DELETE USING (bucket_id = 'wr-photos');