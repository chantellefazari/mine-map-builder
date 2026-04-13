ALTER TABLE public.work_orders 
ADD COLUMN duty_type TEXT NOT NULL DEFAULT 'Online';

COMMENT ON COLUMN public.work_orders.duty_type IS 'Whether work can be done Online (plant running) or Offline (requires shutdown). Replaces the legacy 14-series Shutdown WO type.';