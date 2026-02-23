
ALTER TABLE public.work_orders
  ADD COLUMN returned_to_service text NOT NULL DEFAULT '',
  ADD COLUMN technician_name text NOT NULL DEFAULT '',
  ADD COLUMN technician_sign_date text NOT NULL DEFAULT '',
  ADD COLUMN supervisor_name text NOT NULL DEFAULT '',
  ADD COLUMN supervisor_sign_date text NOT NULL DEFAULT '',
  ADD COLUMN operations_handover_name text NOT NULL DEFAULT '',
  ADD COLUMN operations_handover_date text NOT NULL DEFAULT '';
