-- Decode generic "Valve" descriptions using valve type codes from naming conventions
-- V01=Ball, V05=Butterfly, V08=Check, V10=Knife Gate, NP=Non-return/Pinch

-- Gravity Circuit
UPDATE processing_plant_assets_rev_b SET asset_name = '15mm Valve' WHERE asset_number = '15V03-V251';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Check Valve 50mm' WHERE asset_number = '50V08-V258';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Check Valve 50mm' WHERE asset_number = '50V08-V261';
UPDATE processing_plant_assets_rev_b SET asset_name = '80mm Valve' WHERE asset_number = '80V04-V256';

-- Elution
UPDATE processing_plant_assets_rev_b SET asset_name = 'Check Valve 50mm' WHERE asset_number = 'V108-50V08';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Check Valve 50mm' WHERE asset_number = 'V171-50V08';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Knife Gate Valve 50mm' WHERE asset_number = 'V168-50V10';
UPDATE processing_plant_assets_rev_b SET asset_name = '50mm Valve' WHERE asset_number = 'V167-50V9';

-- Gold Room / Electrowinning
UPDATE processing_plant_assets_rev_b SET asset_name = '10mm Valve' WHERE asset_number = 'V111-10V02';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Non-Return Valve 32mm' WHERE asset_number = 'V127-32NPa';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Knife Gate Valve 50mm' WHERE asset_number = 'V134-50V10';

-- Water
UPDATE processing_plant_assets_rev_b SET asset_name = 'Reducer Valve 160x200mm' WHERE asset_number = 'V304-160x200';

-- Reagents
UPDATE processing_plant_assets_rev_b SET asset_name = 'Knife Gate Valve 80mm' WHERE asset_number = '80V10-V064';