-- Create table for PO upload sessions/batches
CREATE TABLE public.po_uploads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  supplier_name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Other',
  date_range_covered TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  file_name TEXT DEFAULT '',
  file_type TEXT DEFAULT '',
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for raw PO line items extracted from uploads
CREATE TABLE public.po_line_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  upload_id UUID NOT NULL REFERENCES public.po_uploads(id) ON DELETE CASCADE,
  po_number TEXT DEFAULT '',
  po_date DATE,
  supplier TEXT DEFAULT '',
  item_description TEXT NOT NULL,
  manufacturer TEXT DEFAULT '',
  model TEXT DEFAULT '',
  part_number TEXT DEFAULT '',
  qty NUMERIC DEFAULT 0,
  unit_price NUMERIC DEFAULT 0,
  total_price NUMERIC DEFAULT 0,
  extra_references TEXT DEFAULT '',
  row_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for normalized/cleaned components
CREATE TABLE public.normalized_components (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  upload_id UUID REFERENCES public.po_uploads(id) ON DELETE SET NULL,
  component_type TEXT NOT NULL DEFAULT 'Other',
  manufacturer TEXT DEFAULT '',
  model TEXT DEFAULT '',
  part_number TEXT DEFAULT '',
  description_cleaned TEXT NOT NULL,
  supplier TEXT DEFAULT '',
  last_ordered_date DATE,
  last_ordered_po TEXT DEFAULT '',
  last_unit_price NUMERIC DEFAULT 0,
  total_orders_in_period INTEGER DEFAULT 1,
  total_qty_ordered NUMERIC DEFAULT 0,
  total_spend NUMERIC DEFAULT 0,
  notes TEXT DEFAULT '',
  review_flag BOOLEAN DEFAULT false,
  alias_descriptions TEXT DEFAULT '',
  linked_asset TEXT DEFAULT '',
  duplicate_key TEXT DEFAULT '',
  is_master BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.po_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.po_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.normalized_components ENABLE ROW LEVEL SECURITY;

-- Create policies for po_uploads
CREATE POLICY "Allow public read access on po_uploads" ON public.po_uploads FOR SELECT USING (true);
CREATE POLICY "Allow public insert on po_uploads" ON public.po_uploads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on po_uploads" ON public.po_uploads FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on po_uploads" ON public.po_uploads FOR DELETE USING (true);

-- Create policies for po_line_items
CREATE POLICY "Allow public read access on po_line_items" ON public.po_line_items FOR SELECT USING (true);
CREATE POLICY "Allow public insert on po_line_items" ON public.po_line_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on po_line_items" ON public.po_line_items FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on po_line_items" ON public.po_line_items FOR DELETE USING (true);

-- Create policies for normalized_components
CREATE POLICY "Allow public read access on normalized_components" ON public.normalized_components FOR SELECT USING (true);
CREATE POLICY "Allow public insert on normalized_components" ON public.normalized_components FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on normalized_components" ON public.normalized_components FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on normalized_components" ON public.normalized_components FOR DELETE USING (true);

-- Create indexes for performance
CREATE INDEX idx_po_line_items_upload_id ON public.po_line_items(upload_id);
CREATE INDEX idx_po_line_items_part_number ON public.po_line_items(part_number);
CREATE INDEX idx_normalized_components_part_number ON public.normalized_components(part_number);
CREATE INDEX idx_normalized_components_manufacturer_model ON public.normalized_components(manufacturer, model);
CREATE INDEX idx_normalized_components_duplicate_key ON public.normalized_components(duplicate_key);

-- Add triggers for updated_at
CREATE TRIGGER update_po_uploads_updated_at
BEFORE UPDATE ON public.po_uploads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_normalized_components_updated_at
BEFORE UPDATE ON public.normalized_components
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();