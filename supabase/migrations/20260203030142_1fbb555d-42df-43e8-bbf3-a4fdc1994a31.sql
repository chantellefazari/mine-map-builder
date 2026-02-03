-- Add image_urls column to site_spares table for photo attachments
ALTER TABLE public.site_spares 
ADD COLUMN IF NOT EXISTS image_urls TEXT[] DEFAULT '{}';

-- Add comment for documentation
COMMENT ON COLUMN public.site_spares.image_urls IS 'Array of image URLs stored in visual-parts-images bucket';