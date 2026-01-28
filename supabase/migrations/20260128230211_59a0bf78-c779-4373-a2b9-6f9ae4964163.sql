-- Create site_spares table for inventory management
CREATE TABLE public.site_spares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  part_number TEXT DEFAULT '',
  description TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  subcategory TEXT DEFAULT '',
  warehouse_area TEXT DEFAULT '',
  bin_location TEXT DEFAULT '',
  aisle TEXT DEFAULT '',
  rack TEXT DEFAULT '',
  storage_type TEXT DEFAULT 'Shelved',
  qty_on_hand INTEGER DEFAULT 0,
  min_qty INTEGER DEFAULT 0,
  max_qty INTEGER DEFAULT 0,
  reorder_point INTEGER DEFAULT 0,
  uom TEXT DEFAULT 'EA',
  unit_cost NUMERIC(10,2) DEFAULT 0,
  preferred_supplier TEXT DEFAULT '',
  lead_time_days INTEGER DEFAULT 0,
  last_purchase_date DATE,
  manufacturer TEXT DEFAULT '',
  oem_part_number TEXT DEFAULT '',
  alternate_part_number TEXT DEFAULT '',
  condition TEXT DEFAULT '',
  status TEXT DEFAULT 'Active',
  is_critical BOOLEAN DEFAULT false,
  critical_spare_id TEXT DEFAULT '',
  asset_tag TEXT DEFAULT '',
  specifications TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_spares ENABLE ROW LEVEL SECURITY;

-- Allow public read access (inventory should be viewable)
CREATE POLICY "Allow public read access"
ON public.site_spares
FOR SELECT
USING (true);

-- Allow public insert/update/delete for now (no auth required for this inventory app)
CREATE POLICY "Allow public insert"
ON public.site_spares
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow public update"
ON public.site_spares
FOR UPDATE
USING (true);

CREATE POLICY "Allow public delete"
ON public.site_spares
FOR DELETE
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_site_spares_updated_at
BEFORE UPDATE ON public.site_spares
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();