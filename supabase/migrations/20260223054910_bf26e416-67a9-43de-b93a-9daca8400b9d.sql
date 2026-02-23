-- Update the default value for work_type in work_orders table
ALTER TABLE public.work_orders 
ALTER COLUMN work_type SET DEFAULT 'Breakdown';

-- Update existing 'Reactive' work types to 'Breakdown'
UPDATE public.work_orders 
SET work_type = 'Breakdown' 
WHERE work_type = 'Reactive';