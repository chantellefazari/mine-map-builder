-- Add image_url column to supplier_catalogue table
ALTER TABLE public.supplier_catalogue 
ADD COLUMN image_url text DEFAULT '';

-- Create storage bucket for catalogue images
INSERT INTO storage.buckets (id, name, public)
VALUES ('catalogue-images', 'catalogue-images', true);

-- Allow public read access to catalogue images
CREATE POLICY "Public can view catalogue images"
ON storage.objects FOR SELECT
USING (bucket_id = 'catalogue-images');

-- Allow anyone to upload catalogue images
CREATE POLICY "Anyone can upload catalogue images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'catalogue-images');

-- Allow anyone to update catalogue images
CREATE POLICY "Anyone can update catalogue images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'catalogue-images');

-- Allow anyone to delete catalogue images
CREATE POLICY "Anyone can delete catalogue images"
ON storage.objects FOR DELETE
USING (bucket_id = 'catalogue-images');