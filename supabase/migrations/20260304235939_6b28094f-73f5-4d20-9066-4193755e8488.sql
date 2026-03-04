
-- Remove made-up lab equipment, keep only LAB01 (Laboratory) as placeholder
DELETE FROM processing_plant_assets_rev_b
WHERE sub_area = 'Lab' AND asset_number != 'LAB01';
