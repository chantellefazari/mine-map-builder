-- Create suppliers table for the Supplier Register
CREATE TABLE public.suppliers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL DEFAULT '',
  name TEXT NOT NULL,
  contact TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL DEFAULT 'Trade / General Supplier',
  work_phone TEXT NOT NULL DEFAULT '',
  mobile TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  what_used_for TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

-- Create public access policies (same pattern as site_spares)
CREATE POLICY "Allow public read access" 
ON public.suppliers 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert" 
ON public.suppliers 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update" 
ON public.suppliers 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow public delete" 
ON public.suppliers 
FOR DELETE 
USING (true);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_suppliers_updated_at
BEFORE UPDATE ON public.suppliers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();