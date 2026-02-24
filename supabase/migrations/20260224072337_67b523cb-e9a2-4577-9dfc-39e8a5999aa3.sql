
-- Add labour_hours JSONB column to store per-row labour data
ALTER TABLE public.work_orders
ADD COLUMN labour_hours jsonb NOT NULL DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.work_orders.labour_hours IS 'Array of {name, trade, date, start_time, end_time, total_hrs} objects';
