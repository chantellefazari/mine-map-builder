-- Update area_code and area label from COM to MILL
UPDATE public.processing_functional_locations
SET area_code = 'MILL',
    area = 'Milling',
    fl_code = REPLACE(fl_code, 'TCMG-PP-COM-', 'TCMG-PP-MILL-')
WHERE area_code = 'COM';
