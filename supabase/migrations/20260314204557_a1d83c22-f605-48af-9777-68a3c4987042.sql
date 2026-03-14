
ALTER TABLE pm_master_list DROP CONSTRAINT pm_master_list_discipline_check;
ALTER TABLE pm_master_list ADD CONSTRAINT pm_master_list_discipline_check CHECK (discipline IN ('Mechanical', 'Electrical', 'Ops', 'Inspection', 'Mobile Equipment', 'Lube'));
