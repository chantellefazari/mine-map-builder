
-- Work order parts tracking table
CREATE TABLE public.work_order_parts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  work_order_id UUID NOT NULL REFERENCES public.work_orders(id) ON DELETE CASCADE,
  part_description TEXT NOT NULL DEFAULT '',
  part_number TEXT NOT NULL DEFAULT '',
  quantity_required INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'Not Ordered',
  location TEXT NOT NULL DEFAULT '',
  comment TEXT NOT NULL DEFAULT '',
  last_updated_by TEXT NOT NULL DEFAULT '',
  last_updated_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.work_order_parts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on work_order_parts" ON public.work_order_parts FOR SELECT USING (true);
CREATE POLICY "Allow public insert on work_order_parts" ON public.work_order_parts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on work_order_parts" ON public.work_order_parts FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on work_order_parts" ON public.work_order_parts FOR DELETE USING (true);

-- Work order parts audit log
CREATE TABLE public.work_order_parts_audit (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  work_order_part_id UUID NOT NULL REFERENCES public.work_order_parts(id) ON DELETE CASCADE,
  work_order_id UUID NOT NULL REFERENCES public.work_orders(id) ON DELETE CASCADE,
  field_changed TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  changed_by TEXT NOT NULL DEFAULT '',
  changed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.work_order_parts_audit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on work_order_parts_audit" ON public.work_order_parts_audit FOR SELECT USING (true);
CREATE POLICY "Allow public insert on work_order_parts_audit" ON public.work_order_parts_audit FOR INSERT WITH CHECK (true);

-- Trigger to auto-log changes to tracked fields
CREATE OR REPLACE FUNCTION public.log_work_order_part_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.work_order_parts_audit (work_order_part_id, work_order_id, field_changed, old_value, new_value, changed_by)
    VALUES (NEW.id, NEW.work_order_id, 'status', OLD.status, NEW.status, NEW.last_updated_by);
  END IF;
  IF OLD.location IS DISTINCT FROM NEW.location THEN
    INSERT INTO public.work_order_parts_audit (work_order_part_id, work_order_id, field_changed, old_value, new_value, changed_by)
    VALUES (NEW.id, NEW.work_order_id, 'location', OLD.location, NEW.location, NEW.last_updated_by);
  END IF;
  IF OLD.quantity_required IS DISTINCT FROM NEW.quantity_required THEN
    INSERT INTO public.work_order_parts_audit (work_order_part_id, work_order_id, field_changed, old_value, new_value, changed_by)
    VALUES (NEW.id, NEW.work_order_id, 'quantity_required', OLD.quantity_required::TEXT, NEW.quantity_required::TEXT, NEW.last_updated_by);
  END IF;
  IF OLD.comment IS DISTINCT FROM NEW.comment THEN
    INSERT INTO public.work_order_parts_audit (work_order_part_id, work_order_id, field_changed, old_value, new_value, changed_by)
    VALUES (NEW.id, NEW.work_order_id, 'comment', OLD.comment, NEW.comment, NEW.last_updated_by);
  END IF;
  NEW.updated_at = now();
  NEW.last_updated_date = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER trg_log_wo_part_changes
BEFORE UPDATE ON public.work_order_parts
FOR EACH ROW
EXECUTE FUNCTION public.log_work_order_part_changes();

-- Auto-update updated_at
CREATE TRIGGER update_work_order_parts_updated_at
BEFORE UPDATE ON public.work_order_parts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
