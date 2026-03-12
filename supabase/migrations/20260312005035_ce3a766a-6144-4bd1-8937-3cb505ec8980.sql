-- Standardize area_code from COMM to COM to match approved hierarchy codes
UPDATE processing_functional_locations 
SET area_code = 'COM', fl_code = REPLACE(fl_code, 'TCMG-PP-COMM-', 'TCMG-PP-COM-')
WHERE area_code = 'COMM';

-- Also update the asset tree FL codes to match
UPDATE processing_plant_assets_rev_b
SET functional_location = REPLACE(functional_location, 'TCMG-PP-COMM-', 'TCMG-PP-COM-'),
    updated_at = now()
WHERE functional_location LIKE 'TCMG-PP-COMM-%';