ALTER TABLE public.pm_master_list
ADD COLUMN plan_category TEXT NOT NULL DEFAULT 'Preventive';

COMMENT ON COLUMN public.pm_master_list.plan_category IS 'Plan category: Preventive, Shutdown, Condition-Based, Lifecycle';