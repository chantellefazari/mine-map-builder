-- Fix 1: Rename Power Station Generators GEN01-GEN08 to PGEN01-PGEN08 to avoid clash with system header
UPDATE processing_plant_assets_rev_b SET asset_number = 'PGEN01' WHERE asset_number = 'GEN01' AND parent_asset_label = 'GEN01 Generators';
UPDATE processing_plant_assets_rev_b SET asset_number = 'PGEN02' WHERE asset_number = 'GEN02' AND parent_asset_label = 'GEN01 Generators';
UPDATE processing_plant_assets_rev_b SET asset_number = 'PGEN03' WHERE asset_number = 'GEN03' AND parent_asset_label = 'GEN01 Generators';
UPDATE processing_plant_assets_rev_b SET asset_number = 'PGEN04' WHERE asset_number = 'GEN04' AND parent_asset_label = 'GEN01 Generators';
UPDATE processing_plant_assets_rev_b SET asset_number = 'PGEN05' WHERE asset_number = 'GEN05' AND parent_asset_label = 'GEN01 Generators';
UPDATE processing_plant_assets_rev_b SET asset_number = 'PGEN06' WHERE asset_number = 'GEN06' AND parent_asset_label = 'GEN01 Generators';
UPDATE processing_plant_assets_rev_b SET asset_number = 'PGEN07' WHERE asset_number = 'GEN07' AND parent_asset_label = 'GEN01 Generators';
UPDATE processing_plant_assets_rev_b SET asset_number = 'PGEN08' WHERE asset_number = 'GEN08' AND parent_asset_label = 'GEN01 Generators';

-- Also rename any component references (GEN01-xxx → PGEN01-xxx etc)
UPDATE processing_plant_assets_rev_b SET asset_number = REPLACE(asset_number, 'GEN01-', 'PGEN01-') WHERE asset_number LIKE 'GEN01-%' AND parent_asset_label = 'GEN01 Generators';
UPDATE processing_plant_assets_rev_b SET asset_number = REPLACE(asset_number, 'GEN02-', 'PGEN02-') WHERE asset_number LIKE 'GEN02-%' AND parent_asset_label = 'GEN01 Generators';
UPDATE processing_plant_assets_rev_b SET asset_number = REPLACE(asset_number, 'GEN03-', 'PGEN03-') WHERE asset_number LIKE 'GEN03-%' AND parent_asset_label = 'GEN01 Generators';
UPDATE processing_plant_assets_rev_b SET asset_number = REPLACE(asset_number, 'GEN04-', 'PGEN04-') WHERE asset_number LIKE 'GEN04-%' AND parent_asset_label = 'GEN01 Generators';
UPDATE processing_plant_assets_rev_b SET asset_number = REPLACE(asset_number, 'GEN05-', 'PGEN05-') WHERE asset_number LIKE 'GEN05-%' AND parent_asset_label = 'GEN01 Generators';
UPDATE processing_plant_assets_rev_b SET asset_number = REPLACE(asset_number, 'GEN06-', 'PGEN06-') WHERE asset_number LIKE 'GEN06-%' AND parent_asset_label = 'GEN01 Generators';
UPDATE processing_plant_assets_rev_b SET asset_number = REPLACE(asset_number, 'GEN07-', 'PGEN07-') WHERE asset_number LIKE 'GEN07-%' AND parent_asset_label = 'GEN01 Generators';
UPDATE processing_plant_assets_rev_b SET asset_number = REPLACE(asset_number, 'GEN08-', 'PGEN08-') WHERE asset_number LIKE 'GEN08-%' AND parent_asset_label = 'GEN01 Generators';