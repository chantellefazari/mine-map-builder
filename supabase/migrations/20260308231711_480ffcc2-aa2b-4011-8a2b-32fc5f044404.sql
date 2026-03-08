
-- MLUB01/02 cleanup: 16 renames for parent-child prefix alignment + suffix standardisation
-- Oil Cooler (CLR) sub-components
UPDATE processing_plant_assets_rev_b SET asset_number = 'MLUB01-CLR-LCS' WHERE asset_number = 'MLUB01-CLRLCS';
UPDATE processing_plant_assets_rev_b SET asset_number = 'MLUB01-CLR-MTR' WHERE asset_number = 'MLUB01-CLRM';
UPDATE processing_plant_assets_rev_b SET asset_number = 'MLUB01-CLR-MCC' WHERE asset_number = 'MLUB01-CLRMC';
-- HP Pump (HPP) sub-components
UPDATE processing_plant_assets_rev_b SET asset_number = 'MLUB01-HPP-LCS' WHERE asset_number = 'MLUB01-HPLCS';
UPDATE processing_plant_assets_rev_b SET asset_number = 'MLUB01-HPP-MTR' WHERE asset_number = 'MLUB01-HPM';
UPDATE processing_plant_assets_rev_b SET asset_number = 'MLUB01-HPP-MCC' WHERE asset_number = 'MLUB01-HPMC';
-- LP Pump A (LPPA) sub-components
UPDATE processing_plant_assets_rev_b SET asset_number = 'MLUB01-LPPA-LCS' WHERE asset_number = 'MLUB01-LPALCS';
UPDATE processing_plant_assets_rev_b SET asset_number = 'MLUB01-LPPA-MTR' WHERE asset_number = 'MLUB01-LPAM';
UPDATE processing_plant_assets_rev_b SET asset_number = 'MLUB01-LPPA-MCC' WHERE asset_number = 'MLUB01-LPAMC';
-- LP Pump B (LPPB) sub-components
UPDATE processing_plant_assets_rev_b SET asset_number = 'MLUB01-LPPB-LCS' WHERE asset_number = 'MLUB01-LPBLCS';
UPDATE processing_plant_assets_rev_b SET asset_number = 'MLUB01-LPPB-MTR' WHERE asset_number = 'MLUB01-LPBM';
UPDATE processing_plant_assets_rev_b SET asset_number = 'MLUB01-LPPB-MCC' WHERE asset_number = 'MLUB01-LPBMC';
-- Recirculating Pump (RP) sub-components
UPDATE processing_plant_assets_rev_b SET asset_number = 'MLUB01-RP-LCS' WHERE asset_number = 'MLUB01-RPLCS';
UPDATE processing_plant_assets_rev_b SET asset_number = 'MLUB01-RP-MTR' WHERE asset_number = 'MLUB01-RPM';
UPDATE processing_plant_assets_rev_b SET asset_number = 'MLUB01-RP-MCC' WHERE asset_number = 'MLUB01-RPMC';
-- Girth Gear control panel numeric suffix
UPDATE processing_plant_assets_rev_b SET asset_number = 'MLUB02-CP01' WHERE asset_number = 'MLUB02-CP';
