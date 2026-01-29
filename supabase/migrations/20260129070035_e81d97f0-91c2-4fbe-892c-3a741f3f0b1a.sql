-- Add new fields to suppliers table
ALTER TABLE public.suppliers 
ADD COLUMN IF NOT EXISTS location TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS is_preferred BOOLEAN NOT NULL DEFAULT false;

-- Create supplier catalogue table for OEM parts data
CREATE TABLE public.supplier_catalogue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  supplier_id UUID REFERENCES public.suppliers(id) ON DELETE SET NULL,
  supplier_name TEXT NOT NULL DEFAULT '',
  oem_brand TEXT NOT NULL DEFAULT '',
  component_type TEXT NOT NULL DEFAULT '',
  component_description TEXT NOT NULL,
  oem_part_number TEXT NOT NULL DEFAULT '',
  alternate_part_numbers TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  priority_tag TEXT NOT NULL DEFAULT 'Medium',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.supplier_catalogue ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public access (matching existing pattern)
CREATE POLICY "Allow public read access" 
ON public.supplier_catalogue 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert" 
ON public.supplier_catalogue 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update" 
ON public.supplier_catalogue 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow public delete" 
ON public.supplier_catalogue 
FOR DELETE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_supplier_catalogue_updated_at
BEFORE UPDATE ON public.supplier_catalogue
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();