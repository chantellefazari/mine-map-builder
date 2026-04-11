-- Update GR → REC
UPDATE public.processing_functional_locations
SET area_code = 'REC',
    fl_code = REPLACE(fl_code, 'TCMG-PP-GR-', 'TCMG-PP-REC-')
WHERE area_code = 'GR';

-- Update SUP → MOB
UPDATE public.processing_functional_locations
SET area_code = 'MOB',
    area = 'Mobile Equipment',
    fl_code = REPLACE(fl_code, 'TCMG-PP-SUP-', 'TCMG-PP-MOB-')
WHERE area_code = 'SUP';
