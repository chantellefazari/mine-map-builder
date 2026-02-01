-- Create table for Visual Parts Catalogue (site-specific visual inventory)
CREATE TABLE public.visual_parts_catalogue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  site_part_number TEXT NOT NULL UNIQUE,
  part_name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  associated_asset TEXT DEFAULT '',
  criticality TEXT NOT NULL DEFAULT 'Non-Critical',
  notes TEXT DEFAULT '',
  image_urls TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.visual_parts_catalogue ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (same pattern as other tables)
CREATE POLICY "Allow public read access on visual_parts_catalogue" 
ON public.visual_parts_catalogue 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert on visual_parts_catalogue" 
ON public.visual_parts_catalogue 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update on visual_parts_catalogue" 
ON public.visual_parts_catalogue 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow public delete on visual_parts_catalogue" 
ON public.visual_parts_catalogue 
FOR DELETE 
USING (true);

-- Create storage bucket for visual catalogue images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('visual-parts-images', 'visual-parts-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for the bucket
CREATE POLICY "Allow public read on visual-parts-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'visual-parts-images');

CREATE POLICY "Allow public insert on visual-parts-images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'visual-parts-images');

CREATE POLICY "Allow public update on visual-parts-images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'visual-parts-images');

CREATE POLICY "Allow public delete on visual-parts-images"
ON storage.objects FOR DELETE
USING (bucket_id = 'visual-parts-images');

-- Trigger for updated_at
CREATE TRIGGER update_visual_parts_catalogue_updated_at
BEFORE UPDATE ON public.visual_parts_catalogue
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();