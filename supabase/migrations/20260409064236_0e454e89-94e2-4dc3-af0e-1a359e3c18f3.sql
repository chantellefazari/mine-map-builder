
-- Fix FPAR01-CMP02 → FPAR01-CMP01 (only compressor, should be 01)
UPDATE processing_plant_assets_rev_b
SET asset_number = 'FPAR01-CMP01',
    asset_name = 'Filter Area HP Air Compressor',
    updated_at = now()
WHERE asset_number = 'FPAR01-CMP02';

-- Fix child MCC cell asset number to match
UPDATE processing_plant_assets_rev_b
SET asset_number = 'FPAR01-CMP01-MCC01',
    asset_name = 'Filter Area HP Air Compressor MCC Cell',
    updated_at = now()
WHERE asset_number = 'FPAR01-CMP02-MCC01';
