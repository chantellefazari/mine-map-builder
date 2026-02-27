-- Expand frequency constraint to include 26 Week and 52 Week
ALTER TABLE public.pm_master_list DROP CONSTRAINT pm_master_list_frequency_check;
ALTER TABLE public.pm_master_list ADD CONSTRAINT pm_master_list_frequency_check
  CHECK (frequency = ANY (ARRAY['Daily','1 Week','2 Week','4 Week','6 Week','12 Week','26 Week','52 Week']));